import * as sql from 'mssql';
import FieldDef from '../models/fielddef';

import FieldUpdate from "../models/fieldUpdate";

import Project from "../models/project";
import ProjectFilter from '../models/projectFilter';
import ProjectSpecification from '../specifications/specification.project';
import ProjectQuery from '../models/projectQuery';

const baseLookup = function() {
    return `
    /* COLLECT JSON DATA FOR FIELD */
    SELECT
        p.id,
        p.name,
        p.project_type,
        p.status,
        p.date_created,
        (
            SELECT * FROM (
                SELECT 
                f.id as 'id',
                d.id as 'field_id',
                d.name as 'key',
                f.value as 'value'
            FROM
                field_data f
            INNER JOIN
                field_defs d ON f.field_id = d.id
            WHERE
                f.project_id = l.id
            UNION ALL
            SELECT 
                f2.id as 'id',
                d.id as 'field_id',
                d.name as 'key',
                convert(varchar, f2.value, 23) as 'value'
            FROM
                field_dates f2
            INNER JOIN
                field_defs d ON f2.field_id = d.id
            WHERE
                f2.project_id = l.id
            
            UNION ALL
            SELECT 
                f3.id as 'id',
                d.id as 'field_id',
                d.name as 'key',
                CAST(f3.value as varchar) as 'value'
            FROM
                field_related f3
            INNER JOIN
                field_defs d ON f3.field_id = d.id
            WHERE
                f3.project_id = l.id
            UNION ALL
            SELECT 
                f4.id as 'id',
                d.id as 'field_id',
                d.name as 'key',
                CAST(f4.value as varchar) as 'value'
            FROM
                field_bools f4
            INNER JOIN
                field_defs d ON f4.field_id = d.id
            WHERE
                f4.project_id = l.id
            ) as nested
            FOR JSON PATH
        ) as fields,
        (
            SELECT
                u.id,
                fu.field_id,
                u.uuid,
                u.filename,
                u.original_filename,
                u.content_type,
                CONCAT('/upload/', u.uuid, '/', u.filename) as publicPath,
                CASE
                    WHEN u.preview_filename is null THEN null
                    ELSE CONCAT('/upload/', u.uuid, '/', u.preview_filename, '?preview=1')
                END as previewPath
            FROM field_uploads fu
            INNER JOIN uploads u ON u.id = fu.value
            WHERE fu.project_id = l.id
            FOR JSON PATH
        ) as files
    FROM
        project_list l
    INNER JOIN projects p ON l.id = p.id
    ORDER BY p.id ASC
    `;
}

const newProject = function (pool: sql.ConnectionPool, project: Project) {
    const insert = `
    INSERT INTO projects
        (name, project_type, status)
    VALUES
        (@name, @type, 1);
    SELECT SCOPE_IDENTITY() as id;
    `
    
    const request : sql.Request = pool.request();
    request.input('name', sql.VarChar, project.name);
    request.input('type', sql.Int, project.project_type);
    request.multiple = true;
    return request.query(insert);
}

const getProjectCount = function (pool: sql.ConnectionPool, type: number) {
    const select = `
    SELECT COUNT(id) as 'total'
    FROM projects
    WHERE project_type = @type;
`;
    const request: sql.Request = pool.request();
    request.input('type', sql.Int, type);
    request.multiple = true;
    return request.query(select);
}

const getProjects = function (pool: sql.ConnectionPool, spec: ProjectSpecification) {
    const filters = spec.getFilters();
    const query: ProjectQuery = new ProjectQuery( pool.request(), spec.type );
    query.expandFilters(filters);

    // set up filters
    const select = `
    /* SELECT THE LIST OF PROJECTS */
    WITH project_list as (
        SELECT DISTINCT
            p.id FROM projects p
            ${ query.joinString() }
        WHERE
            project_type = @ptype
        ${ query.whereString() }
    )
    ${ baseLookup() }
    `;

    return query.request.query(select);
}

const getProjectById = function (pool: sql.ConnectionPool, id: number) {
    const select = `
    /* SELECT THE LIST OF PROJECTS */
    WITH project_list as (
        SELECT id FROM projects
        WHERE id = @id
    )
    ${ baseLookup() }
`;

    const request = pool.request();
    request.input('id', sql.Int, id);
    request.multiple = true;

    return request.query(select);
};

const updateProject = function (pool: sql.ConnectionPool, id: number,  fields: Array<FieldUpdate>, definitions: Map<string, FieldDef>) {
    const request = pool.request();

    let update : string[] = [];


    fields.forEach( x => {
        const def = definitions.get(x.field_id.toString()) ? definitions.get(x.field_id.toString()) : undefined;

        // create the update string
        update.push( x.toUpdateString(x.field_id, def) );

        // bind the input parameters (sql injection prevention)
        request.input(`${x.paramID}_f`, sql.Int, x.field_id);
        if (def?.data_type == 3) {
            // dates
            request.input(`${x.paramID}_v`, sql.Date,  x.value);
        } else if (def?.data_type == 4) {
            // bools
            request.input(`${x.paramID}_v`, sql.Bit, x.value ? 1 : 0);
        } else {
            request.input(`${x.paramID}_v`, sql.VarChar, x.value);
        }
    });

    const updateString = update.join("\r\n");

    request.multiple = true;
    request.input('id', sql.Int, id);

    return request.query(updateString);
};

const getProjectType = function (pool: sql.ConnectionPool, id: number) {
    const select = `
        SELECT project_type FROM projects
        WHERE id = @id
`;

    const request = pool.request();
    request.input('id', sql.Int, id);
    request.multiple = true;
    return request.query(select);
}

const getProjectChildData = function (pool: sql.ConnectionPool, id: number) {
    const select = `
    /* SELECT THE LIST OF PROJECTS */
    WITH project_list as (
        SELECT
            rel.value as id
        FROM field_related rel
        WHERE rel.project_id = @id
    )
    ${ baseLookup()}
`;

    const request = pool.request();
    request.input('id', sql.Int, id);
    request.multiple = true;
    return request.query(select);
}


const getProjectMetaForField = function (pool: sql.ConnectionPool, fieldID: number, projectID: number) {
    const select = `
    SELECT
        defs.id as 'field_id',
        @proj as 'project_id',
        (
            SELECT *
            FROM View_Field_Output v
            WHERE v.project_id = @proj			
            FOR JSON AUTO
        ) as child_meta
    FROM field_defs defs
    WHERE defs.id = @field
`;
    const request = pool.request();
    request.input('field', sql.Int, fieldID);
    request.input('proj', sql.Int, projectID);
    request.multiple = true;
    return request.query(select);
}

const _ = {
    newProject,
    getProjectCount,
    getProjects,
    getProjectById,
    getProjectType,
    updateProject,
    getProjectChildData,
    getProjectMetaForField
}

export default _;
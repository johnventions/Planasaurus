import * as sql from 'mssql';
import FieldDef from '../models/fielddef';

import FieldUpdate from "../models/fieldUpdate";

import Project from "../models/project";
import ProjectFilter from '../models/projectFilter';
import ProjectSpecification from '../specifications/specification.project';


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
                ) as nested
            ) as json_data
            FOR JSON AUTO
        ) as fields
    FROM
        project_list l
    INNER JOIN projects p ON l.id = p.id
    ORDER BY p.id ASC
    `;
}

const getFilters = function (filters: Map<string, any>, definitions: Map<string, FieldDef>): ProjectFilter[] {
    const projectFilters: ProjectFilter[] = [];
    let i = 0;
    filters.forEach((value, key) => {
        const def = definitions.has(key) ? definitions.get(key) : undefined;
        console.log(def);
        projectFilters.push(
             new ProjectFilter(i, key, key, value.toString(), def)
        )
        i++;
    });
    return projectFilters;
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

const expandFilters = function (filters: ProjectFilter[]) {
    if (filters.length > 0) {
        const joins: string[] = [];
        const wheres: string[] = [];
        filters.forEach(
            x => {
                joins.push(x.joinStatement);
                wheres.push(x.whereStatement);
            }
        )
        return {
            joins: joins.join(" "),
            wheres: wheres.join(" ")
        };
    }
    return {
        joins: '',
        wheres: ''
    };
}


const getProjectCount = function (pool: sql.ConnectionPool, type: Number) {
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
    const filters = spec.fields ? getFilters(spec.fields, spec.definitions) : [];
    const filterStrings: any = expandFilters(filters);
    const select = `
    /* SELECT THE LIST OF PROJECTS */
    WITH project_list as (
        SELECT
            p.id FROM projects p
            ${ filterStrings.joins }
        WHERE
            project_type = @ptype
        ${ filterStrings.wheres }
    )
    ${ baseLookup()}
`;

    const request : sql.Request = pool.request();
    request.input('ptype', sql.Int, spec.type);
    request.multiple = true;
    filters.forEach( f => {
        request.input(f.param, `${ f.value }`);
    })
    return request.query(select);
}

const getProjectById = function (pool: sql.ConnectionPool, id: Number) {
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

const updateProject = function (pool: sql.ConnectionPool, id: Number,  fields: Array<FieldUpdate>, definitions: Map<string, FieldDef>) {
    const request = pool.request();

    // create the update string
    let update = fields.map((x) => {
        const def = definitions.get(x.field_id.toString()) ? definitions.get(x.field_id.toString()) : undefined;
        return x.toUpdateString(x.field_id, def);
    }).join("\r\n");


    // bind the input parameters (sql injection prevention)
    fields.forEach( x => {
        request.input(`${x.paramID}_v`, sql.VarChar, x.value);
        request.input(`${x.paramID}_f`, sql.Int, x.field_id);
    });
    
    request.multiple = true;
    request.input('id', sql.Int, id);

    return request.query(update);
};

const getProjectType = function (pool: sql.ConnectionPool, id: Number) {
    const select = `
        SELECT project_type FROM projects
        WHERE id = @id
`;

    const request = pool.request();
    request.input('id', sql.Int, id);
    request.multiple = true;
    return request.query(select);
}


const _ = {
    newProject,
    getProjectCount,
    getProjects,
    getProjectById,
    getProjectType,
    updateProject
}

export default _;
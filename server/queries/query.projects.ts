import * as sql from 'mssql';

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
            ) as json_data
            FOR JSON AUTO
        ) as fields
    FROM
        project_list l
    INNER JOIN projects p ON l.id = p.id`;
}

const getFilters = function (filters: Map<string, any>): ProjectFilter[] {
    const projectFilters: ProjectFilter[] = [];
    let i = 0;
    filters.forEach((value, key) => {
        projectFilters.push(
             new ProjectFilter(i, key, 1, value.toString())
        )
        i++;
    });
    return projectFilters;
}


const newProject = function (pool: sql.ConnectionPool, project: Project) {
    const insert = `
    INSERT INTO projects
        (name, project_type, status, date_created)
    VALUES
        (@name, @type, @status, @date);
    SELECT SCOPE_IDENTITY() as id;
    `
    
    const request : sql.Request = pool.request();
    request.input('name', sql.VarChar, project.name);
    request.input('type', sql.Int, project.project_type);
    request.input('status', sql.Int, project.status);
    request.input('date', sql.DateTime, project.date_created);
    request.multiple = true;
    return request.query(insert);
}

const getProjects = function (pool: sql.ConnectionPool, spec: ProjectSpecification) {
    const filters = spec.fields ? getFilters(spec.fields) : [];
    const select = `
    /* SELECT THE LIST OF PROJECTS */
    WITH project_list as (
        SELECT
            p.id FROM projects p
        WHERE
            project_type = @ptype
    )
    ${ baseLookup()}
`;

    const request : sql.Request = pool.request();
    request.input('ptype', sql.Int, spec.type);
    request.multiple = true;
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

const updateProject = function (pool: sql.ConnectionPool, id: Number,  fields: Array<FieldUpdate>) {
    const request = pool.request();

    // create the update string
    let update = fields.map((x) => {
        return x.toUpdateString();
    }).join("\r\n");

    // bind the input parameters (sql injection prevention)
    fields.forEach( x => {
        request.input(`${x.paramID}_v`, sql.VarChar, x.value);
        request.input(`${x.paramID}_f`, sql.Int, x.field_id);
    });
    
    request.multiple = true;
    request.input('id', sql.Int, id);

    console.log(update, id);

    return request.query(update);
};


const _ = {
    newProject,
    getProjects,
    getProjectById,
    updateProject
}

export default _;
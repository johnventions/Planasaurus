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
             new ProjectFilter(i, key, key, value.toString())
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


const getProjects = function (pool: sql.ConnectionPool, spec: ProjectSpecification) {
    const filters = spec.fields ? getFilters(spec.fields) : [];
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

    return request.query(update);
};


const _ = {
    newProject,
    getProjects,
    getProjectById,
    updateProject
}

export default _;
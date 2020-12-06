import * as sql from 'mssql';
import FieldDef from "../models/fielddef";
import ProjectType from "../models/projecttype";


const getProjectTypes = function (pool: sql.ConnectionPool) {
    const select = `
    /* SELECT THE LIST OF PROJECT TYPES */
        SELECT
            t.id,
            t.name,
            t.codename,
            t.parent_id,
            t.menu_order,
            p.qty
        FROM project_types t
        LEFT JOIN (
            SELECT
                project_type, 
                COUNT(id) as qty
            FROM projects 
            GROUP BY project_type
            ) p ON t.id = p.project_type
        ORDER BY parent_id, menu_order
`;
    const request = pool.request();
    return request.query(select);
}

const createType = function (pool: sql.ConnectionPool, type: ProjectType) {
    const insert = `
        INSERT INTO project_types 
            (name, codename, parent_id, menu_order)
        VALUES
            (@n, @c, @p, @m);
        SELECT SCOPE_IDENTITY() as id;
    `;

    const request = pool.request();
    request.input('n', sql.VarChar, type.name);
    request.input('c', sql.VarChar, type.codename);
    request.input('p', sql.Int, type.parent_id);
    request.input('m', sql.Int, type.menu_order);
    request.multiple = true;
    return request.query(insert);
}

const updateType = function (pool: sql.ConnectionPool, type: ProjectType) {
    const update = `
        UPDATE project_types
        SET name = @n, codename = @c, parent_id = @p, menu_order = @m
        WHERE id = @id
    `;

    const request = pool.request();
    request.input('id', sql.Int, type.id);
    request.input('n', sql.VarChar, type.name);
    request.input('c', sql.VarChar, type.codename);
    request.input('p', sql.Int, type.parent_id);
    request.input('m', sql.Int, type.menu_order);
    request.multiple = true;
    return request.query(update);
}

const getFieldsByType = function(pool: sql.ConnectionPool, id: Number) {
    const select = `
    /* SELECT THE LIST OF FIELDS FOR A TYPE TYPES */
        SELECT
            fd.id,
            fd.name,
            fd.data_type,
            fd.relationship_type,
            fd.metadata
        FROM field_defs fd
        WHERE fd.project_type = @id
`;

    const request = pool.request();
    request.input('id', sql.Int, id);
    request.multiple = true;
    return request.query(select);
}


const createFieldForType = function (pool: sql.ConnectionPool, typeID: Number, field: FieldDef) {
    const insert = `
    /* CREATE A NEW RECORD IN field_defs */
        INSERT INTO field_defs
            (project_type, name, data_type)
        VALUES
            (@pt, @name, @dt);
        SELECT SCOPE_IDENTITY() as id;
`;

    const request = pool.request();
    request.input('pt', sql.Int, typeID);
    request.input('name', sql.VarChar, field.name);
    request.input('dt', sql.Int, field.data_type);
    request.multiple = true;
    return request.query(insert);
}

const updateFieldDefinition = function (pool: sql.ConnectionPool, fieldID: Number, field: FieldDef) {
    const update = `
    /* UPDATE EXISTING NEW RECORD IN field_defs */
        UPDATE field_defs
        SET name = @fieldName,
            metadata = @meta
        WHERE id = @id;
`;

    const request = pool.request();
    request.input('fieldName', sql.VarChar, field.name);
    request.input('meta', sql.VarChar, JSON.stringify(field.metadata));
    request.input('id', sql.Int, fieldID);
    request.multiple = true;
    return request.query(update);

}

const getLayoutForProjectType = function (pool: sql.ConnectionPool, typeID: Number) {
    const select = `
    /* Pull out the LAYOUT field */
        SELECT layout
        FROM project_types
        WHERE id = @pt 
`;

    const request = pool.request();
    request.input('pt', sql.Int, typeID);
    request.multiple = true;
    return request.query(select);
}

const updateLayoutForProjectType = function (pool: sql.ConnectionPool, typeID: Number, layout: String) {
    const update = `
        UPDATE project_types
        SET layout = @layout
        WHERE id = @pt;
`;

    const request = pool.request();
    request.input('pt', sql.Int, typeID);
    request.input('layout', sql.VarChar, layout);
    request.multiple = true;
    return request.query(update);
}

const _ = {
    getProjectTypes,
    createType,
    updateType,
    getFieldsByType,
    createFieldForType,
    getLayoutForProjectType,
    updateLayoutForProjectType,
    updateFieldDefinition
}

export default _;
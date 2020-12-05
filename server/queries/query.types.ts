import * as sql from 'mssql';
import FieldDef from "../models/fielddef";


const getProjectTypes = function (pool: sql.ConnectionPool) {
    const select = `
    /* SELECT THE LIST OF PROJECT TYPES */
        SELECT
            t.id,
            t.name, t.codename,
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
`;
    const request = pool.request();
    return request.query(select);
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
    getFieldsByType,
    createFieldForType,
    getLayoutForProjectType,
    updateLayoutForProjectType,
    updateFieldDefinition
}

export default _;
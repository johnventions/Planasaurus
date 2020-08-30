import * as sql from 'mssql';
import FieldDef from "../models/fielddef";


const getProjectTypes = function (pool: sql.ConnectionPool) {
    const select = `
    /* SELECT THE LIST OF PROJECT TYPES */
        SELECT
            t.id, t.name, t.codename, t.parent_id, t.menu_order
        FROM project_types t
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
            fd.relationship_type
        FROM field_defs fd
        WHERE fd.project_type = @id
`;

    const request = pool.request();
    request.input('id', sql.Int, id);
    request.multiple = true;
    return request.query(select);
}


const createFieldForType = function (pool: sql.ConnectionPool, projectID: Number, field: FieldDef) {
    const insert = `
    /* CREATE A NEW RECORD IN field_defs */
        INSERT INTO field_defs
            (project_type, name, data_type)
        VALUES
            (@pt, @name, @dt);
        SELECT SCOPE_IDENTITY() as id;
`;

    const request = pool.request();
    request.input('pt', sql.Int, projectID);
    request.input('name', sql.VarChar, field.name);
    request.input('dt', sql.Int, field.data_type);
    request.multiple = true;
    return request.query(insert);
}



const _ = {
    getProjectTypes,
    getFieldsByType,
    createFieldForType
}

export default _;
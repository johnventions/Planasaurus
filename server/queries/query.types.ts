import * as sql from 'mssql';

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

const _ = {
    getProjectTypes,
    getFieldsByType
}

export default _;
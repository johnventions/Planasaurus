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

const _ = {
    getProjectTypes
}

export default _;
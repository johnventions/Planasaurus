const getProjectTypes = function (sql: any) {
    const select = `
    /* SELECT THE LIST OF PROJECT TYPES */
        SELECT
            t.id, t.name, t.codename, t.parent_id, t.menu_order
        FROM project_types t
`;
    const request = new sql.Request();
    return request.query(select);
}

module.exports = {
    getProjectTypes,
}
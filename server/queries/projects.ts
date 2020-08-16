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

const getProjects = function(sql: any, type: Number) {
    const select = `
    /* SELECT THE LIST OF PROJECTS */
    WITH project_list as (
        SELECT id FROM projects WHERE project_type = @ptype
    )
    ${ baseLookup()}
`;

    const request = new sql.Request();
    request.input('ptype', sql.Int, type);
    request.multipe = true;
    return request.query(select);
}

const getProjectById = function (sql: any, id: Number) {
    const select = `
    /* SELECT THE LIST OF PROJECTS */
    WITH project_list as (
        SELECT id FROM projects WHERE id = @id
    )
    ${ baseLookup() }
`;

    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.multipe = true;
    return request.query(select);
}


module.exports = {
    getProjects,
    getProjectById
}
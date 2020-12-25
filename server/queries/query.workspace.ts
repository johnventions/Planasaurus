import * as sql from 'mssql';

const createWorkspace = function (pool: sql.ConnectionPool, owner: Number, name: String) {
    const insert = `
        INSERT INTO workspaces
            (name, owner_id)
        VALUES
            (@name, @id);
        SELECT SCOPE_IDENTITY() as id;
    `;
    const request = pool.request();
    request.input('name', sql.VarChar, name);
    request.input('id', sql.VarChar, owner);
    request.multiple = true;
    return request.query(insert);
}


const getWorkspacesByOwner = function (pool: sql.ConnectionPool, owner: Number) {
    const select = `
        SELECT *
        FROM workspaces
        WHERE
            owner_id = @id
    `;
    const request = pool.request();
    request.input('id', sql.VarChar, owner);
    request.multiple = true;
    return request.query(select);
}



const _ = {
    createWorkspace,
    getWorkspacesByOwner
}

export default _;
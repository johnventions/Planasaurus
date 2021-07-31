import * as sql from 'mssql';

const createWorkspace = function (pool: sql.ConnectionPool, owner: number, name: String) {
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

const getWorkspacesById = function (pool: sql.ConnectionPool, id: number) {
    const select = `
        SELECT TOP 1 
        *
        FROM workspaces
        WHERE
            id = @id
    `;
    const request = pool.request();
    request.input('id', sql.VarChar, id);
    request.multiple = true;
    return request.query(select);
}


const getWorkspacesByOwner = function (pool: sql.ConnectionPool, owner: number) {
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

const getWorkspaceSharedTos = function(pool: sql.ConnectionPool, id: number) {
    const select = `
    SELECT
        u.email,
        u.id,
        1 as 'accepted'
    FROM workspace_users wu
        INNER JOIN users u ON wu.user_id = u.id
    WHERE wu.workspace_id = @id
    UNION
    SELECT
        wi.email,
        null as 'id',
        0 as 'accepted'
    FROM workspace_invites wi
    WHERE wi.accepted = 0
        AND wi.workspace_id = @id
`;

    const request = pool.request();
    request.input('id', sql.Int, id);
    request.multiple = true;
    return request.query(select);
}

const addUserToWorkspace = function(pool: sql.ConnectionPool, id: number, user: number, addedBy: number) {
    const insert = `
        INSERT INTO workspace_users
        (workspace_id, user_id, added_by)
        VALUES
        (@ws, @user, @by)
    `;
    const request = pool.request();
    request.input('ws', sql.Int, id);
    request.input('user', sql.Int, user);
    request.input('by', sql.Int, addedBy);
    request.multiple = true;
    return request.query(insert);
}

const createWorkspaceInvitation = function(pool: sql.ConnectionPool, id: number, email: string, addedBy: number) {
    const insert = `
        INSERT INTO workspace_invites
        (workspace_id, email, added_by)
        VALUES
        (@ws, @email, @by)
    `;
    const request = pool.request();
    request.input('ws', sql.Int, id);
    request.input('email', sql.VarChar, email);
    request.input('by', sql.Int, addedBy);
    request.multiple = true;
    return request.query(insert);
}


const _ = {
    createWorkspace,
    getWorkspacesById,
    getWorkspacesByOwner,
    getWorkspaceSharedTos,
    addUserToWorkspace,
    createWorkspaceInvitation
}

export default _;
import * as sql from 'mssql';

const userSelectBase = `
    SELECT
        TOP 1
        id,
        email,
        firstname,
        lastname,
        default_workspace,
        (	
            SELECT id, name, owner_id 
            FROM (
                SELECT workspace_id
                    FROM workspace_users wu
                    WHERE user_id = u.id
                UNION
                SELECT id as workspace_id
                    FROM workspaces ws
                    WHERE owner_id = u.id
            ) as o
            LEFT JOIN workspaces w ON o.workspace_id = w.id
            FOR JSON PATH
        ) as myWorkspaces
    FROM users u
`;


const getUser = function (pool: sql.ConnectionPool, col: String, user: any) {
    const select = `
    ${ userSelectBase }
    WHERE
        googleid = @externalid
    `

    const request: sql.Request = pool.request();
    request.input('col', sql.VarChar, col);
    request.input('externalid', sql.VarChar, user.externalid);
    request.multiple = true;
    return request.query(select);
}

const getUserById = function (pool: sql.ConnectionPool, id: number) {
    const select = `
    ${ userSelectBase }
    WHERE
        id = @id
    `
    const request: sql.Request = pool.request();
    request.input('id', sql.Int, id);
    request.multiple = true;
    return request.query(select);
}

const getUserByEmail = function (pool: sql.ConnectionPool, email: string) {
    const select = `
    ${ userSelectBase }
    WHERE
        email = @email
    `
    const request: sql.Request = pool.request();
    request.input('email', sql.VarChar, email);
    request.multiple = true;
    return request.query(select);
}



const createUser = function(pool: sql.ConnectionPool, col: String, user: any) {
    const { email, firstname, lastname, externalid } = user;
    const insert = `
    INSERT into users
        (
        email,
        firstname,
        lastname,
        googleid
        )
    VALUES
        (@email, @first, @last, @id);
    SELECT SCOPE_IDENTITY() as id;
    `
    const request: sql.Request = pool.request();
    request.input('col', sql.VarChar, col);
    request.input('email', sql.VarChar, email);
    request.input('first', sql.VarChar, firstname);
    request.input('last', sql.VarChar, lastname);
    request.input('id', sql.VarChar, externalid);
    request.multiple = true;
    return request.query(insert);
}

const acceptInvitations = function(pool: sql.ConnectionPool, id: number, email: string) {
    const insert = `
    INSERT into workspace_users
        (
        user_id,
        workspace_id,
        added_by
        )
    SELECT
        @id as 'user_id',
        workspace_id,
        added_by
    FROM workspace_invites i
    WHERE i.email = @email
            AND accepted = 0;

    UPDATE workspace_invites 
    SET accepted = 1
    WHERE email = @email;
    `;
    const request: sql.Request = pool.request();
    request.input('id', sql.VarChar, id);
    request.input('email', sql.VarChar, email);
    request.multiple = true;
    return request.query(insert);
}

const getUserPermissions = function(pool: sql.ConnectionPool, id: number) {
    const select = `
    SELECT
        id as 'workspace_id',
        'admin' as 'granted'
    FROM workspaces
    WHERE
        owner_id = @id
    UNION
    SELECT
        workspace_id,
        'shared' as 'granted'
    FROM workspace_users
    WHERE user_id = @id
`
    const request: sql.Request = pool.request();
    request.input('id', sql.Int, id);
    request.multiple = true;
    return request.query(select);
}

const _ = {
    getUser,
    getUserById,
    getUserByEmail,
    createUser,
    acceptInvitations,
    getUserPermissions
};

export default _;
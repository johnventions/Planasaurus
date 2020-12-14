import * as sql from 'mssql';


const getUser = function (pool: sql.ConnectionPool, col: String, user: any) {
    const select = `
    SELECT
        TOP 1
        id,
        email,
        firstname,
        lastname
    FROM users
    WHERE
        googleid = @externalid
    `

    const request: sql.Request = pool.request();
    request.input('col', sql.VarChar, col);
    request.input('externalid', sql.VarChar, user.externalid);
    request.multiple = true;
    console.log(request);
    return request.query(select);
}


const getUserById = function (pool: sql.ConnectionPool, id: Number) {
    const select = `
    SELECT
        TOP 1
        id,
        email,
        firstname,
        lastname
    FROM users
    WHERE
        id = @id
    `

    const request: sql.Request = pool.request();
    request.input('col', sql.Int, id);
    request.multiple = true;
    console.log(request);
    return request.query(select);
}



const createUser = function(pool: sql.ConnectionPool, col: String, user: any) {
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
    request.input('email', sql.VarChar, user.email);
    request.input('first', sql.VarChar, user.firstname);
    request.input('last', sql.VarChar, user.lastname);
    request.input('id', sql.VarChar, user.externalid);
    request.multiple = true;
    return request.query(insert);
}


const _ = {
    getUser,
    getUserById,
    createUser
};

export default _;
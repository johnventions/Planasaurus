import * as sql from 'mssql';

const config : sql.config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_HOST || 'localhost',
    database: process.env.SQL_DB || 'localhost', 
    options: {
        enableArithAbort: true
    } 
}

const getSQLPool : Promise<sql.ConnectionPool> = new sql.ConnectionPool(config)
        .connect()
        .then(
            (pool: sql.ConnectionPool) => {
                console.log("Database Connected")
                return pool;
            }
        );

module.exports = {
    sql, getSQLPool
}

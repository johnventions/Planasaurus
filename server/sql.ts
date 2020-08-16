const sql = require('mssql');

const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_HOST,
    database: process.env.SQL_DB,
    options: {
        enableArithAbort: true
    } 
}

module.exports = function () {
    sql.connect(config).then(() => {
        console.log('Connected to SQL');
    });
    return sql;
}

const typeQueries = require('./queries/query.types');

module.exports = function (sql: any) {
    let routes = require('express').Router();

    routes.get('/', async (_req: any, res: any) => {
        const result = await typeQueries.getProjectTypes(sql);
        res.status(200).json({
                success: true,
                types: result.recordset
            });
    });

    routes.get('/:id', async (req: any, res: any) => {
    });

    return routes;
}
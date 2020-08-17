const projectQueries = require('./queries/projects');

const outputFilter = (result: any) => {
    let data = result.recordset;
    data.forEach((el: any) => {
        el.fields = JSON.parse(el.fields);
    });

    return data;
}

module.exports = function (sql: any) {
    let routes = require('express').Router();

    routes.get('/', async (req: any, res: any) => {
        let filters = req.query;
        const result = await projectQueries.getProjects(sql, 1, filters);
        res.status(200).json({ message: 'Connected Projects!', data: result.recordset });
    });

    routes.get('/:id', async (req: any, res: any) => {
        const id = req.params.id;
        const result = await projectQueries.getProjectById(sql, id);
        res.status(200).json({ message: 'Connected Projects!', data: outputFilter(result) });
    });

    return routes;
}
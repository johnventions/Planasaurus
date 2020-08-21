const projectQueries = require('./queries/query.projects');

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
        let projectType = parseInt(req.query.type);
        console.log(projectType);
        let filters = req.query;
        const result = await projectQueries.getProjects(sql, projectType, filters);
        res.status(200).json({
            sucess: true,
            list: outputFilter(result)
        });
    });

    routes.get('/:id', async (req: any, res: any) => {
        const id = req.params.id;
        const result = await projectQueries.getProjectById(sql, id);
        res.status(200).json({
            sucess: true,
            project: outputFilter(result)
        });
    });

    return routes;
}
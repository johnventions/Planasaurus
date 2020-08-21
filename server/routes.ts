const routes = require('express').Router();

module.exports = function (sql: any) {
    routes.get('/', async (req: any, res: any) => {
        res.status(200).json({ message: 'Connected!' });
    });

    const projects = require('./routes.projects')(sql);
    routes.use('/projects', projects);

    const types = require('./routes.types')(sql);
    routes.use('/types', types);

    return routes;
}

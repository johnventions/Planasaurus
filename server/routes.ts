const routes = require('express').Router();

module.exports = function (sql: any) {
    routes.get('/', async (req: any, res: any) => {
        res.status(200).json({ message: 'Connected!' });
    });

    const projects = require('./project.routes')(sql);
    routes.use('/projects', projects);

    return routes;
}

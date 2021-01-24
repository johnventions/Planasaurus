import { nextTick } from "process";

const routes = require('express').Router();

module.exports = function () {
    routes.get('/', async (req: any, res: any) => {
        res.status(200).json({ message: 'Connected!' });
    });

    const projects = require('./routes.projects')();
    routes.use('/projects', projects);

    const types = require('./routes.types')();
    routes.use('/types', types);

    const upload = require('./routes.upload')();
    routes.use('/upload', upload);

    return routes;
}

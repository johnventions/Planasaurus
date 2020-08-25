import { Router, Request, Response } from 'express';
const { getSQLPool } = require('../server/sql');

import ProjectSpecification from './specifications/specification.project';
import projectQueries from './queries/query.projects';

const outputFilter = (result: any) => {
    let data = result.recordset;
    data.forEach((el: any) => {
        el.fields = JSON.parse(el.fields);
    });

    return data;
}

module.exports = function () {
    let routes : Router = require('express').Router();

    routes.get('/', async (req: Request, res: Response) => {
        const pool = await getSQLPool;
        let spec : ProjectSpecification = ProjectSpecification.fromParams(req.query);
        const result = await projectQueries.getProjects(pool, spec);
        res.status(200).json({
            sucess: true,
            list: outputFilter(result)
        });
    });

    routes.get('/:id', async (req: Request, res: Response) => {
        const pool = await getSQLPool;
        const id = parseInt(req.params.id);
        const result = await projectQueries.getProjectById(pool, id);
        res.status(200).json({
            sucess: true,
            project: outputFilter(result)
        });
    });

    return routes;
}
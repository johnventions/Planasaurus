import { Router, Request, Response } from 'express';
import ProjectService from "./services/project.service"


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
        let spec: ProjectSpecification = ProjectSpecification.fromParams(req.query);
        const service = new ProjectService();
        const result = await service.getProjects(spec);
        res.status(200).json({
            sucess: true,
            list: result,
        });
    });

    routes.get('/:id', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const service = new ProjectService();
        const result = await service.getProjectById(id);
        res.status(200).json({
            sucess: true,
            project: result
        });
    });

    return routes;
}
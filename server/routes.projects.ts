import { Router, Request, Response } from 'express';
import ProjectService from "./services/project.service"
import ProjectSpecification from './specifications/specification.project';

import Project from "./models/project";
import FieldUpdate from "./models/fieldUpdate";

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

    /**
     * Look up a project record by its ID
     * Return the Project object
     *
     * @param {number} id The id of the project
     */
    routes.get('/:id', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const service = new ProjectService();
        const result = await service.getProjectById(id);
        res.status(200).json({
            sucess: true,
            project: result
        });
    });

    routes.post('/:id', async (req: Request, res: Response) => {
        let id : Number = parseInt(req.params.id);
        const service = new ProjectService();

        let p = Project.fromData(req.body);
        if (req.params.id == "0") {
            let newProj = await service.createProject(p);
            id = newProj.id;
        }
        // extract fields
        const result = await service.updateProjectFields(id, p.fields);
        res.status(200).json({
            sucess: true
        });
    });

    return routes;
}
import { Router, Request, Response } from 'express';
import ProjectService from "./services/project.service"
import ProjectSpecification from './specifications/specification.project';

import Project from "./models/project";
import FieldUpdate from "./models/fieldUpdate";
import TypeService from './services/types.service';
import FieldDef from './models/fielddef';

module.exports = function () {
    let routes : Router = require('express').Router();

    routes.get('/', async (req: Request, res: Response) => {
        const typeID : Number = Number(req.query.type);

        // Look up field definitions, so we can search the correct table
        const typeService = new TypeService();
        const typeDefs: Map<string, FieldDef> = await typeService.getTypeFieldsMapById(typeID);

        let spec: ProjectSpecification = ProjectSpecification.fromParams(req.query, typeDefs);

        // Query the DB for the related projects
        const service = new ProjectService();
        const total = await service.getProjectCount(spec.type);
        const result = await service.getProjects(spec);
        res.status(200).json({
            success: true,
            total: total,
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
        const children =  await service.getProjectChildren(id);

        res.status(200).json({
            success: true,
            project: result,
            children: children
        });
    });

    routes.post('/:id', async (req: Request, res: Response) => {
        let id : Number = parseInt(req.params.id);
        const service = new ProjectService();

        let p = Project.fromData(req.body);
        if (id == 0) {
            console.log('creating new');
            let newProj = await service.createProject(p);
            id = newProj.id;
        }
        // extract fields
        const result = await service.updateProjectFields(id, p.fields);
        res.status(200).json({
            success: true,
            id: id
        });
    });

    return routes;
}
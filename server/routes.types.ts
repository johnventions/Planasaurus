import { Router, Request, Response } from 'express';
import checkPermissions from "./checkPermissions";

import TypeService from "./services/types.service";
import FieldDef from './models/fielddef';
import ProjectType from './models/projecttype';

module.exports = function () {
    let routes : Router = require('express').Router();

    routes.get('/', checkPermissions('read', ['type']), async (req: Request, res: Response) => {
        const workspace = Number(req.headers['pterobyte-workspace']);
        const service = new TypeService();
        const result = await service.getTypes(workspace);
        return res.status(200).json({
                success: true,
                types: result
            });
    });

    /**
     * Create a new project type
     * @param {object} body - The contents of the project
     * @param {int} workspace - The workspace ID.
     */
    routes.post('/', checkPermissions('write', ['type']), async (req: any, res: any) => {
        const workspace = Number(req.headers['pterobyte-workspace']);
        const proj: ProjectType = req.body as ProjectType;
        const service = new TypeService();
        const result = await service.createOrUpdateType(workspace, proj);
        res.status(200).json({
            success: true,
        });
    });


    /**
    * Create or update a Project Type
    * @param {object} body - The contents of the project
    * @param {int} id - The project type ID.
    * @param {int} workspace - The workspace ID.
    */
    routes.put('/:id', checkPermissions('write', ['type']), async (req: any, res: any) => {
        const workspace = Number(req.headers['pterobyte-workspace']);
        const proj: ProjectType = req.body as ProjectType;
        const service = new TypeService();
        const result = await service.createOrUpdateType(workspace, proj);
        res.status(200).json({
            success: true,
        });
    });

    /**
    * Get the fields associated with a project type
    * @param {int} id - The project type ID.
    */
    routes.get('/:id/fields', checkPermissions('read', ['fields']), async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const service = new TypeService();
        const result = await service.getTypeFieldsById(id);
        const related = await service.getTypeOptionsById(id);
        res.status(200).json({
            success: true,
            fields: result,
            related
        });
    });

    /**
    * Create a new field for a project type
    * @param {int} id - The project type ID.
    */
    routes.post('/:id/fields', checkPermissions('write', ['fields']), async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const newField: FieldDef = FieldDef.fromData(req.body);
        const service = new TypeService();
        const result = await service.createTypeField(id, newField);
        res.status(200).json({
            success: true,
            field: result
        });
    });

    routes.put('/fields/:fid', checkPermissions('write', ['fields']), async (req: Request, res: Response) => {
        const fid = parseInt(req.params.fid);
        const fieldDef = FieldDef.fromData(req.body);

        const service = new TypeService();
        const result = await service.updateTypeField(fid, fieldDef);
        res.status(200).json({
            success: true,
            field: result
        });
    });

    routes.get('/:id/layout', checkPermissions('read', ['layout']), async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const service = new TypeService();
        const result = await service.getTypeLayoutById(id);
        // const related = await service.getTypeOptionsById(id);
        res.status(200).json({
            success: true,
            layout: result,
            // related: related
        });
    });

    routes.post('/:id/layout', checkPermissions('write', ['layout']), async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const layoutUpdate: any = req.body.layout;

        const service = new TypeService();
        const result = await service.updateTypeLayoutById(id, layoutUpdate);
        res.status(200).json({
            success: true,
            layout: layoutUpdate
        });
    });

    routes.post('/:id/fieldlayout', checkPermissions('write', ['layout']), async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const layoutUpdate: any = req.body.layout;

        const service = new TypeService();
        const result = await service.updateTypeFieldLayoutById(id, layoutUpdate);
        res.status(200).json({
            success: true,
            layout: layoutUpdate
        });
    });

    return routes;
}
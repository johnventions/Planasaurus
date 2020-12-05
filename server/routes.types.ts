import * as sql from 'mssql';
import { Router, Request, Response } from 'express';

import TypeService from "./services/types.service";

const { getSQLPool } = require('../server/sql');
import typeQueries from './queries/query.types';
import FieldDef from './models/fielddef';
import Layout from './models/layout';

module.exports = function () {
    let routes : Router = require('express').Router();

    routes.get('/', async (req: Request, res: Response) => {
        const service = new TypeService();
        const result = await service.getTypes();
        return res.status(200).json({
                success: true,
                types: result
            });
    });

    routes.get('/:id', async (req: any, res: any) => {
    });

    routes.post('/:id', async (req: any, res: any) => {
        res.status(200).json({
            sucess: true,
            msg: 'Yes!'
        });
    });

    routes.get('/:id/fields', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const service = new TypeService();
        const result = await service.getTypeFieldsById(id);
        res.status(200).json({
            sucess: true,
            fields: result
        });
    });

    routes.post('/:id/fields', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const newField: FieldDef = {
            name: req.body.name,
            data_type: req.body.type,
        } as FieldDef;

        const service = new TypeService();
        const result = await service.createTypeField(id, newField);
        res.status(200).json({
            sucess: true,
            field: result
        });
    });

    routes.put('/fields/:fid', async (req: Request, res: Response) => {
        const fid = parseInt(req.params.fid);
        const fieldDef: FieldDef = {
            name: req.body.name,
            metadata: req.body.metadata,
        } as FieldDef;

        const service = new TypeService();
        const result = await service.updateTypeField(fid, fieldDef);
        res.status(200).json({
            sucess: true,
            field: result
        });
    });

    routes.get('/:id/layout', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const service = new TypeService();
        const result = await service.getTypeLayoutById(id);
        res.status(200).json({
            sucess: true,
            layout: result
        });
    });

    routes.post('/:id/layout', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const layoutUpdate: any = req.body.layout;

        const service = new TypeService();
        const result = await service.updateTypeLayoutById(id, layoutUpdate);
        res.status(200).json({
            sucess: true,
            layout: layoutUpdate
        });
    });

    return routes;
}
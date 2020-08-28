import * as sql from 'mssql';
import { Router, Request, Response } from 'express';

const { getSQLPool } = require('../server/sql');
import typeQueries from './queries/query.types';

module.exports = function () {
    let routes : Router = require('express').Router();

    routes.get('/', async (req: Request, res: Response) => {
        const pool = await getSQLPool;
        const result = await typeQueries.getProjectTypes(pool);
        return res.status(200).json({
                success: true,
                types: result.recordset
            });
    });

    routes.get('/:id', async (req: any, res: any) => {
    });

    routes.get('/:id/fields', async (req: Request, res: Response) => {
        const pool = await getSQLPool;
        const id = parseInt(req.params.id);
        const result = await typeQueries.getFieldsByType(pool, id);
        res.status(200).json({
            sucess: true,
            fields: result.recordset
        });
    });

    return routes;
}
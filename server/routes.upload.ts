import * as sql from 'mssql';
const aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

import { Router, Request, Response } from 'express';
import UploadService from './services/upload.service';
import WorkspaceService from './services/workspace.service';
import Workspace from './models/workspace';
import Upload from './models/upload';

const { getSQLPool } = require('../server/sql');

var S3 = require('aws-sdk/clients/s3');
const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');

const s3 = new S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.STORAGE_KEY,
    secretAccessKey: process.env.STORAGE_SECRET
});

const upload = async function(req: any, res: any, next:any) {
    const workspace = Number(req.headers['pterobyte-workspace']);
    const { user } = req;

    // Get Worspace info for user
    const service = new WorkspaceService();
    const wsDetails : Workspace = await service.getWorkspaceById(workspace);

    console.log(wsDetails);

    // upload image to s3
    return await multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.STORAGE_BUCKET,
            acl: 'public-read',
            contentType:  function (req: any, file: any, cb: any) {
                cb(null, file.mimetype);
            },
            metadata: function (req: any, file: any, cb: any) {
                cb(null, {});
            },
            key: function (req: any, file: any, cb: any) {
                const filename = `${ wsDetails.uuid }/${Date.now().toString()}_${file.originalname}`; 
                cb(null, filename);
            }
        })
    }).single('attachment')(req, res, next);
};

module.exports = function () {
    let routes : Router = require('express').Router();

    routes.get('/', async (req: any, res: Response) => {
       
        return res.status(200).json({
            success: true,
        });
    });

    routes.post('/', upload, async (req: any, res: Response) => {
        const workspace = Number(req.headers['pterobyte-workspace']);
        const { user, file } = req;

        const size = Math.floor(file.size / 1000);
        const filename = file.key.split('/')[1];

        const uploadedFile : Upload = new Upload({
            workspace,
            user_id: user ? user.id : 0,
            original_filename: file.originalname || '',
            size,
            filename,
            bucket: 1,
        });

        const service = new UploadService();
        const u = await service.createUpload(uploadedFile);
    
        return res.status(200).json({
                success: true,
                msg: `Successfully uploaded..!`
            });
    });

    routes.get('/:guid/:filename', async (req: Request, res: Response) => {
        const service = new UploadService();
        const guid = req.params.guid;

        const uploadFile = await service.getUploadByGuid(guid);

        return res.status(200).json({
            success: true,
            file: uploadFile
        });
    });

    return routes;
}
import * as sql from 'mssql';
const aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3-transform');
const sharp = require('sharp');

const S3Proxy = require('s3proxy');

import { Router, Request, Response } from 'express';
import UploadService from './services/upload.service';
import WorkspaceService from './services/workspace.service';
import Workspace from './models/workspace';
import Upload from './models/upload';
import { v4 } from 'uuid';
import MediaFile from './models/mediafile';

const { getSQLPool } = require('../server/sql');

var S3 = require('aws-sdk/clients/s3');
const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');

const s3config = {
    endpoint: spacesEndpoint,
    accessKeyId: process.env.STORAGE_KEY,
    secretAccessKey: process.env.STORAGE_SECRET
};

const bucketname = process.env.STORAGE_BUCKET;

const s3 = new S3(s3config);

const proxy = new S3Proxy({ bucket: bucketname, ...s3config });
proxy.init();

const upload = async function(req: any, res: any, next:any) {
    const workspace = Number(req.headers['pterobyte-workspace']);
    const { user } = req;

    // Get Worspace info for user
    const service = new WorkspaceService();
    const wsDetails : Workspace = await service.getWorkspaceById(workspace);

    // upload image to s3
    return await multer({
        storage: multerS3({
            s3: s3,
            bucket: bucketname,
            acl: 'private',
            contentType:  function (req: any, file: any, cb: any) {
                cb(null, file.mimetype);
            },
            metadata: function (req: any, file: any, cb: any) {
                cb(null, {
                    uuid: v4()
                });
            },
            key: function (req: any, file: any, cb: any) {
                const filename = `${ wsDetails.uuid }/${Date.now().toString()}_${file.originalname}`; 
                cb(null, filename);
            },
            shouldTransform: function (req: any, file: any, cb: any) {
                cb(null, /^image/i.test(file.mimetype))
            },
            transforms: [{
                id: 'original',
                contentType: multerS3.AUTO_CONTENT_TYPE,
                key: function (req: any, file: any, cb: any) {
                    const filename = `${ wsDetails.uuid }/${Date.now().toString()}_${file.originalname}`; 
                    cb(null, filename)
                },
                transform: function (req: any, file: any, cb: any) {
                    cb(null, sharp());
                }
              }, {
                id: 'thumbnail',
                contentType: 'image/jpg',
                key: function (req: any, file: any, cb: any) {
                    const filename = `${ wsDetails.uuid }/${Date.now().toString()}t_${file.originalname}.jpeg`; 
                    cb(null, filename);
                },
                transform: function (req: any, file: any, cb: any) {
                    cb(null, sharp().resize(200, 200).jpeg())
                }
              }]
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
        console.log(file);

        let filename = file.originalname;
        let thumbfile = null;
        let size = 0;
        let uuid;

        if (file.transforms && file.transforms.length) {
            const original = file.transforms.find((x: any) => x.id == 'original');
            if (original) {
                filename = original.key.split('/')[1];
                size = Math.floor(original.size / 1000);
                console.log(original.metadata);
                if (original.metadata) {
                    uuid = original.metadata.uuid;
                }
            }
            const thumbnail = file.transforms.find((x: any) => x.id == 'thumbnail');
            if (thumbnail) {
                thumbfile = thumbnail.key.split('/')[1];
            }
        } else {
            filename = file.key.split('/')[1];
            size = Math.floor(file.size / 1000);
        }

        const uploadedFile : Upload = new Upload({
            workspace,
            user_id: user ? user.id : 0,
            original_filename: file.originalname || '',
            size,
            filename,
            bucket: 1,
            uuid,
            preview_filename: thumbfile
        });


        const service = new UploadService();
        const fileID = await service.createUpload(uploadedFile);
        const newFile : MediaFile = await service.getUploadByGuid(uploadedFile.uuid);
    
        return res.status(200).json({
                success: true,
                msg: `Successfully uploaded..!`,
                file: newFile.toPublic()
            });
    });

    routes.route('/:guid/:filename').get(async (req: Request, res: Response) => {
        const preview = req.query.preview || 0;
        const service = new UploadService();
        const guid = req.params.guid;

        const uploadFile : MediaFile = await service.getUploadByGuid(guid);
        
        const dest = {
            path: (preview && uploadFile.preview_filepath) ? uploadFile.preview_filepath : uploadFile.filepath,
            query: req.query
        };

        proxy.get(dest,res)
            .on('error', () => res.end())
            .pipe(res);

    });
    // .head((req: any, res: any) => {
    //     console.log(req, res)
    //     res.status(200).send();
    // });

    return routes;
}
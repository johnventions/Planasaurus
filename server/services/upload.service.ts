const { getSQLPool } = require('../sql');

import Upload from '../models/upload';

import uploadQueries from '../queries/query.upload';
import MediaFile from '../models/mediafile';

export default class WorkspaceService {
    constructor() {

    }

    static async createUpload(upload: Upload) : Promise<number> {
        const pool = await getSQLPool;
        const uploadId = await uploadQueries.createUpload(pool, upload);
        return parseInt(uploadId.recordset[0].id);
    }

    static async getUploadByGuid(guid: string) : Promise<MediaFile> {
        const pool = await getSQLPool;
        const upload = await uploadQueries.getUploadByGuid(pool, guid);
        const mf = new MediaFile(upload.recordset[0]);
        return mf;
    }

}
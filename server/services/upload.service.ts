const { getSQLPool } = require('../sql');

import Upload from '../models/upload';

import uploadQueries from '../queries/query.upload';

export default class WorkspaceService {
    constructor() {

    }

    async createUpload(upload: Upload) : Promise<Number> {
        const pool = await getSQLPool;
        const uploadId = await uploadQueries.createUpload(pool, upload);
        return parseInt(uploadId.recordset[0].id);
    }

    async getUploadByGuid(guid: string) {
        const pool = await getSQLPool;
        const upload = await uploadQueries.getUploadByGuid(pool, guid);
        return upload.recordset[0];
    }

}
import * as sql from 'mssql';
import Upload from '../models/upload';

const createUpload = function (pool: sql.ConnectionPool, upload: Upload) {
    const insert = `
        INSERT INTO uploads
            (
                workspace,
                user_id,
                original_filename,
                size,
                filename,
                bucket,
                uuid
            )
        VALUES
            (
                @workspace,
                @user_id,
                @originalname,
                @size,
                @filename,
                @bucket,
                @uuid
            );
        SELECT SCOPE_IDENTITY() as id;
    `;
    const request = pool.request();
    request.input('workspace', sql.Int, upload.workspace);
    request.input('user_id', sql.Int, upload.user_id);
    request.input('originalname', sql.VarChar, upload.original_filename);
    request.input('size', sql.Int, upload.size);
    request.input('filename', sql.VarChar, upload.filename);
    request.input('bucket', sql.Int, upload.bucket);
    request.input('uuid', sql.VarChar, upload.uuid);
    request.multiple = true;
    return request.query(insert);
}

const getUploadByGuid = function (pool: sql.ConnectionPool, guid: string) {
    const select = `
        SELECT
            u.id,
            b.name as bucket_name,
            b.region as bucket_region,
            u.uuid,
            CONCAT('/', w.uuid, '/', u.filename) as filepath,
            u.workspace,
            u.filename,
            u.original_filename,
            u.date_created
        FROM uploads u
        INNER JOIN workspaces w ON u.workspace = w.id
        INNER JOIN buckets b ON u.bucket = b.id
        WHERE u.uuid = @guid
    `;
    const request = pool.request();
    request.input('guid', sql.VarChar, guid);
    request.multiple = true;
    return request.query(select);
}


const _ = {
    createUpload,
    getUploadByGuid
}

export default _;
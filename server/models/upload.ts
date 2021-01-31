import { v4 } from "uuid";

export default class Upload {
    id: Number = 0;
    workspace: Number = 0;
    user_id: Number = 0;
    original_filename: string = '';
    size: Number = 0;
    filename: string = '';
    bucket: Number = 0;
    date_created: any = null;
    uuid: string = v4();

    constructor(u: any) {
        this.id = u.id || 0;
        this.workspace = u.workspace;
        this.user_id = u.user_id;
        this.original_filename = u.original_filename;
        this.size = u.size;
        this.filename = u.filename;
        this.bucket = u.bucket;
        this.date_created = u.date_created;
        this.uuid = u.uuid || v4();
    }
}
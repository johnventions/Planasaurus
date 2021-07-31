import { v4 } from "uuid";

export default class Upload {
    id: number = 0;
    workspace: number = 0;
    user_id: number = 0;
    original_filename: string = '';
    size: number = 0;
    filename: string = '';
    bucket: number = 0;
    date_created: any = null;
    uuid: string = v4();
    preview_filename: string | null = null;
    content_type: string = '';

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
        this.preview_filename = u.preview_filename;
        this.content_type = u.content_type;
    }
}
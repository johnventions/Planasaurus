import { v4 } from "uuid";

export default class MediaFile {
    id: Number = 0;
    workspace: Number = 0;
    uuid: string = '';
    bucket_name: string = '';
    bucket_region: string = '';
    filepath: string = '';
    filename: string = '';
    original_filename: string = '';
    date_created: string = '';
    preview_filepath: string | null = null;
    content_type: string = '';


    constructor(u: any) {
        this.id = u.id || 0;
        this.workspace = u.workspace || 0;
        this.uuid = u.uuid;
        this.bucket_name = u.bucket_name;
        this.bucket_region = u.bucket_region;
        this.filepath = u.filepath;
        this.filename = u.filename;
        this.original_filename = u.original_filename;
        this.date_created = u.date_created;
        this.content_type = u.content_type;
        if(u.preview_filepath) {
            this.preview_filepath = u.preview_filepath;
        }
    }

    toPublic() : any {
        return {
            id: this.id,
            uuid: this.uuid,
            filename: this.uuid,
            publicPath: `/upload/${this.uuid}/${this.filename}`,
            previewPath: this.preview_filepath ? `/upload/${this.uuid}/${this.filename}?preview=1` : null,
            original_filename: this.original_filename,
            content_type: this.content_type
        };
    }
}
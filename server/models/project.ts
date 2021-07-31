import FieldEntry from "./fieldentry"

export default class Project {
    id: number = 0;
    date_created: any;
    name: string = 'New Project';
    project_type: number = 0;
    status: number = 0;
    fields: Array<FieldEntry> = [];
    files: any = [];

    static fromData(data: any) : Project {
        let p =  new this();
        if (data == null) return p;
        p.id = data.id;
        p.date_created = data.date_created;
        p.name = data.name;
        p.project_type = data.project_type;
        p.status = data.status;
        try {
            if (typeof data.files == "string") {
                try {
                    p.files = JSON.parse(data.files);
                } catch {
                    p.files = [];
                }
            } else if (typeof data.files == "object" && Array.isArray(data.files)) {
                p.files = data.files;
            }
        } catch {
            p.files = [];
        }
        if (data.fields) {
            p.fields = FieldEntry.arrayFromData(data.fields);
        }

        return p;
    }
}
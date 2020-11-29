import FieldEntry from "./fieldentry"

export default class Project {
    id: Number = 0;
    date_created: Number = Date.now();
    name: string = 'New Field';
    project_type: Number = 0;
    status: Number = 0;
    fields: Array<FieldEntry> = [];

    static fromData(data: any) : Project {
        let p =  new this();
        p.id = data.id;
        p.date_created = data.date_created;
        p.name = data.name;
        p.project_type = data.project_type;
        p.status = data.status;
        if (data.fields) {
            p.fields = FieldEntry.arrayFromData(data.fields);
        }

        return p;
    }
}
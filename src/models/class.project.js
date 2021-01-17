
export default class Project {
    id = 0;
    name = '';
    project_type = 0;
    status = '';
    fields = [];
    fieldsMapped = {};
    children = [];

    constructor() {
    }

    static New(type) {
        let p = new Project();
        p.project_type = type;
        return p;
    }

    static FromData(proj) {
        let p = new Project();
        p.id = proj.id;
        p.name = proj.name;
        p.status = proj.status;
        p.fields = proj.fields;
        p.mapFields();
        if (proj.children) {
            p.children = proj.children.map(x => this.FromData(x));
        }
        return p;
    }

    mapFields() {
        this.fields.forEach(x => {
            this.fieldsMapped[x.field_id] = x;
        });
    }
}
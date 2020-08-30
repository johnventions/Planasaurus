import Project from "./project";

export default class ProjectType {
    id: Number = 0;
    codename: String = '';
    name: String = '';
    menu_order: Number = 0;
    parent_id: Number | null = null;

    static fromData(data: any) : ProjectType {
        let t = new ProjectType();
        t.id = data.id;
        t.codename = data.codename;
        t.name = data.name;
        t.menu_order = data.menu_order;
        t.parent_id = data.parent_id;

        return t;
    }
}
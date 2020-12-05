import Project from "./project";

export default class ProjectType {
    id: Number = 0;
    codename: string = '';
    name: string = '';
    menu_order: Number = 0;
    parent_id: Number | null = null;
    qty: Number = 0;

    static fromData(data: any) : ProjectType {
        let t = new ProjectType();
        t.id = data.id;
        t.codename = data.codename;
        t.name = data.name;
        t.menu_order = data.menu_order;
        t.parent_id = data.parent_id;
        t.qty = data.qty || 0;

        return t;
    }
}
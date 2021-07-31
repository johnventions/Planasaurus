import Project from "./project";

export default class ProjectType {
    id: number = 0;
    codename: string = '';
    name: string = '';
    menu_order: number = 0;
    parent_id: number | null = null;
    qty: number = 0;
    fieldLayout: any[] = [];

    static fromData(data: any) : ProjectType {
        let t = new ProjectType();
        t.id = data.id;
        t.codename = data.codename;
        t.name = data.name;
        t.menu_order = data.menu_order;
        t.parent_id = data.parent_id;
        t.qty = data.qty || 0;
        try {
            t.fieldLayout = JSON.parse(data.fieldLayout) || [];
        } catch {
            t.fieldLayout = [];
        }

        return t;
    }
}
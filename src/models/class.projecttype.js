import { v4 as uuidv4 } from 'uuid';

export default class ProjectType {
    id = 0;
    parent_id = null;
    name = '';
    codename = '';
    menu_order = 0;
    fieldLayout = [];
    qty = 0;

    constructor(t) {
        if (t != null) {
            this.id = t.id;
            this.parent_id = t.parent_id;
            this.name = t.name;
            this.codename = t.codename;
            this.menu_order = t.menu_order || 0;
            this.qty = t.qty;

            const tableFields = t.fieldLayout || [];
            this.fieldLayout = tableFields.map( x => {
                const f = { ... x };
                if (f.uuid == null) {
                    f.uuid = uuidv4();
                }
                return f;
            });
        }
    }
}
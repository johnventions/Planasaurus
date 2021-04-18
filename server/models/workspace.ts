import { v4 } from "uuid";

export default class Workspace {
    id: Number = 0;
    name: string = '';
    owner_id: string = '';
    uuid: string = '';

    static fromData(data: any): Workspace {
        let u = new this();
        u.id = data.id;
        u.name = data.name;
        u.owner_id = data.owner_id;
        u.uuid = v4();

        return u;
    }
}
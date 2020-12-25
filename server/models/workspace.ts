export default class Workspace {
    id: Number = 0;
    name: string = '';
    owner_id: string = '';

    static fromData(data: any): Workspace {
        let u = new this();
        u.id = data.id;
        return u;
    }
}
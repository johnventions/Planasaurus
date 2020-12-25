import Workspace from './workspace';

export default class User {
    id: Number = 0;
    firstname: string = '';
    lastname: string = '';
    email: string = '';
    default_workspace?: number;
    workspaces: Workspace[] = [];

    static fromData(data: any): User {
        let u = new this();
        u.id = data.id;
        return u;
    }

    setWorkspaces(ws: Workspace[]) {
        this.workspaces = ws;
    }
}
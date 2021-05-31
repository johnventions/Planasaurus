import Workspace from './workspace';

export default class User {
    id: number = 0;
    firstname: string = '';
    lastname: string = '';
    email: string = '';
    default_workspace?: number;
    workspaces: Workspace[] = [];

    static fromData(data: any): User {
        let u = new this();
        u.id = data.id;
        u.firstname = data.firstname;
        u.lastname = data.lastname;
        u.email = data.email;
        u.default_workspace = data.default_workspace;
        const wsArray = JSON.parse(data.myWorkspaces) || [];
        u.workspaces = wsArray.map((x:any) => Workspace.fromData(x));
        return u;
    }

    setWorkspaces(ws: Workspace[]) {
        this.workspaces = ws;
    }
}
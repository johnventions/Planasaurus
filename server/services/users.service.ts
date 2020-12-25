const { getSQLPool } = require('../sql');
import userQueries from '../queries/query.users';
import User from '../models/user';
import WorkspaceService from './workspace.service'
import Workspace from '../models/workspace';


export default class UserService {
    constructor() {

    }

    async createOrGetUser(method: string, user: any) {
        const pool = await getSQLPool;
        let dbUser = await userQueries.getUser(pool, method, user);
        if (dbUser.recordset.length == 0) {
            // create new user
            const newUserInsert = await userQueries.createUser(pool, method, user);
            const id = newUserInsert.recordset[0].id;
            dbUser = await userQueries.getUserById(pool, id);
            const u = dbUser.recordset[0] as User;
            // create their first workspace
            const wsService = new WorkspaceService();
            await wsService.createWorkSpace(u.id, 'My First Workspace');
        }
        return this.getUserComplete(dbUser.recordset[0] as User);
    }

    async getUserComplete(user: User): Promise<User> {
        const wsService = new WorkspaceService();
        const ws: Workspace[] = await wsService.getUserWorkspaces(user.id);
        user.workspaces = ws;
        return user;
    }

    async getUserById(id: Number) {
        const pool = await getSQLPool;
        const dbUser = await userQueries.getUserById(pool, id);
        return this.getUserComplete(dbUser.recordset[0] as User);
    }
}
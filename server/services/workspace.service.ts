const { getSQLPool } = require('../sql');
import workspaceQueries from '../queries/query.workspace';
import Workspace from '../models/workspace';
import UserService from './users.service';
import User from '../models/user';

export default class WorkspaceService {
    constructor() {
    }

    async createWorkSpace(ownerID: Number, name: String) {
        const pool = await getSQLPool;
        const ws = await workspaceQueries.createWorkspace(pool, ownerID, name);
        return ws;
    }

    async getUserWorkspaces(ownerID: Number) {
        const pool = await getSQLPool;
        const ws = await workspaceQueries.getWorkspacesByOwner(pool, ownerID);
        return ws.recordset as Workspace[];
    }

    async getWorkspaceSharedTos(id: Number) {
        const pool = await getSQLPool;
        const shared = await workspaceQueries.getWorkspaceSharedTos(pool, id);
        return shared.recordset;
    }

    async getWorkspaceById(id: Number) : Promise<Workspace> {
        const pool = await getSQLPool;
        const ws = await workspaceQueries.getWorkspacesById(pool, id);
        return ws.recordset[0] as Workspace;
    }

    async inviteUserToWorkspace(id: Number, email: string, addedBy: Number) {
        const pool = await getSQLPool;
        const userService =  new UserService();
        const existingUser : User | null = await userService.getUserByEmail(email);

        if (existingUser) {
            const hasWorkspace = existingUser ? existingUser.workspaces.find(x => x.id == id) : 0;
            if (hasWorkspace) return true;
            // add record, if user isnt already invited
            await workspaceQueries.addUserToWorkspace(pool, id, existingUser.id, addedBy);
        } else {
            // add invitation record
            await workspaceQueries.createWorkspaceInvitation(pool, id, email, addedBy);
        }

        return true;
    }
}
const { getSQLPool } = require('../sql');
import workspaceQueries from '../queries/query.workspace';
import Workspace from '../models/workspace';

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
}
import { Router, Request, Response, response } from 'express';

import WorkspaceService from "./services/workspace.service";

module.exports = function () {
    let routes: Router = require('express').Router();

    routes.get('/:id/invite', async (req: any, res: any) => {
        const sessionUser = req.user ? req.user : null;
        if (sessionUser == null) {
            return res.status(401).json({});
        }

        const { id } = req.params;

        const service = new WorkspaceService();
        const invites = await service.getWorkspaceSharedTos(id);

        return res.status(200).json(invites);
    });

    routes.post('/:id/invite', async (req: any, res: any) => {
        const sessionUser = req.user ? req.user : null;

        const { email } = req.body;
        const { id } = req.params;

        if (sessionUser == null) {
            return res.status(401).json({});
        }
        const service = new WorkspaceService();
        const invite = await service.inviteUserToWorkspace(id, email, sessionUser.id)

        return res.status(200).json({
            success: invite
        });
    });

    return routes;
}
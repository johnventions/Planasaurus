import { Router, Request, Response, response } from 'express';

//import Workspace from './models/workspace';
import UsersService from "./services/users.service";
import passport from './services/passport.service';

module.exports = function () {
    let routes: Router = require('express').Router();

    routes.get('/status', async (req: any, res: any) => {
        const sessionUser = req.user ? req.user : null;
        if (sessionUser == null) {
            return res.status(200).json({});
        }
        const service = new UsersService();
        const profile = await service.getUserById(sessionUser.id);
        return res.status(200).json({
            user: sessionUser.id,
            profile,
            workspace: sessionUser.workspace
        });
    });

    routes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    routes.get('/google/callback', 
        passport.authenticate('google', { failureRedirect: '/failed' }),
        async (req: Request, res: Response) => {
            res.redirect('/dash');
        }
    );

    return routes;
}
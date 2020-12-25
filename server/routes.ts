import { nextTick } from "process";

const routes = require('express').Router();

module.exports = function () {
    routes.get('/', async (req: any, res: any) => {
        res.status(200).json({ message: 'Connected!' });
    });

    // routes.get('/verify', async function(req: any, res: any) {
    //     var oauth2Client = getOAuthClient();
    //     const code = req.query.auth;
    //     const { tokens } = await oauth2Client.getToken(code);

    //     oauth2Client.setCredentials(tokens);

    //     const plus = google.plus({ version: 'v1', auth: oauth2Client });
    //     const me = await plus.people.get({ userId: 'me'});
        

    //     res.status(200).json({
    //         success: true,
    //         tokens: tokens,
    //         plus: plus,
    //         person: me
    //     });
    // });

    const projects = require('./routes.projects')();
    routes.use('/projects', projects);

    const types = require('./routes.types')();
    routes.use('/types', types);

    return routes;
}

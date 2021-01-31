require('dotenv').config();

import * as sql from 'mssql';

const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const { getSQLPool } = require('./server/sql');

const PORT = process.env.PORT || 3000;

class App {
    app: any;
    server: any;

    constructor() {
        this.createApp();
        this.appConfig();
        this.startServer();
        this.startDB();
        this.addApiRoutes();
        this.addRoutes();
    }

    createApp() {
        this.app = express();
    }

    
    appConfig() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.app.use(session({
            secret: process.env.SESSION_SECRET || 'planasaurus3000',
            resave: true,
            saveUninitialized: true
        }));

        this.app.use(passport.initialize());
        this.app.use(passport.session());

        this.app.use(express.static('dist'));
    }

    startServer() {
        this.server = this.app.listen(PORT, () => {
            console.log(`App is now listening on port ${PORT}!`);
        });
    }

    async startDB() {
        // this.db = require('./server/db')(mongoose, session);
        await getSQLPool;
    }

    addApiRoutes() {
        const apiRoutes = require('./server/routes')();
        this.app.use('/api', apiRoutes);

        const loginRoutes = require('./server/routes.login')();
        this.app.use('/signin', loginRoutes);

        const uploadRoutes = require('./server/routes.upload')();
        this.app.use('/upload', uploadRoutes);
    }

    addRoutes() {
        this.app.get('/*', (req: any, res: any) => {
            res.sendFile(path.join(__dirname, '/dist/index.html'));
        });
    }
}

const planasaurus = new App();

require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const redis = require('redis');
const redisConnect = require('connect-redis');


const { getSQLPool } = require('./server/sql');

const PORT = process.env.PORT || 3000;

class App {
    app: any;
    server: any;
    redisClient: any;

    constructor() {
        this.createApp();
        this.startRedis();
        this.appConfig();
        this.startServer();
        this.startDB();
        this.addApiRoutes();
        this.addRoutes();
    }

    createApp() {
        this.app = express();
    }

    startRedis() {
        this.redisClient = redis.createClient();
    }

    appConfig() {
        const redisStore = redisConnect(session);

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.app.use(session({
            secret: process.env.SESSION_SECRET || 'planasaurus3000',
            resave: true,
            saveUninitialized: true,
            store: new redisStore({
                host: 'localhost',
                name: 'pterobyteUUID',
                port: 6379,
                client: this.redisClient,
                ttl: 86400
            })
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
        await getSQLPool;
    }

    addApiRoutes() {
        const apiRoutes = require('./server/routes')();
        this.app.use('/api', apiRoutes);

        const loginRoutes = require('./server/routes.login')();
        this.app.use('/signin', loginRoutes);

        this.app.get('/logout', function(req: any, res: any){
            req.logout();
            res.redirect('/');
        });

        const uploadRoutes = require('./server/routes.upload')();
        this.app.use('/upload', uploadRoutes);
    }

    addRoutes() {
        this.app.get('/*', (req: any, res: any) => {
            res.sendFile(path.join(__dirname, './dist/index.html'));
        });
    }
}

const planasaurus = new App();
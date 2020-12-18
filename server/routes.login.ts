import { Router, Request, Response, response } from 'express';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

import UsersService from "./services/users.service";

const ClientId = process.env.GOOGLE_CLIENT_ID;
const ClientSecret = process.env.GOOGLE_SECRET;



passport.serializeUser(async function (user: any, done: any) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    const service = new UsersService();
    const userObj = {
        externalid: user.id,
        firstname: user.name ? user.name.givenName : '',
        lastname: user.name ? user.name.familyName : '',
        email: user._json ? user._json.email : ''
    };
    const userLogin = await service.createOrGetUser('googleid', userObj);
    console.log(userLogin);
    done(null, userLogin);
});

passport.deserializeUser(function (user: any, done: any) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    console.log("Deserliaze", user);
    done(null, user);
});


passport.use(new GoogleStrategy({
    clientID: ClientId,
    clientSecret: ClientSecret,
    callbackURL: "http://localhost:3355/login/google/callback"
},
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
        /*
         use the profile info (mainly profile id) to check if the user is registerd in ur db
         If yes select the user and pass him to the done callback
         If not create the user and then select him and pass to callback
        */
        return done(null, profile);
    }
));

module.exports = function () {
    let routes: Router = require('express').Router();

    routes.get('/status', (req: any, res: any) => {
        const sessionUser = req.session.passport ? req.session.passport.user : null;
        res.status(200).json({
            user: sessionUser
        });
    });

    routes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    routes.get('/google/callback', 
        passport.authenticate('google', { failureRedirect: '/failed' }),
        async (req: Request, res: Response) => {
            res.redirect('/');
        }
    );


    return routes;
}
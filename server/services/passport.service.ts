const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

import SiteSession from '../models/session';
import User from '../models/user';
import UsersService from "./users.service";

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
    const userLogin : User = await service.createOrGetUser('googleid', userObj);
    const activeWorkspace: number = userLogin.workspaces[0].id;

    const session = {
        id: userLogin.id,
        workspace: activeWorkspace,
        lastCheck: Date.now()
    } as SiteSession

    done(null, session);
});


passport.deserializeUser(async function (user: any, done: any) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
    /*
    const service = new UsersService();
    const userLogin = await service.getUserById(user.id);
    const activeWorkspace: number = userLogin.default_workspace ? userLogin.default_workspace : userLogin.workspaces[0].id;

    done(null, {
        user: userLogin,
        workspace: activeWorkspace
    });
    */
});


passport.use(new GoogleStrategy({
    clientID: ClientId,
    clientSecret: ClientSecret,
    callbackURL: `${process.env.BASE_DOMAIN}/signin/google/callback`
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

export default passport;
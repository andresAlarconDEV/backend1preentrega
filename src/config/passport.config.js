import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GithubStrategy } from "passport-github2";
import config from "./config.js";
import UsersController from "../controllers/users.controller.js";
import UsersService from "../services/user.service.js";


const localAdmin = {
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123',
    role: 'admin'
};

const githubOptions = {
    clientID: config.githubClientID,
    clientSecret: config.githubClientSecret,
    callbackURL: config.githubCallbackURL
};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies){
        token = req.cookies.token;
    }
    return token;
}

export const init = () => {
    const registerOpts = {
        usernameField: 'email',
        passReqToCallback: true
    };

    const jwtOptions = {
        secretOrKey: config.jwtSecret,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    };

    passport.use('jwt', new JWTStrategy(jwtOptions, (payload, done) => {
        return done(null, payload);
    }))

    // passport.use('register', new LocalStrategy(registerOpts, async (req, email, password, done) => {
    //     const user = await UsersController.postUser(req, email, password);
    //     done(null, user)
    // }));


    // passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    //     try{
    //         const user = await UsersController.getLoginUser(email, password);
    //         done(null, user);
    //     }
    //     catch(error){
    //         done(error);
    //     }
    // })
    // );

    passport.use('github', new GithubStrategy(githubOptions, async (accesstoken, refreshToken, profile, done) => {
        const email = profile._json.email;
        let user = await UsersController.getByEmail(email);
        if (user) {
            return done(null, user);
        }
        user = {
            first_name: profile._json.name,
            last_name: '',
            email,
            password: '',
            age: '18',
            cart: ''
        }
        const newUser = await UsersService.postUser(user);
        done(null, newUser);
    }));

    // passport.serializeUser((user, done) => {
    //     done(null, user._id)
    // });

    // passport.deserializeUser(async (uid, done) => {
    //     const user = await UsersService.getById(uid);
    //     done(null, user);
    // });
}
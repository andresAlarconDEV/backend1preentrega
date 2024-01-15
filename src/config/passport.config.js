import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from "passport-github2";
import config from "./config.js";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from '../utils2.js';

const localAdmin = {
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123',
    role: 'admin'
};

const githubOptions = {
    clientID: config.githubClientID,
    clientSecret: config.githubClientSecret,
    callbackURL: config.githubCallbackURL};

export const init = () => {
    const registerOpts = {
        usernameField: 'email',
        passReqToCallback: true
    };

    passport.use('register', new LocalStrategy( registerOpts, async (req, email, password, done)=> {
        const {
            body: {first_name,
            last_name,
            age,
            role,
            cart},} = req;
        if (!first_name || !last_name || !email || !password) {
            return done(new Error('Todos los campos son requeridos.'));
            // throw new Error('Todos los campos son obligatorios.');
        }

        const user = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            role,
            password: createHash(password),
            cart,
        });
        done(null, user)
    }));


    passport.use('login', new LocalStrategy({ usernameField: 'email' },async (email, password, done)=>{
        if (localAdmin.email === email && localAdmin.password === password) {
            done (null, { email, role: 'admin', isAdmin: true });
            return { email, role: 'admin', isAdmin: true };
        } else {
            const user = await userModel.findOne({ email });
            if (!user) {
                return done (new Error('Correo o contraseña no son validos.'));
                // throw new Error('Correo o contraseña no son validos.');
            };
            const isNotValidPass = isValidPassword(password, user)
            if (!isNotValidPass) {
                return done (new Error('Correo o contraseña no son validos.'));
                // throw new Error('Correo o contraseña no son validos.');
            };
            // const isAdmin = user.role === 'admin' ? true : false;
            console.log('user: ',user);
            done (null, user);
        };
    }
    )); 

    passport.use('github', new GithubStrategy(githubOptions, async (accesstoken, refreshToken, profile, done) => {
        const email = profile._json.email;
        let user = await userModel.findOne({ email });
        if (user) {
            return done (null, user);
        }
        user = {
            first_name: profile._json.name,
            last_name: '',
            email,
            password: '',
            age: '18',
            cart: ''
        }
        const newUser = await userModel.create(user);
        done(null, newUser);
    }));

    passport.serializeUser((user, done)=> {
        done(null, user._id)
    });

    passport.deserializeUser( async(uid, done)=> {
        const user = await userModel.findById(uid);
        done (null, user);
    });
}
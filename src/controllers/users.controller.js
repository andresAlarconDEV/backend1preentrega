import UsersService from "../services/user.service.js";
import { createHash, isValidPassword } from '../utils2.js'

const localAdmin = {
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123',
    role: 'admin'
};

export default class UsersController {

    static getAll() {
        return UsersService.getAll();
    }

    static getByEmail(email) {
        return UsersService.getByEmail(email);
    }
    
    static getById(email) {
        return UsersService.getById(email);
    }

    static async postUser(req) {
        const {
            body: { first_name,
                last_name,
                age,
                role,
                cart,
                email,
                password }, } = req;
        if (!first_name || !last_name || !email || !password) {
            return done(new Error('Todos los campos son requeridos.'));
        }
        const user = {
            first_name,
            last_name,
            email,
            age,
            role,
            password: createHash(password),
            cart,
        };
        const createUser = await UsersService.postUser(user);
        return createUser;
    }

    static async getLoginUser(body) {
        const { email, password} = body;
        if (localAdmin.email === email && localAdmin.password === password) {
            return { email, role: 'admin', isAdmin: true };
        } else {
            const user = await UsersService.getByEmail(email);
            if (!user) {
                // return (new Error('Correo o contraseña no son validos.'));
                throw new Error('Correo o contraseña no son validos.');
            };
            const isNotValidPass = isValidPassword(password, user)
            if (!isNotValidPass) {
                // return (new Error('Correo o contraseña no son validos.'));
                throw new Error('Correo o contraseña no son validos.');
            };
            return user;
        }
    }

}
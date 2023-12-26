import userModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../../utils2.js'

const localAdmin = {
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123',
    role: 'admin'
};

export default class UsersManager {

    static get() {
        return userModel.find();
    }

    static async loginUser(body) {
        const { email, password } = body;
        if (!email || !password) {
            throw new Error('Todos los campos son obligatorios.');
        };
        if (localAdmin.email === email && localAdmin.password === password) {
            return { email, role: 'admin', isAdmin: true };
        } else {
            const user = await userModel.findOne({ email });
            if (!user) {
                throw new Error('Correo o contraseña no son validos.');
            };
            const isNotValidPass = isValidPassword(password, user)
            if (!isNotValidPass) {
                throw new Error('Correo o contraseña no son validos.');
            };
            const {
                first_name,
                last_name,
                role,
                age } = user;
            const isAdmin = role === 'admin' ? true : false;
            return { first_name, last_name, age, email, role, isAdmin };
        }

    };

    static async addUser(body) {
        const {
            first_name,
            last_name,
            email,
            age,
            role,
            password } = body;
        if (!first_name || !last_name || !email || !password) {
            throw new Error('Todos los campos son obligatorios.');
        }

        const user = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            role,
            password: createHash(password)
        });

        return user;
    }
}
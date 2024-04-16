import UsersService from "../services/user.service.js";
import { createHash, isValidPassword } from '../utils/utils2.js'
import { CustomError } from "../utils/CustomError.js";
import { generatorUserIdError,generatorUserError, generatorLoginError, generatorEmailError, changePassError } from "../utils/CauseMessageError.js";
import EnumsError from "../utils/EnumsError.js";
import UsersDTO from "../dto/users.dto.js";
import EmailService from "../services/email.service.js";

const localAdmin = {
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123',
    role: 'admin'
};

export default class UsersController {

    static async getAll() {
        const users = await UsersService.getAll();
        const usersDTO = new UsersDTO(users);
        // return users;
        return usersDTO.users;
    }

    static async getByEmail(email) {
        const user = await UsersService.getByEmail(email);
        if (user) {
            return user;
        } else {
            // throw new Error('El Email ingresado no esta registrado en nuestra pagina');
            CustomError.create({
                name: 'Not found email',
                cause: generatorEmailError({
                    email: email
                }),
                message: 'El Email ingresado no esta registrado en nuestra pagina',
                code: EnumsError.NOTFOUND_ERROR,
            });

        }
    }

    static getById(uid) {
        return UsersService.getById(uid);
    }

    static async postUser(req) {
        const {
            body: { first_name,
                last_name,
                age,
                role = 'user',
                cart,
                email,
                password }, } = req;
        if (!first_name || !last_name || !email || !password) {
            CustomError.create({
                name: 'Invalid data user',
                cause: generatorUserError({
                    first_name,
                    last_name,
                    email,
                    age,
                }),
                message: 'Ocurrio un error mientras intentamos crear un nuevo usuario',
                code: EnumsError.INVALID_PARAMS_ERROR,
            });
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
        return "Se ha realizado la creación del usuario con email "+ createUser.email;
    }

    static async usersDelete(uid){
        await UsersService.deleteUserInactivity(uid);
    }
    static async getLoginUser(body) {
        const { email, password } = body;
        if (localAdmin.email === email && localAdmin.password === password) {
            return { email, role: 'admin', isAdmin: true };
        } else {
            const user = await UsersService.getByEmail(email);
            if (!user) {
                // return (new Error('Correo o contraseña no son validos.'));
                CustomError.create({
                    name: 'Invalid login',
                    cause: generatorLoginError(email),
                    message: 'Correo o contraseña no son validos',
                    code: EnumsError.UNAUTHORIZED_ERROR
                });
            };
            const isNotValidPass = isValidPassword(password, user)
            if (!isNotValidPass) {
                // return (new Error('Correo o contraseña no son validos.'));
                CustomError.create({
                    name: 'Invalid login',
                    cause: generatorLoginError(email),
                    message: 'Correo o contraseña no son validos',
                    code: EnumsError.UNAUTHORIZED_ERROR
                });
            };
            const last_connection = Date.now();
            await UsersService.updateById(user._id, { "last_connection": last_connection })
            return user;
        }
    }

    static async postChangePass(email, body) {
        const { password, confirmPassword } = body;
        if (password === confirmPassword) {
            const user = await UsersService.getByEmail(email);
            const isNotValidPass = isValidPassword(password, user);
            if (!isNotValidPass) {
                const passwordChange = createHash(password);
                await UsersService.postChangePass(email, passwordChange);
                console.log("se cambio la contraseña");
                return ("OK")
            } else {
                CustomError.create({
                    name: 'Invalid change Password',
                    cause: changePassError(body),
                    message: 'La contraseña debe ser distinta a las anteriormente usadas',
                    code: EnumsError.UNAUTHORIZED_ERROR
                });
            }
        }
        else {
            CustomError.create({
                name: 'Invalid change Password',
                cause: changePassError(body),
                message: 'Las contraseñas no coinciden',
                code: EnumsError.UNAUTHORIZED_ERROR
            });
        }
    }

    static async changeRole(uid) {
        const user = await UsersService.getById(uid);
        let response;
        if (user.role === "premium") {
            await UsersService.putChangeRole(uid, "user");
            response = "user";
        } else if (user.role === "user") {
            await UsersService.putChangeRole(uid, "premium");
            response = "premium";
        } else {
            CustomError.create({
                name: 'Invalid Role',
                cause: generatorUserIdError(uid),
                message: 'Error en el rol de usuario, no se puede cambiar',
                code: EnumsError.UNAUTHORIZED_ERROR,
            });
        }
        return response;
    }

    static async deleteUserInactivity() {
        const limitConnection = new Date();
        limitConnection.setDate(limitConnection.getDate() - 2);
        const usersDelete = await UsersService.getUserInactivity(limitConnection);

        if (usersDelete.length >= 1) {
            const emailService = EmailService.getInstance();
            usersDelete.map(async (u) => {
                const result = await emailService.sendEmail(
                    u.email,
                    'Se ha realizado la eliminación de su usuario por inactividad',
                    `<!DOCTYPE html>
                      <html lang="es">
                      <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>Eliminación de usuario</title>
                      </head>
                      <body style="font-family: Arial, sans-serif;">
                          <p>Hola,</p>
                          <p>Su usuario ha sido eliminado de BikeShop por inactividad.</p>
                          <p>Puede volver a registrarse para volver a usar nuestros servicios.</p>
                      </body>
                      </html>`);
            await UsersService.deleteUserInactivity(u._id);
                    })
                    return 'Se han eliminado ',usersDelete.length,' usuarios';


        } else {
            CustomError.create({
                name: 'Not found users',
                cause: generatorEmailError({
                    fechaInactividad: limitConnection
                }),
                message: 'No hay usuarios inactivos',
                code: EnumsError.NOTFOUND_ERROR,
            });
        }
        // const usersDelete = await UsersService.deleteUserInactivity(limitConnection);
        console.log("usersDelete", usersDelete);
        return usersDelete;
    }

}
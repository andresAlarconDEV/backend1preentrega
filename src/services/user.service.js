// import userDao from "../dao/mongoDB/user.mongodb.dao.js";
// import { userDao } from "../dao/factory.js";
import { usersRepository } from "../repositories/index.js";

export default class UsersService {

    static getAll (){
        return usersRepository.getAll();
    }

    static getByEmail (email){
        return usersRepository.getByEmail(email);
    }

    static getById (uid){
        return usersRepository.getById(uid);
    }

    static postUser (user){
        return usersRepository.postUser(user);
    }
}
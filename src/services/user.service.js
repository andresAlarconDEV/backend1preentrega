import userDao from "../dao/user.dao.js"

export default class UsersService {

    static getAll (){
        return userDao.getAll();
    }

    static getByEmail (email){
        return userDao.getByEmail(email);
    }

    static getById (uid){
        return userDao.getById(uid);
    }

    static postUser (user){
        return userDao.postUser(user);
    }
}
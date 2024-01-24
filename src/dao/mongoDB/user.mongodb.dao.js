import UserModel from '../models/user.model.js';

export default class UserDaoMongoDB {

    static getAll (){
        return UserModel.find();
    }

    static getByEmail (email){
        return UserModel.findOne({ email });
    }

    static getById (uid){
        return UserModel.findById(uid);
    }

    static postUser (user){
        return UserModel.create(user);
    }
}
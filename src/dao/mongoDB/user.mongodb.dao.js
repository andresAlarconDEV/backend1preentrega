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

    static postCartUser (uid, cid){
        return UserModel.updateOne({_id: uid}, { $push: {carts: {"idCart": cid} }});
    }

    static postChangePass (email, password){
        return UserModel.updateOne({email: email}, {$set: {password: password}});
    }
    static putChangeRole (uid, role){
        return UserModel.updateOne({_id: uid }, {$set: {role: role}});
    }
    
    static updateById (uid, object){
        return UserModel.updateOne({_id: uid }, {$set: object })
    }

    static async deleteUserInactivity (uid){
        return UserModel.deleteOne({_id: uid});
        // return UserModel.deleteMany({last_connection: {$lt: date}});
    }

    static async getUserInactivity (date){
        return UserModel.find({last_connection: {$lt: date}});
    }
}
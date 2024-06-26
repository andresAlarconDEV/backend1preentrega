export default class UserRepository {

    constructor(dao) {
        this.dao = dao;
    }

    getAll() {
        return this.dao.getAll();
    }

    getByEmail(email) {
        return this.dao.getByEmail(email);
    }

    getById(uid) {
        return this.dao.getById(uid);
    }

    postUser(user) {
        return this.dao.postUser(user);
    }

    postCartUser (uid, cid){
        return this.dao.postCartUser(uid, cid);
    }

    postChangePass(email, password){
        return this.dao.postChangePass(email, password);
    }

    putChangeRole(uid, role){
        return this.dao.putChangeRole(uid, role);
    }

    updateById(uid, object){
        return this.dao.updateById(uid, object);
    }

    deleteUserInactivity(uid){
        return this.dao.deleteUserInactivity(uid);
    }

    getUserInactivity(date){
        return this.dao.getUserInactivity(date);
    }


}
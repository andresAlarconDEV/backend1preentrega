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

}
export default class TicketRepository {

    constructor(dao) {
        this.dao = dao;
    }

    getAll() {
        return this.dao.getAll();
    }

    postTicket (cid){
        return this.dao.postTicket(cid);
    }
    
}
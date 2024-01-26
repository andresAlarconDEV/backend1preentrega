import TicketModel from '../models/ticket.model.js';

export default class CartDaoMongoDB {

    static getAll (){
        return TicketModel.find();
    }

static postTicket(ticket){
    return TicketModel.create(ticket);
}


}
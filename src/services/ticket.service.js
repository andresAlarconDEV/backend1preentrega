import { ticketsRepository } from "../repositories/index.js";

export default class TicketsService {

    static getAll (){
        return ticketsRepository.getAll();
    }

    static postTicket(ticket){
        return ticketsRepository.postTicket(ticket);
    }

};
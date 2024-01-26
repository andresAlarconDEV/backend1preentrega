import TicketsService from "../services/ticket.service.js";
import { v4 as uuidV4 } from "uuid";

export default class TicketsController {

    static getAll() {
        return TicketsService.getAll();
    }

    static postTicket(data){
        const ticket = {
            ...data,
            code: uuidV4(),
        }
        return TicketsService.postTicket(ticket);
    }
}
import { ticketsModel } from "../../models/tickets.model.js";
import Manager from "./basic.dao.js";

class TicketsDao extends Manager {
    constructor(){
        super(ticketsModel);
    }
}

export const ticketsDao = new TicketsDao();
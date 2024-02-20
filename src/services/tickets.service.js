import { ticketsDao } from "../DAOs/MongoDB/tickets.dao.js";
import { hashData } from "../utils/utils.js";
import { customError, ErrorMessages } from "../errors/error.js";

export const findAll = async () => {
    const tickets = await ticketsDao.getAll();
    return tickets;
};
export const findById = async (id) => {
    const { tid } = id;
    const ticket = await ticketsDao.getById(tid);
    if (!ticket) return customError.createError(ErrorMessages.TICKET_NOT_FOUND, ErrorMessages.ISSUE_TICKET);
    return ticket;
};
export const create = async (amount, emailPurchaser) => {
    if(!amount) return customError.createError(ErrorMessages.MISSING_DATA, ErrorMessages.ISSUE_TICKET);

    const hashEmail = await hashData(emailPurchaser);
    const currentDate = new Date();
    const code = `${currentDate.getDay()}${currentDate.getMonth()}${currentDate.getFullYear()}${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getSeconds()}${currentDate.getMilliseconds()}<${hashEmail}`;

    const ticket = {
        code: code,
        amount: amount,
        purchaser: emailPurchaser
    };

    const ticketGenerated = await ticketsDao.create(ticket);
    return ticketGenerated;
};

export const deleteOne = async (id) => {
    const { tid } = id;
    const ticket = await ticketsDao.delete(tid);
    return ticket;
};

import { findAll, findById, create, deleteOne } from "../services/tickets.service.js";

export const findTickets = async (req, res, next) => {
    try {
        const tickets = await findAll();
        res.status(200).json({ message: 'Tickets found.', tickets });
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    };
};

export const findTicketById = async (req, res, next) => {
    try {
        const ticket = await findById(req.params);
        res.status(200).json({ message: "Ticket found.", ticket });
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    };
};

export const createTicket = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const ticket = await create(amount, req.user.email);
        res.status(200).json({message: "Ticket generated.", ticket});
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    };
};

export const deleteTicket = async (req, res, next) => {
    try {
        const ticket = deleteOne(req.params);
        res.status(200).json({message: "Ticket deleted.", ticket});
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    };
};

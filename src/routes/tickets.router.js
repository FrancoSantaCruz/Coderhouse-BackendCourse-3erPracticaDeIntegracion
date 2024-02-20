import { Router } from "express";
import { findTickets, findTicketById, createTicket, deleteTicket  } from "../controllers/tickets.controller.js";

const router = Router();

router.get('/', findTickets);
router.get('/:tid', findTicketById);
router.post('/new', createTicket);
router.delete('/delete/:tid', deleteTicket);

export default router;
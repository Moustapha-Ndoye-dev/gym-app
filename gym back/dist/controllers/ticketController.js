"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicket = exports.createTicket = exports.getAllTickets = void 0;
const ticketModel_1 = require("../models/ticketModel");
const getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketModel_1.TicketModel.getAll(req.user.gymId);
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des tickets' });
    }
};
exports.getAllTickets = getAllTickets;
const createTicket = async (req, res) => {
    try {
        const id = await ticketModel_1.TicketModel.create({ ...req.body, gymId: req.user.gymId });
        res.status(201).json({ id, message: 'Ticket créé avec succès' });
    }
    catch (error) {
        console.error('CreateTicket error:', error);
        res.status(500).json({
            message: 'Erreur lors de la création du ticket',
            error: error?.message || String(error),
            details: error
        });
    }
};
exports.createTicket = createTicket;
const deleteTicket = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const changes = await ticketModel_1.TicketModel.delete(id, req.user.gymId);
        if (changes === 0)
            return res.status(404).json({ message: 'Ticket introuvable' });
        res.json({ message: 'Ticket supprimé avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};
exports.deleteTicket = deleteTicket;

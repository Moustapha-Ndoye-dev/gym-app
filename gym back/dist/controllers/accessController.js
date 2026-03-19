"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccess = exports.getLogs = void 0;
const accessModel_1 = require("../models/accessModel");
const memberModel_1 = require("../models/memberModel");
const ticketModel_1 = require("../models/ticketModel");
const getLogs = async (req, res) => {
    try {
        const logs = await accessModel_1.AccessModel.getLogs(req.user.gymId);
        res.json(logs);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Erreur lors de la récupération des logs' });
    }
};
exports.getLogs = getLogs;
const verifyAccess = async (req, res) => {
    try {
        const { qr_code } = req.body;
        let member_id = null;
        let ticket_id = null;
        let granted = false;
        let message = 'Code invalide';
        let memberData = null;
        let foundInDb = false;
        if (typeof qr_code === 'string' && qr_code.startsWith('MEMBER-')) {
            const parsedId = parseInt(qr_code.split('-')[1]);
            if (!isNaN(parsedId)) {
                const member = await memberModel_1.MemberModel.getById(parsedId, req.user.gymId);
                if (member) {
                    foundInDb = true;
                    member_id = parsedId;
                    const now = new Date();
                    const expiryDate = member.expiryDate;
                    if (expiryDate && new Date(expiryDate) > now) {
                        granted = true;
                        message = 'Accès autorisé';
                    }
                    else {
                        granted = false;
                        message = expiryDate
                            ? 'Abonnement expiré'
                            : 'Aucun abonnement actif';
                    }
                    memberData = {
                        firstName: member.firstName,
                        lastName: member.lastName,
                        photo: member.photo,
                    };
                }
                else {
                    message = 'Membre introuvable ou non autorisé';
                }
            }
        }
        else if (typeof qr_code === 'string' && qr_code.startsWith('TICKET-')) {
            const parsedId = parseInt(qr_code.split('-')[1]);
            if (!isNaN(parsedId)) {
                const ticket = await ticketModel_1.TicketModel.getById(parsedId, req.user.gymId);
                if (ticket) {
                    foundInDb = true;
                    ticket_id = parsedId;
                    if (ticket.status === 'valid') {
                        granted = true;
                        message = 'Ticket valide';
                        await ticketModel_1.TicketModel.updateStatus(parsedId, req.user.gymId, 'used');
                    }
                    else {
                        message = 'Ticket déjà utilisé ou expiré';
                    }
                }
                else {
                    message = 'Ticket introuvable ou non autorisé';
                }
            }
        }
        if (foundInDb) {
            await accessModel_1.AccessModel.logAccess(member_id, ticket_id, granted ? 'granted' : 'denied');
        }
        res.json({ granted, message, member: memberData });
    }
    catch (error) {
        console.error('Access verification error:', error);
        res.status(500).json({ message: 'Erreur lors de la vérification' });
    }
};
exports.verifyAccess = verifyAccess;

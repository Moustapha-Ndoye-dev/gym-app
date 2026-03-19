import { TicketModel } from '../models/ticketModel';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

export const getAllTickets = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const tickets = await TicketModel.getAll(req.user.gymId);
    res.json(tickets);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des tickets' });
  }
};

export const createTicket = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const id = await TicketModel.create({ ...req.body, gymId: req.user.gymId });
    res.status(201).json({ id, message: 'Ticket créé avec succès' });
  } catch (error: any) {
    console.error('CreateTicket error:', error);
    res.status(500).json({
      message: 'Erreur lors de la création du ticket',
      error: error?.message || String(error),
      details: error,
    });
  }
};

export const deleteTicket = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const id = parseInt(req.params.id as string);
    const changes = await TicketModel.delete(id, req.user.gymId);
    if (changes === 0)
      return res.status(404).json({ message: 'Ticket introuvable' });
    res.json({ message: 'Ticket supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

import { AccessModel } from '../models/accessModel';
import { MemberModel } from '../models/memberModel';
import { TicketModel } from '../models/ticketModel';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

export const getLogs = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const logs = await AccessModel.getLogs(req.user.gymId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logs' });
  }
};

export const verifyAccess = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { qr_code } = req.body;
    let member_id: number | null = null;
    let ticket_id: number | null = null;
    let granted = false;
    let message = 'Code invalide';
    let memberData = null;
    let foundInDb = false;

    if (typeof qr_code === 'string' && qr_code.startsWith('MEMBER-')) {
      const parsedId = parseInt(qr_code.split('-')[1]);
      if (!isNaN(parsedId)) {
        const member = await MemberModel.getById(parsedId, req.user.gymId);
        if (member) {
          foundInDb = true;
          member_id = parsedId;
          const now = new Date();
          const expiryDate = (member as any).expiryDate;
          
          if (expiryDate && new Date(expiryDate) > now) {
            granted = true;
            message = 'Accès autorisé';
          } else {
            granted = false;
            message = expiryDate ? 'Abonnement expiré' : 'Aucun abonnement actif';
          }

          memberData = {
            firstName: (member as any).firstName,
            lastName: (member as any).lastName,
            photo: (member as any).photo
          };
        } else {
          message = 'Membre introuvable ou non autorisé';
        }
      }
    } else if (typeof qr_code === 'string' && qr_code.startsWith('TICKET-')) {
      const parsedId = parseInt(qr_code.split('-')[1]);
      if (!isNaN(parsedId)) {
        const ticket = await TicketModel.getById(parsedId, req.user.gymId);
        if (ticket) {
          foundInDb = true;
          ticket_id = parsedId;
          if (ticket.status === 'valid') {
            granted = true;
            message = 'Ticket valide';
            await TicketModel.updateStatus(parsedId, req.user.gymId, 'used');
          } else {
            message = 'Ticket déjà utilisé ou expiré';
          }
        } else {
          message = 'Ticket introuvable ou non autorisé';
        }
      }
    }

    if (foundInDb) {
      await AccessModel.logAccess(member_id, ticket_id, granted ? 'granted' : 'denied');
    }

    res.json({ granted, message, member: memberData });
  } catch (error) {
    console.error('Access verification error:', error);
    res.status(500).json({ message: 'Erreur lors de la vérification' });
  }
};

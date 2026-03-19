import { SubscriptionModel } from '../models/subscriptionModel';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

export const getAllSubscriptions = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const subscriptions = await SubscriptionModel.getAll(req.user.gymId);
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des abonnements' });
  }
};

export const createSubscription = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = await SubscriptionModel.create({ ...req.body, gymId: req.user.gymId });
    res.status(201).json({ id, message: 'Abonnement créé avec succès' });
  } catch (error: any) {
    console.error('CreateSubscription error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'abonnement', 
      error: error?.message || String(error),
      details: error
    });
  }
};

export const updateSubscription = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id as string);
    const changes = await SubscriptionModel.update(id, req.user.gymId, req.body);
    if (changes === 0) return res.status(404).json({ message: 'Abonnement introuvable' });
    res.json({ message: 'Abonnement mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

export const deleteSubscription = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id as string);
    const changes = await SubscriptionModel.delete(id, req.user.gymId);
    if (changes === 0) return res.status(404).json({ message: 'Abonnement introuvable' });
    res.json({ message: 'Abonnement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

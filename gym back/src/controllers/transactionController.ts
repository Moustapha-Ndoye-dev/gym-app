import { Request, Response } from 'express';
import { TransactionModel } from '../models/transactionModel';
import { AuthRequest } from '../middleware/auth';

export const getAllTransactions = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const transactions = await TransactionModel.getAll(req.user.gymId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des transactions' });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const data = { ...req.body, user_id: req.user.id, gymId: req.user.gymId };
    const id = await TransactionModel.create(data);
    res.status(201).json({ id, message: 'Transaction créée avec succès' });
  } catch (error: any) {
    console.error('CreateTransaction error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la transaction', 
      error: error?.message || String(error),
      details: error
    });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id as string);
    const changes = await TransactionModel.delete(id, req.user.gymId);
    if (changes === 0) return res.status(404).json({ message: 'Transaction introuvable' });
    res.json({ message: 'Transaction supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

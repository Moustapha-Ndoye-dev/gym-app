import { MemberModel } from '../models/memberModel';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

export const getAllMembers = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const members = await MemberModel.getAll(req.user.gymId);
    res.json(members);
  } catch (error) {
    console.error('GetAllMembers error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des membres', error });
  }
};

export const createMember = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = await MemberModel.create({ ...req.body, gymId: req.user.gymId });
    res.status(201).json({ id, message: 'Membre créé avec succès' });
  } catch (error: any) {
    if (error.code === 'P2002') { 
      return res.status(400).json({ message: 'L\'adresse email existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la création du membre' });
  }
};

export const updateMember = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id as string);
    const changes = await MemberModel.update(id, req.user.gymId, req.body);
    if (changes === 0) return res.status(404).json({ message: 'Membre introuvable' });
    res.json({ message: 'Membre mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

export const deleteMember = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id as string);
    const changes = await MemberModel.delete(id, req.user.gymId);
    if (changes === 0) return res.status(404).json({ message: 'Membre introuvable' });
    res.json({ message: 'Membre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

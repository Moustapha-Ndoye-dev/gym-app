import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';

export const getAllUsers = async (
  req: any,
  res: Response
): Promise<any> => {
  try {
    const users = await UserModel.getAll(req.user.gymId);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération' });
  }
};

  }
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password, role, gymId } = req.body;
    const user = await UserModel.createUser(username, password, role, gymId || 1);
    res.status(201).json({ id: user.id, message: 'Utilisateur créé avec succès' });
  } catch (error: any) {

    if (error.code === 'P2002') {
      // Prisma unique constraint code
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    }
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'utilisateur" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password, role } = req.body;
    const changes = await UserModel.update(
      parseInt(req.params.id as string),
      username,
      role,
      password
    );
    if (changes === 0)
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const changes = await UserModel.delete(parseInt(req.params.id as string));
    if (changes === 0)
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

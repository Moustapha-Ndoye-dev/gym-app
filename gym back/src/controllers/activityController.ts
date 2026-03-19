import { ActivityModel } from '../models/activityModel';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

export const getAllActivities = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const activities = await ActivityModel.getAll(req.user.gymId);
    res.json(activities);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des activités' });
  }
};

export const createActivity = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const id = await ActivityModel.create({
      ...req.body,
      gymId: req.user.gymId,
    });
    res.status(201).json({ id, message: 'Activité créée avec succès' });
  } catch (error: any) {
    console.error('CreateActivity error:', error);
    res.status(500).json({
      message: "Erreur lors de la création de l'activité",
      error: error?.message || String(error),
      details: error,
    });
  }
};

export const updateActivity = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const id = parseInt(req.params.id as string);
    const changes = await ActivityModel.update(id, req.user.gymId, req.body);
    if (changes === 0)
      return res.status(404).json({ message: 'Activité introuvable' });
    res.json({ message: 'Activité mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

export const deleteActivity = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const id = parseInt(req.params.id as string);
    const changes = await ActivityModel.delete(id, req.user.gymId);
    if (changes === 0)
      return res.status(404).json({ message: 'Activité introuvable' });
    res.json({ message: 'Activité supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

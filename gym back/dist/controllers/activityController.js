"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteActivity = exports.updateActivity = exports.createActivity = exports.getAllActivities = void 0;
const activityModel_1 = require("../models/activityModel");
const getAllActivities = async (req, res) => {
    try {
        const activities = await activityModel_1.ActivityModel.getAll(req.user.gymId);
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des activités' });
    }
};
exports.getAllActivities = getAllActivities;
const createActivity = async (req, res) => {
    try {
        const id = await activityModel_1.ActivityModel.create({ ...req.body, gymId: req.user.gymId });
        res.status(201).json({ id, message: 'Activité créée avec succès' });
    }
    catch (error) {
        console.error('CreateActivity error:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de l\'activité',
            error: error?.message || String(error),
            details: error
        });
    }
};
exports.createActivity = createActivity;
const updateActivity = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const changes = await activityModel_1.ActivityModel.update(id, req.user.gymId, req.body);
        if (changes === 0)
            return res.status(404).json({ message: 'Activité introuvable' });
        res.json({ message: 'Activité mise à jour avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
};
exports.updateActivity = updateActivity;
const deleteActivity = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const changes = await activityModel_1.ActivityModel.delete(id, req.user.gymId);
        if (changes === 0)
            return res.status(404).json({ message: 'Activité introuvable' });
        res.json({ message: 'Activité supprimée avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};
exports.deleteActivity = deleteActivity;

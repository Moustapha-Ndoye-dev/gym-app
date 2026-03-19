"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscription = exports.updateSubscription = exports.createSubscription = exports.getAllSubscriptions = void 0;
const subscriptionModel_1 = require("../models/subscriptionModel");
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await subscriptionModel_1.SubscriptionModel.getAll(req.user.gymId);
        res.json(subscriptions);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Erreur lors de la récupération des abonnements' });
    }
};
exports.getAllSubscriptions = getAllSubscriptions;
const createSubscription = async (req, res) => {
    try {
        const id = await subscriptionModel_1.SubscriptionModel.create({
            ...req.body,
            gymId: req.user.gymId,
        });
        res.status(201).json({ id, message: 'Abonnement créé avec succès' });
    }
    catch (error) {
        console.error('CreateSubscription error:', error);
        res.status(500).json({
            message: "Erreur lors de la création de l'abonnement",
            error: error?.message || String(error),
            details: error,
        });
    }
};
exports.createSubscription = createSubscription;
const updateSubscription = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const changes = await subscriptionModel_1.SubscriptionModel.update(id, req.user.gymId, req.body);
        if (changes === 0)
            return res.status(404).json({ message: 'Abonnement introuvable' });
        res.json({ message: 'Abonnement mis à jour avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
};
exports.updateSubscription = updateSubscription;
const deleteSubscription = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const changes = await subscriptionModel_1.SubscriptionModel.delete(id, req.user.gymId);
        if (changes === 0)
            return res.status(404).json({ message: 'Abonnement introuvable' });
        res.json({ message: 'Abonnement supprimé avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};
exports.deleteSubscription = deleteSubscription;

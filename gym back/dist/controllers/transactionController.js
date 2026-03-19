"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.createTransaction = exports.getAllTransactions = void 0;
const transactionModel_1 = require("../models/transactionModel");
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionModel_1.TransactionModel.getAll(req.user.gymId);
        res.json(transactions);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Erreur lors de la récupération des transactions' });
    }
};
exports.getAllTransactions = getAllTransactions;
const createTransaction = async (req, res) => {
    try {
        const data = { ...req.body, user_id: req.user.id, gymId: req.user.gymId };
        const id = await transactionModel_1.TransactionModel.create(data);
        res.status(201).json({ id, message: 'Transaction créée avec succès' });
    }
    catch (error) {
        console.error('CreateTransaction error:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de la transaction',
            error: error?.message || String(error),
            details: error,
        });
    }
};
exports.createTransaction = createTransaction;
const deleteTransaction = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const changes = await transactionModel_1.TransactionModel.delete(id, req.user.gymId);
        if (changes === 0)
            return res.status(404).json({ message: 'Transaction introuvable' });
        res.json({ message: 'Transaction supprimée avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};
exports.deleteTransaction = deleteTransaction;

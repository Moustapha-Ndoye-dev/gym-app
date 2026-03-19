"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const userModel_1 = require("../models/userModel");
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel_1.UserModel.getAll();
        res.json(users);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
};
exports.getAllUsers = getAllUsers;
const createUser = async (req, res) => {
    try {
        const { username, password, role, gymId } = req.body;
        const user = await userModel_1.UserModel.createUser(username, password, role, gymId || 1);
        res.status(201).json({ id: user.id, message: 'Utilisateur créé avec succès' });
    }
    catch (error) {
        if (error.code === 'P2002') {
            // Prisma unique constraint code
            return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
        }
        res
            .status(500)
            .json({ message: "Erreur lors de la création de l'utilisateur" });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const changes = await userModel_1.UserModel.update(parseInt(req.params.id), username, role, password);
        if (changes === 0)
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        res.json({ message: 'Utilisateur mis à jour avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const changes = await userModel_1.UserModel.delete(parseInt(req.params.id));
        if (changes === 0)
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        res.json({ message: 'Utilisateur supprimé avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};
exports.deleteUser = deleteUser;

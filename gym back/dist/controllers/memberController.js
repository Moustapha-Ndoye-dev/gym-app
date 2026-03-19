"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMember = exports.updateMember = exports.createMember = exports.getAllMembers = void 0;
const memberModel_1 = require("../models/memberModel");
const getAllMembers = async (req, res) => {
    try {
        const members = await memberModel_1.MemberModel.getAll(req.user.gymId);
        res.json(members);
    }
    catch (error) {
        console.error('GetAllMembers error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des membres', error });
    }
};
exports.getAllMembers = getAllMembers;
const createMember = async (req, res) => {
    try {
        const id = await memberModel_1.MemberModel.create({ ...req.body, gymId: req.user.gymId });
        res.status(201).json({ id, message: 'Membre créé avec succès' });
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'L\'adresse email existe déjà' });
        }
        res.status(500).json({ message: 'Erreur lors de la création du membre' });
    }
};
exports.createMember = createMember;
const updateMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const changes = await memberModel_1.MemberModel.update(id, req.user.gymId, req.body);
        if (changes === 0)
            return res.status(404).json({ message: 'Membre introuvable' });
        res.json({ message: 'Membre mis à jour avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
};
exports.updateMember = updateMember;
const deleteMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const changes = await memberModel_1.MemberModel.delete(id, req.user.gymId);
        if (changes === 0)
            return res.status(404).json({ message: 'Membre introuvable' });
        res.json({ message: 'Membre supprimé avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};
exports.deleteMember = deleteMember;

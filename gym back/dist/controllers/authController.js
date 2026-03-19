"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGym = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("../models/userModel");
const gymModel_1 = require("../models/gymModel");
const login = async (req, res) => {
    const { username, password } = req.body;
    console.log(`[AUTH-DEV] Login attempt for identifier: ${username}`);
    try {
        // Try finding by username first, then by email
        let user = await userModel_1.UserModel.findByUsername(username);
        if (!user) {
            user = await userModel_1.UserModel.findByEmail(username);
        }
        if (!user) {
            console.log(`[AUTH-DEV] User not found with identifier: ${username}`);
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }
        console.log(`[AUTH-DEV] User found, comparing passwords...`);
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            console.log(`[AUTH-DEV] Password mismatch for user: ${username}`);
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }
        console.log(`[AUTH-DEV] Login successful for user: ${username} (Role: ${user.role})`);
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role, gymId: user.gymId }, secret, { expiresIn: '24h' });
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                gymId: user.gymId
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion.', error: error instanceof Error ? error.message : error });
    }
};
exports.login = login;
const registerGym = async (req, res) => {
    const { gymName, gymEmail, adminUsername, adminPassword } = req.body;
    try {
        // 1. Create Gym
        console.log(`[AUTH-DEV] Registering new gym: ${gymName} (${gymEmail})`);
        const gym = await gymModel_1.GymModel.create({
            name: gymName,
            email: gymEmail
        });
        // 2. Create Admin User for this Gym
        console.log(`[AUTH-DEV] Creating admin user: ${adminUsername} for gym: ${gym.id}`);
        const userId = await userModel_1.UserModel.createUser(adminUsername, adminPassword, 'admin', gym.id);
        res.status(201).json({
            message: 'Salle de gym et administrateur créés avec succès.',
            gym,
            adminUserId: userId
        });
    }
    catch (error) {
        console.error('RegisterGym error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'L\'email ou le nom d\'utilisateur existe déjà.' });
        }
        res.status(500).json({
            message: 'Erreur lors de l\'enregistrement de la salle de gym.',
            error: error?.message || error
        });
    }
};
exports.registerGym = registerGym;

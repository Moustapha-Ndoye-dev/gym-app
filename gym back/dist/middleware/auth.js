"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Accès refusé. Aucun jeton fourni ou format invalide.' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        const verified = jsonwebtoken_1.default.verify(token, secret);
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Jeton invalide ou expiré.' });
    }
};
exports.auth = auth;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès interdit. Rôle non autorisé.' });
        }
        next();
    };
};
exports.requireRole = requireRole;

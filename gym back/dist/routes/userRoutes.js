"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs (Admin seulement)
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, cashier, controller]
 */
const userSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
        password: zod_1.z.string().min(5, "Le mot de passe doit contenir au moins 5 caractères").optional(),
        role: zod_1.z.enum(['admin', 'cashier', 'controller'])
    })
});
const idSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, "L'ID doit être un nombre")
    })
});
router.use(auth_1.auth);
router.use((0, auth_1.requireRole)(['admin'])); // Only admins can manage users
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Liste des utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', userController_1.getAllUsers);
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', (0, validate_1.validate)(userSchema), userController_1.createUser);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', (0, validate_1.validate)(idSchema), (0, validate_1.validate)(userSchema), userController_1.updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', (0, validate_1.validate)(idSchema), userController_1.deleteUser);
exports.default = router;

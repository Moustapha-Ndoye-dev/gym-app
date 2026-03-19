"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Gestion des flux financiers (Revenus/Dépenses)
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - amount
 *         - type
 *       properties:
 *         id:
 *           type: integer
 *         amount:
 *           type: number
 *         type:
 *           type: string
 *           enum: [income, expense]
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 */
const transactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive("Le montant doit être positif").or(zod_1.z.number().negative("Le montant doit être négatif en cas de dépense")),
        type: zod_1.z.enum(['income', 'expense']),
        description: zod_1.z.string().optional().or(zod_1.z.literal(''))
    })
});
const idSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, "L'ID doit être un nombre")
    })
});
router.use(auth_1.auth);
/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Récupérer toutes les transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', transactionController_1.getAllTransactions);
/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Créer une transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', (0, validate_1.validate)(transactionSchema), transactionController_1.createTransaction);
/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Supprimer une transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', (0, validate_1.validate)(idSchema), transactionController_1.deleteTransaction);
exports.default = router;

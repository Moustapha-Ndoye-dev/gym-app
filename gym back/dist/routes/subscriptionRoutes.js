"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionController_1 = require("../controllers/subscriptionController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Gestion des abonnements
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - duration_months
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         duration_months:
 *           type: integer
 *         features:
 *           type: string
 */
const subscriptionSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Le nom est requis"),
        price: zod_1.z.number().positive("Le prix doit être positif"),
        durationMonths: zod_1.z.number().int().positive("La durée doit être d'au moins 1 mois"),
        features: zod_1.z.string().optional().or(zod_1.z.literal(''))
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
 * /api/subscriptions:
 *   get:
 *     summary: Récupérer tous les abonnements
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', subscriptionController_1.getAllSubscriptions);
/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Créer un abonnement
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', (0, validate_1.validate)(subscriptionSchema), subscriptionController_1.createSubscription);
/**
 * @swagger
 * /api/subscriptions/{id}:
 *   put:
 *     summary: Modifier un abonnement
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', (0, validate_1.validate)(idSchema), (0, validate_1.validate)(subscriptionSchema), subscriptionController_1.updateSubscription);
/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Supprimer un abonnement
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', (0, validate_1.validate)(idSchema), subscriptionController_1.deleteSubscription);
exports.default = router;

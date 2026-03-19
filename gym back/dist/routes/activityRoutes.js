"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activityController_1 = require("../controllers/activityController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: Gestion des activités sportives
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Activity:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         instructor:
 *           type: string
 *         schedule:
 *           type: string
 *         capacity:
 *           type: integer
 */
const activitySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Le nom est requis'),
        description: zod_1.z.string().optional().or(zod_1.z.literal('')),
        instructor: zod_1.z.string().optional().or(zod_1.z.literal('')),
        schedule: zod_1.z.string().optional().or(zod_1.z.literal('')),
        capacity: zod_1.z.number().int().positive().optional(),
    }),
});
const idSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, "L'ID doit être un nombre"),
    }),
});
router.use(auth_1.auth);
/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Récupérer toutes les activités
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des activités
 */
router.get('/', activityController_1.getAllActivities);
/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Créer une activité
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *     responses:
 *       201:
 *         description: Activité créée
 */
router.post('/', (0, validate_1.validate)(activitySchema), activityController_1.createActivity);
/**
 * @swagger
 * /api/activities/{id}:
 *   put:
 *     summary: Modifier une activité
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 */
router.put('/:id', (0, validate_1.validate)(idSchema), (0, validate_1.validate)(activitySchema), activityController_1.updateActivity);
/**
 * @swagger
 * /api/activities/{id}:
 *   delete:
 *     summary: Supprimer une activité
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete('/:id', (0, validate_1.validate)(idSchema), activityController_1.deleteActivity);
exports.default = router;

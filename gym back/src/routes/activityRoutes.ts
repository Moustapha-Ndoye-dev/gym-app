import { Router } from 'express';
import { getAllActivities, createActivity, updateActivity, deleteActivity } from '../controllers/activityController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

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

const activitySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Le nom est requis"),
    description: z.string().optional().or(z.literal('')),
    instructor: z.string().optional().or(z.literal('')),
    schedule: z.string().optional().or(z.literal('')),
    capacity: z.number().int().positive().optional()
  })
});

const idSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "L'ID doit être un nombre")
  })
});

router.use(auth);

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
router.get('/', getAllActivities);

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
router.post('/', validate(activitySchema), createActivity);

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
router.put('/:id', validate(idSchema), validate(activitySchema), updateActivity);

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
router.delete('/:id', validate(idSchema), deleteActivity);

export default router;

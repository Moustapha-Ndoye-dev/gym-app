import { Router } from 'express';
import { getAllSubscriptions, createSubscription, updateSubscription, deleteSubscription } from '../controllers/subscriptionController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

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

const subscriptionSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Le nom est requis"),
    price: z.number().positive("Le prix doit être positif"),
    durationMonths: z.number().int().positive("La durée doit être d'au moins 1 mois"),
    features: z.string().optional().or(z.literal(''))
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
 * /api/subscriptions:
 *   get:
 *     summary: Récupérer tous les abonnements
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getAllSubscriptions);

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Créer un abonnement
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validate(subscriptionSchema), createSubscription);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   put:
 *     summary: Modifier un abonnement
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', validate(idSchema), validate(subscriptionSchema), updateSubscription);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Supprimer un abonnement
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', validate(idSchema), deleteSubscription);

export default router;

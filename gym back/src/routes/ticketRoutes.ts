import { Router } from 'express';
import {
  getAllTickets,
  createTicket,
  deleteTicket,
} from '../controllers/ticketController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Gestion des tickets d'entrée (pass journalier)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - type
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *         type:
 *           type: string
 *         price:
 *           type: number
 */

const ticketSchema = z.object({
  body: z.object({
    type: z.string().min(2, 'Le type est requis'),
    price: z.number().positive('Le prix doit être positif'),
  }),
});

const idSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "L'ID doit être un nombre"),
  }),
});

router.use(auth);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Récupérer tous les tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getAllTickets);

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Créer un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validate(ticketSchema), createTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Supprimer un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', validate(idSchema), deleteTicket);

export default router;

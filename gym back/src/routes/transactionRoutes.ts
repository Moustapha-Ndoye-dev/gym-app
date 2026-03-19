import { Router } from 'express';
import { getAllTransactions, createTransaction, deleteTransaction } from '../controllers/transactionController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

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

const transactionSchema = z.object({
  body: z.object({
    amount: z.number().positive("Le montant doit être positif").or(z.number().negative("Le montant doit être négatif en cas de dépense")),
    type: z.enum(['income', 'expense']),
    description: z.string().optional().or(z.literal(''))
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
 * /api/transactions:
 *   get:
 *     summary: Récupérer toutes les transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getAllTransactions);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Créer une transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validate(transactionSchema), createTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Supprimer une transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', validate(idSchema), deleteTransaction);

export default router;

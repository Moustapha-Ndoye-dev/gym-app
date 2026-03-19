import { Router } from 'express';
import { getAllMembers, createMember, updateMember, deleteMember } from '../controllers/memberController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Gestion des adhérents (Adhérents)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *       properties:
 *         id:
 *           type: integer
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         registration_date:
 *           type: string
 *           format: date
 */

const memberSchema = z.object({
  body: z.object({
    first_name: z.string().min(2, "Le prénom est requis"),
    last_name: z.string().min(2, "Le nom est requis"),
    phone: z.string().optional(),
    email: z.string().email("Format d'email invalide").optional().or(z.literal(''))
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
 * /api/members:
 *   get:
 *     summary: Récupérer tous les membres
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des membres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 */
router.get('/', getAllMembers);

/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Créer un nouveau membre
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       201:
 *         description: Membre créé
 *       400:
 *         description: Données invalides
 */
router.post('/', validate(memberSchema), createMember);

/**
 * @swagger
 * /api/members/{id}:
 *   put:
 *     summary: Mettre à jour un membre
 *     tags: [Members]
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
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       200:
 *         description: Membre mis à jour
 *       404:
 *         description: Membre introuvable
 */
router.put('/:id', validate(idSchema), validate(memberSchema), updateMember);

/**
 * @swagger
 * /api/members/{id}:
 *   delete:
 *     summary: Supprimer un membre
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Membre supprimé
 *       404:
 *         description: Membre introuvable
 */
router.delete('/:id', validate(idSchema), deleteMember);

export default router;

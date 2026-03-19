"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_1 = require("../controllers/ticketController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
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
const ticketSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.string().min(2, 'Le type est requis'),
        price: zod_1.z.number().positive('Le prix doit être positif'),
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
 * /api/tickets:
 *   get:
 *     summary: Récupérer tous les tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', ticketController_1.getAllTickets);
/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Créer un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', (0, validate_1.validate)(ticketSchema), ticketController_1.createTicket);
/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Supprimer un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', (0, validate_1.validate)(idSchema), ticketController_1.deleteTicket);
exports.default = router;

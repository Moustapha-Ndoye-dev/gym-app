"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion de la boutique
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         category:
 *           type: string
 */
const productSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Le nom est requis"),
        price: zod_1.z.number().positive("Le prix doit être positif"),
        stock: zod_1.z.number().int().min(0).optional(),
        category: zod_1.z.string().optional()
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
 * /api/products:
 *   get:
 *     summary: Récupérer les produits
 *     tags: [Products]
 */
router.get('/', productController_1.getAllProducts);
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Détails d'un produit
 *     tags: [Products]
 */
router.get('/:id', (0, validate_1.validate)(idSchema), productController_1.getProductById);
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Créer un produit (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', (0, auth_1.requireRole)(['admin']), (0, validate_1.validate)(productSchema), productController_1.createProduct);
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Modifier un produit (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', (0, auth_1.requireRole)(['admin']), (0, validate_1.validate)(idSchema), (0, validate_1.validate)(productSchema), productController_1.updateProduct);
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprimer un produit (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', (0, auth_1.requireRole)(['admin']), (0, validate_1.validate)(idSchema), productController_1.deleteProduct);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const productModel_1 = require("../models/productModel");
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel_1.ProductModel.getAll(req.user.gymId);
        res.json(products);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Erreur lors de la récupération des produits' });
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    try {
        const product = await productModel_1.ProductModel.getById(parseInt(req.params.id), req.user.gymId);
        if (!product)
            return res.status(404).json({ message: 'Produit introuvable' });
        res.json(product);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Erreur lors de la récupération du produit' });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const id = await productModel_1.ProductModel.create({
            ...req.body,
            gymId: req.user.gymId,
        });
        res.status(201).json({ id, message: 'Produit créé avec succès' });
    }
    catch (error) {
        console.error('CreateProduct error:', error);
        res.status(500).json({
            message: 'Erreur lors de la création du produit',
            error: error?.message || String(error),
            details: error,
        });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const changes = await productModel_1.ProductModel.update(id, req.user.gymId, req.body);
        if (changes === 0)
            return res.status(404).json({ message: 'Produit introuvable' });
        res.json({ message: 'Produit mis à jour avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const changes = await productModel_1.ProductModel.delete(id, req.user.gymId);
        if (changes === 0)
            return res.status(404).json({ message: 'Produit introuvable' });
        res.json({ message: 'Produit supprimé avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};
exports.deleteProduct = deleteProduct;

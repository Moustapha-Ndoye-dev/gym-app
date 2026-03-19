import { ProductModel } from '../models/productModel';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

export const getAllProducts = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const products = await ProductModel.getAll(req.user.gymId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const product = await ProductModel.getById(parseInt(req.params.id as string), req.user.gymId);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du produit' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = await ProductModel.create({ ...req.body, gymId: req.user.gymId });
    res.status(201).json({ id, message: 'Produit créé avec succès' });
  } catch (error: any) {
    console.error('CreateProduct error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du produit', 
      error: error?.message || String(error),
      details: error
    });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id as string);
    const changes = await ProductModel.update(id, req.user.gymId, req.body);
    if (changes === 0) return res.status(404).json({ message: 'Produit introuvable' });
    res.json({ message: 'Produit mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id as string);
    const changes = await ProductModel.delete(id, req.user.gymId);
    if (changes === 0) return res.status(404).json({ message: 'Produit introuvable' });
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

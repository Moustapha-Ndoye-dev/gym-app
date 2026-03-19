import prisma from '../config/db';

export interface Product {
  id?: number;
  gymId?: number;
  name: string;
  price: number;
  stock?: number;
  category?: string;
}

export class ProductModel {
  static async getAll(gymId: number) {
    return prisma.product.findMany({ where: { gymId } });
  }

  static async getById(id: number, gymId: number) {
    return prisma.product.findUnique({ where: { id, gymId } });
  }

  static async create(data: Product & { gymId?: number }) {
    const product = await prisma.product.create({
      data: {
        gymId: data.gymId || 1,
        name: data.name,
        price: data.price,
        stock: data.stock || 0,
        category: data.category || null,
      },
    });
    return product.id;
  }

  static async update(id: number, gymId: number, data: Product) {
    try {
      await prisma.product.update({
        where: { id, gymId },
        data: {
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category,
        },
      });
      return 1;
    } catch {
      return 0;
    }
  }

  static async delete(id: number, gymId: number) {
    try {
      await prisma.product.delete({ where: { id, gymId } });
      return 1;
    } catch {
      return 0;
    }
  }
}

import prisma from '../config/db';

export interface GymData {
  name: string;
  email: string;
  address?: string;
  phone?: string;
}

export class GymModel {
  static async create(data: GymData) {
    return prisma.gym.create({
      data: {
        name: data.name,
        email: data.email,
        address: data.address || null,
        phone: data.phone || null,
      },
    });
  }

  static async getById(id: number) {
    return prisma.gym.findUnique({ where: { id } });
  }

  static async getAll() {
    return prisma.gym.findMany();
  }
}

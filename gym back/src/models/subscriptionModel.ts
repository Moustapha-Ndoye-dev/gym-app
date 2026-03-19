import prisma from '../config/db';

export interface Subscription {
  id?: number;
  gymId?: number;
  name: string;
  price: number;
  durationMonths: number;
  features?: string;
}

export class SubscriptionModel {
  static async getAll(gymId: number) {
    return prisma.subscription.findMany({ where: { gymId } });
  }

  static async getById(id: number, gymId: number) {
    return prisma.subscription.findUnique({ where: { id, gymId } });
  }

  static async create(data: Subscription & { gymId?: number }) {
    const subscription = await prisma.subscription.create({
      data: {
        gymId: data.gymId || 1,
        name: data.name,
        price: data.price,
        durationMonths: data.durationMonths,
        features: data.features || null,
      }
    });
    return subscription.id;
  }

  static async update(id: number, gymId: number, data: Subscription) {
    try {
      await prisma.subscription.update({
        where: { id, gymId },
        data: {
          name: data.name,
          price: data.price,
          durationMonths: data.durationMonths,
          features: data.features || null,
        }
      });
      return 1;
    } catch {
      return 0;
    }
  }

  static async delete(id: number, gymId: number) {
    try {
      await prisma.subscription.delete({ where: { id, gymId } });
      return 1;
    } catch {
      return 0;
    }
  }
}

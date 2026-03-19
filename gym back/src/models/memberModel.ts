import prisma from '../config/db';

export interface Member {
  id?: number;
  gymId?: number;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  registration_date?: string;
  expiry_date?: string;
  subscription_id?: number;
  photo?: string;
}

export class MemberModel {
  static async getAll(gymId: number) {
    return prisma.member.findMany({
      where: { gymId },
      orderBy: { registrationDate: 'desc' },
      include: { gym: true, subscription: true }
    });
  }

  static async getById(id: number, gymId: number) {
    return prisma.member.findUnique({ 
      where: { id, gymId }, 
      include: { gym: true, subscription: true } 
    });
  }

  static async create(data: Member & { gymId?: number; subscriptionId?: number }) {
    return prisma.$transaction(async (tx) => {
      let expiryDate = null;
      let amount = 0;
      const gymId = data.gymId || data.subscription_id || 1; // Fallback to 1 if not provided

      if (data.subscriptionId || data.subscription_id) {
        const subId = data.subscriptionId || data.subscription_id;
        const subscription = await tx.subscription.findUnique({
          where: { id: subId }
        });
        if (subscription) {
          const date = new Date();
          date.setMonth(date.getMonth() + subscription.durationMonths);
          expiryDate = date;
          amount = subscription.price;
        }
      }

      const member = await tx.member.create({
        data: {
          gymId: gymId,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone || null,
          email: data.email || null,
          photo: data.photo || null,
          subscriptionId: data.subscriptionId || data.subscription_id || null,
          expiryDate: expiryDate
        }
      });

      if (amount > 0) {
        await tx.transaction.create({
          data: {
            gymId: gymId,
            amount: amount,
            type: 'income',
            description: `Adhesion membre: ${data.first_name} ${data.last_name}`,
            date: new Date()
          }
        });
      }

      return member.id;
    });
  }

  static async update(id: number, gymId: number, data: Member) {
    try {
      await prisma.member.update({
        where: { id, gymId },
        data: {
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone || null,
          email: data.email || null,
          photo: data.photo || null,
        }
      });
      return 1;
    } catch {
      return 0;
    }
  }

  static async delete(id: number, gymId: number) {
    try {
      await prisma.member.delete({ where: { id, gymId } });
      return 1;
    } catch {
      return 0;
    }
  }
}

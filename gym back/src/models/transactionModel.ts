import prisma from '../config/db';

export interface Transaction {
  id?: number;
  gymId?: number;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  user_id?: number;
}

export class TransactionModel {
  static async getAll(gymId: number) {
    return prisma.transaction.findMany({
      where: { gymId },
      orderBy: { date: 'desc' },
      include: { user: true, gym: true }
    });
  }

  static async create(data: Transaction & { gymId?: number }) {
    const transaction = await prisma.transaction.create({
      data: {
        gymId: data.gymId || 1,
        amount: data.amount,
        type: data.type,
        description: data.description || null,
        userId: data.user_id || null
      }
    });
    return transaction.id;
  }

  static async delete(id: number, gymId: number) {
    try {
      await prisma.transaction.delete({ where: { id, gymId } });
      return 1;
    } catch {
      return 0;
    }
  }
}

import prisma from '../config/db';

export interface Ticket {
  id?: number;
  gymId?: number;
  type: string;
  price: number;
  status?: string;
}

export class TicketModel {
  static async getAll(gymId: number) {
    return prisma.ticket.findMany({
      where: { gymId },
      orderBy: { createdAt: 'desc' },
      include: { gym: true },
    });
  }

  static async getById(id: number, gymId: number) {
    return prisma.ticket.findUnique({ where: { id, gymId } });
  }

  static async create(data: Ticket & { gymId?: number }) {
    const ticket = await prisma.ticket.create({
      data: {
        gymId: data.gymId || 1,
        type: data.type,
        price: data.price,
        status: data.status || 'valid',
      },
    });
    return ticket.id;
  }

  static async updateStatus(id: number, gymId: number, status: string) {
    try {
      await prisma.ticket.update({
        where: { id, gymId },
        data: { status },
      });
      return 1;
    } catch {
      return 0;
    }
  }

  static async delete(id: number, gymId: number) {
    try {
      await prisma.ticket.delete({ where: { id, gymId } });
      return 1;
    } catch {
      return 0;
    }
  }
}

import prisma from '../config/db';

export class AccessModel {
  static async getLogs(gymId: number, limit: number = 50) {
    return prisma.accessLog.findMany({
      where: {
        OR: [{ member: { gymId } }, { ticket: { gymId } }],
      },
      take: limit,
      orderBy: { accessTime: 'desc' },
      include: {
        member: true,
        ticket: true,
      },
    });
  }

  static async logAccess(
    member_id: number | null,
    ticket_id: number | null,
    status: string
  ) {
    const log = await prisma.accessLog.create({
      data: {
        memberId: member_id,
        ticketId: ticket_id,
        status: status,
      },
    });
    return log.id;
  }
}

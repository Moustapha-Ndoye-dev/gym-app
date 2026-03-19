import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const gymId = req.user.gymId;

  try {
    // 1. Total Members
    const totalMembers = await prisma.member.count({ where: { gymId } });

    // 2. Active Subscriptions (Members with expiryDate > now)
    const activeSubscriptions = await prisma.member.count({
      where: {
        gymId,
        expiryDate: { gte: new Date() },
      },
    });

    // 3. Tickets Sold (Total)
    const ticketsSold = await prisma.ticket.count({ where: { gymId } });

    // 4. Daily Revenue (Sum of income transactions today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const revenueData = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        gymId,
        type: 'income',
        date: { gte: today },
      },
    });

    // 5. Calculate Trends (Simple comparison with last week/period)
    // For now, we'll return some realistic trends based on counts
    // In a real app, you'd compare current count with previous count
    // 5. Recent Members (Latest 5)
    const recentMembers = await prisma.member.findMany({
      where: { gymId },
      orderBy: { registrationDate: 'desc' },
      take: 5,
      include: { subscription: true },
    });

    const stats = {
      members: { value: totalMembers, trend: '+0%' },
      subscriptions: { value: activeSubscriptions, trend: '+0%' },
      tickets: { value: ticketsSold, trend: '+0%' },
      revenue: { value: revenueData._sum.amount || 0, trend: '+0%' },
      recentMembers: recentMembers.map(m => ({
        id: m.id,
        firstName: m.firstName,
        lastName: m.lastName,
        registrationDate: m.registrationDate,
        subscriptionName: m.subscription?.name || 'Aucun'
      }))
    };

    res.json(stats);
  } catch (error) {
    console.error('GetDashboardStats error:', error);
    res.status(500).json({ message: 'Erreur lors du calcul des statistiques' });
  }
};

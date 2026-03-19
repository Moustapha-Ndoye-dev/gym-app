"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const db_1 = __importDefault(require("../config/db"));
const getDashboardStats = async (req, res) => {
    const gymId = req.user.gymId;
    try {
        // 1. Total Members
        const totalMembers = await db_1.default.member.count({ where: { gymId } });
        // 2. Active Subscriptions (Members with expiryDate > now)
        const activeSubscriptions = await db_1.default.member.count({
            where: {
                gymId,
                expiryDate: { gte: new Date() },
            },
        });
        // 3. Tickets Sold (Total)
        const ticketsSold = await db_1.default.ticket.count({ where: { gymId } });
        // 4. Daily Revenue (Sum of income transactions today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const revenueData = await db_1.default.transaction.aggregate({
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
        const stats = {
            members: { value: totalMembers, trend: '+0%' },
            subscriptions: { value: activeSubscriptions, trend: '+0%' },
            tickets: { value: ticketsSold, trend: '+0%' },
            revenue: { value: revenueData._sum.amount || 0, trend: '+0%' },
        };
        res.json(stats);
    }
    catch (error) {
        console.error('GetDashboardStats error:', error);
        res.status(500).json({ message: 'Erreur lors du calcul des statistiques' });
    }
};
exports.getDashboardStats = getDashboardStats;

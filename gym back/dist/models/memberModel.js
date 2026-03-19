"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberModel = void 0;
const db_1 = __importDefault(require("../config/db"));
class MemberModel {
    static async getAll(gymId) {
        return db_1.default.member.findMany({
            where: { gymId },
            orderBy: { registrationDate: 'desc' },
            include: { subscription: true },
        });
    }
    static async getById(id, gymId) {
        return db_1.default.member.findUnique({
            where: { id, gymId },
            include: { subscription: true },
        });
    }
    static async create(data) {
        console.log('[MEMBER-MODEL-TRACE] Entering create method with data:', JSON.stringify(data, null, 2));
        try {
            return await db_1.default.$transaction(async (tx) => {
                console.log('[MEMBER-MODEL-TRACE] Starting transaction.');
                let expiryDate = null;
                let amount = 0;
                if (data.subscriptionId) {
                    console.log('[MEMBER-MODEL-TRACE] Subscription ID found:', data.subscriptionId);
                    const subscription = await tx.subscription.findUnique({
                        where: { id: data.subscriptionId },
                    });
                    if (subscription) {
                        const date = new Date();
                        date.setMonth(date.getMonth() + subscription.durationMonths);
                        expiryDate = date;
                        amount = subscription.price;
                        console.log('[MEMBER-MODEL-TRACE] Subscription details processed:', { expiryDate, amount });
                    }
                }
                const memberData = {
                    gymId: data.gymId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    email: data.email,
                    photo: data.photo,
                    subscriptionId: data.subscriptionId,
                    expiryDate: expiryDate,
                };
                console.log('[MEMBER-MODEL-TRACE] Calling tx.member.create with:', JSON.stringify(memberData, null, 2));
                const member = await tx.member.create({ data: memberData });
                console.log('[MEMBER-MODEL-TRACE] tx.member.create returned:', JSON.stringify(member, null, 2));
                if (amount > 0) {
                    console.log('[MEMBER-MODEL-TRACE] Creating transaction for amount:', amount);
                    await tx.transaction.create({
                        data: {
                            gymId: data.gymId,
                            amount: amount,
                            type: 'income',
                            description: `Adhesion membre: ${data.firstName} ${data.lastName}`,
                            date: new Date(),
                        },
                    });
                    console.log('[MEMBER-MODEL-TRACE] Transaction created.');
                }
                console.log('[MEMBER-MODEL-TRACE] Transaction finished, returning member.id:', member.id);
                return member.id;
            });
        }
        catch (error) {
            console.error('[MEMBER-MODEL-TRACE] !!! TRANSACTION FAILED !!! Details:', error);
            throw error; // Re-throw the error to be caught by the route handler
        }
    }
    static async update(id, gymId, data) {
        try {
            await db_1.default.member.update({
                where: { id, gymId },
                data,
            });
            return 1;
        }
        catch {
            return 0;
        }
    }
    static async delete(id, gymId) {
        try {
            await db_1.default.member.delete({ where: { id, gymId } });
            return 1;
        }
        catch {
            return 0;
        }
    }
}
exports.MemberModel = MemberModel;

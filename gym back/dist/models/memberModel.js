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
            include: { gym: true, subscription: true }
        });
    }
    static async getById(id, gymId) {
        return db_1.default.member.findUnique({
            where: { id, gymId },
            include: { gym: true, subscription: true }
        });
    }
    static async create(data) {
        return db_1.default.$transaction(async (tx) => {
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
    static async update(id, gymId, data) {
        try {
            await db_1.default.member.update({
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

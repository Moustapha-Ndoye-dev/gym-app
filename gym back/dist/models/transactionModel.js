"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const db_1 = __importDefault(require("../config/db"));
class TransactionModel {
    static async getAll(gymId) {
        return db_1.default.transaction.findMany({
            where: { gymId },
            orderBy: { date: 'desc' },
            include: { user: true, gym: true }
        });
    }
    static async create(data) {
        const transaction = await db_1.default.transaction.create({
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
    static async delete(id, gymId) {
        try {
            await db_1.default.transaction.delete({ where: { id, gymId } });
            return 1;
        }
        catch {
            return 0;
        }
    }
}
exports.TransactionModel = TransactionModel;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModel = void 0;
const db_1 = __importDefault(require("../config/db"));
class SubscriptionModel {
    static async getAll(gymId) {
        return db_1.default.subscription.findMany({ where: { gymId } });
    }
    static async getById(id, gymId) {
        return db_1.default.subscription.findUnique({ where: { id, gymId } });
    }
    static async create(data) {
        const subscription = await db_1.default.subscription.create({
            data: {
                gymId: data.gymId || 1,
                name: data.name,
                price: data.price,
                durationMonths: data.durationMonths,
                features: data.features || null,
            },
        });
        return subscription.id;
    }
    static async update(id, gymId, data) {
        try {
            await db_1.default.subscription.update({
                where: { id, gymId },
                data: {
                    name: data.name,
                    price: data.price,
                    durationMonths: data.durationMonths,
                    features: data.features || null,
                },
            });
            return 1;
        }
        catch {
            return 0;
        }
    }
    static async delete(id, gymId) {
        try {
            await db_1.default.subscription.delete({ where: { id, gymId } });
            return 1;
        }
        catch {
            return 0;
        }
    }
}
exports.SubscriptionModel = SubscriptionModel;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketModel = void 0;
const db_1 = __importDefault(require("../config/db"));
class TicketModel {
    static async getAll(gymId) {
        return db_1.default.ticket.findMany({
            where: { gymId },
            orderBy: { createdAt: 'desc' },
            include: { gym: true }
        });
    }
    static async getById(id, gymId) {
        return db_1.default.ticket.findUnique({ where: { id, gymId } });
    }
    static async create(data) {
        const ticket = await db_1.default.ticket.create({
            data: {
                gymId: data.gymId || 1,
                type: data.type,
                price: data.price,
                status: data.status || 'valid'
            }
        });
        return ticket.id;
    }
    static async updateStatus(id, gymId, status) {
        try {
            await db_1.default.ticket.update({
                where: { id, gymId },
                data: { status }
            });
            return 1;
        }
        catch {
            return 0;
        }
    }
    static async delete(id, gymId) {
        try {
            await db_1.default.ticket.delete({ where: { id, gymId } });
            return 1;
        }
        catch {
            return 0;
        }
    }
}
exports.TicketModel = TicketModel;

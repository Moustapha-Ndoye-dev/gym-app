"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessModel = void 0;
const db_1 = __importDefault(require("../config/db"));
class AccessModel {
    static async getLogs(gymId, limit = 50) {
        return db_1.default.accessLog.findMany({
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
    static async logAccess(member_id, ticket_id, status) {
        const log = await db_1.default.accessLog.create({
            data: {
                memberId: member_id,
                ticketId: ticket_id,
                status: status,
            },
        });
        return log.id;
    }
}
exports.AccessModel = AccessModel;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityModel = void 0;
const db_1 = __importDefault(require("../config/db"));
class ActivityModel {
    static async getAll(gymId) {
        return db_1.default.activity.findMany({ where: { gymId } });
    }
    static async getById(id, gymId) {
        return db_1.default.activity.findUnique({ where: { id, gymId } });
    }
    static async create(data) {
        const activity = await db_1.default.activity.create({
            data: {
                gymId: data.gymId || 1,
                name: data.name,
                description: data.description || null,
                instructor: data.instructor || null,
                schedule: data.schedule || null,
                capacity: data.capacity || 20,
            },
        });
        return activity.id;
    }
    static async update(id, gymId, data) {
        try {
            await db_1.default.activity.update({
                where: { id, gymId },
                data: {
                    name: data.name,
                    description: data.description || null,
                    instructor: data.instructor || null,
                    schedule: data.schedule || null,
                    capacity: data.capacity || 20,
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
            await db_1.default.activity.delete({ where: { id, gymId } });
            return 1;
        }
        catch {
            return 0;
        }
    }
}
exports.ActivityModel = ActivityModel;

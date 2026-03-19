"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymModel = void 0;
const db_1 = __importDefault(require("../config/db"));
class GymModel {
    static async create(data) {
        return db_1.default.gym.create({
            data: {
                name: data.name,
                email: data.email,
                address: data.address || null,
                phone: data.phone || null,
            },
        });
    }
    static async getById(id) {
        return db_1.default.gym.findUnique({ where: { id } });
    }
    static async getAll() {
        return db_1.default.gym.findMany();
    }
}
exports.GymModel = GymModel;

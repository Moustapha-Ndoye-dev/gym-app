"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const db_1 = __importDefault(require("../config/db"));
class ProductModel {
    static async getAll(gymId) {
        return db_1.default.product.findMany({ where: { gymId } });
    }
    static async getById(id, gymId) {
        return db_1.default.product.findUnique({ where: { id, gymId } });
    }
    static async create(data) {
        const product = await db_1.default.product.create({
            data: {
                gymId: data.gymId || 1,
                name: data.name,
                price: data.price,
                stock: data.stock || 0,
                category: data.category || null,
            },
        });
        return product.id;
    }
    static async update(id, gymId, data) {
        try {
            await db_1.default.product.update({
                where: { id, gymId },
                data: {
                    name: data.name,
                    price: data.price,
                    stock: data.stock,
                    category: data.category,
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
            await db_1.default.product.delete({ where: { id, gymId } });
            return 1;
        }
        catch {
            return 0;
        }
    }
}
exports.ProductModel = ProductModel;

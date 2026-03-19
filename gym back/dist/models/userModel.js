"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserModel {
    static async findByUsername(username) {
        return db_1.default.user.findUnique({ where: { username } });
    }
    static async findByEmail(email) {
        return db_1.default.user.findUnique({ where: { email } });
    }
    static async findById(id) {
        return db_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                gymId: true,
            },
        });
    }
    static async createUser(username, password, role, gymId, email) {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const userData = {
            username,
            email,
            password: hashedPassword,
            role,
            gymId,
        };
        console.log('[USER-MODEL-TRACE] Calling prisma.user.create with:', JSON.stringify(userData, (key, value) => key === 'password' ? '***' : value, 2));
        try {
            const user = await db_1.default.user.create({
                data: userData,
            });
            console.log(`[USER-MODEL-TRACE] User created successfully:`, JSON.stringify(user, null, 2));
            return user;
        }
        catch (error) {
            console.error(`[USER-MODEL-TRACE] !!! prisma.user.create FAILED !!! Details:`, error);
            throw error;
        }
    }
    static async getAll() {
        return db_1.default.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                gymId: true,
            },
        });
    }
    static async update(id, username, role, password) {
        const dataToUpdate = { username, role };
        if (password) {
            dataToUpdate.password = await bcryptjs_1.default.hash(password, 10);
        }
        try {
            await db_1.default.user.update({
                where: { id },
                data: dataToUpdate,
            });
            return 1; // 1 change
        }
        catch {
            return 0; // 0 changes (not found)
        }
    }
    static async delete(id) {
        try {
            await db_1.default.user.delete({ where: { id } });
            return 1;
        }
        catch {
            return 0;
        }
    }
}
exports.UserModel = UserModel;

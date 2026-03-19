"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDb = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Charge le bon fichier .env même si le backend est lancé depuis un autre dossier.
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
// Fonction d'initialisation pour insérer l'admin par défaut
const initializeDb = async () => {
    console.log('[DB-INIT] Starting database initialization...');
    try {
        // 1. Ensure at least one Gym exists
        let defaultGym = await prisma.gym.findFirst();
        if (!defaultGym) {
            console.log('[DB-INIT] No gym found. Creating default "Super Gym"...');
            defaultGym = await prisma.gym.create({
                data: {
                    name: 'Super Gym',
                    email: 'contact@supergym.com',
                },
            });
            console.log(`[DB-INIT] Default gym created with ID: ${defaultGym.id}`);
        }
        else {
            console.log(`[DB-INIT] Found existing gym: "${defaultGym.name}" (ID: ${defaultGym.id})`);
        }
        // 2. Ensure Admin user exists
        const adminExists = await prisma.user.findUnique({
            where: { username: 'admin' },
        });
        if (!adminExists) {
            console.log('[DB-INIT] Admin user not found. Creating default admin...');
            const hashedPassword = bcryptjs_1.default.hashSync('admin', 10);
            await prisma.user.create({
                data: {
                    username: 'admin',
                    password: hashedPassword,
                    role: 'admin',
                    gymId: defaultGym.id,
                },
            });
            console.log('[DB-INIT] Default admin user created successfully.');
        }
        else {
            console.log('[DB-INIT] Admin user already exists.');
        }
        console.log('[DB-INIT] Database initialization completed.');
    }
    catch (error) {
        console.error('[DB-INIT] ! CRITICAL ERROR during initialization !', error);
    }
};
exports.initializeDb = initializeDb;
exports.default = prisma;

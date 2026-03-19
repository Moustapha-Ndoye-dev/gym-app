"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const memberRoutes_1 = __importDefault(require("./routes/memberRoutes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const accessRoutes_1 = __importDefault(require("./routes/accessRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
// Charge le fichier .env
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Swagger definition
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gym Management API',
            version: '1.0.0',
            description: 'API for managing gym members, subscriptions, and products',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Security Middlewares
app.use((0, helmet_1.default)()); // Sets generic security headers
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
    ], // Allow Vue & React dev servers
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.use(rateLimiter_1.apiLimiter); // Apply general rate limiting
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/members', memberRoutes_1.default);
app.use('/api/activities', activityRoutes_1.default);
app.use('/api/subscriptions', subscriptionRoutes_1.default);
app.use('/api/tickets', ticketRoutes_1.default);
app.use('/api/access', accessRoutes_1.default);
app.use('/api/transactions', transactionRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/stats', statsRoutes_1.default);
// Base route
app.get('/', (req, res) => {
    res.json({
        message: 'Gym Central API is running (TypeScript + Express + Prisma)',
    });
});
app.listen(PORT, async () => {
    await (0, db_1.initializeDb)();
    console.log(`Server is running on port ${PORT}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const memberRoutes_1 = __importDefault(require("../routes/memberRoutes"));
const db_1 = require("../config/db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/members', memberRoutes_1.default);
// Mock auth middleware for testing
jest.mock('../middleware/auth', () => ({
    auth: (req, res, next) => {
        req.user = { id: 1, role: 'admin' };
        next();
    },
    requireRole: (roles) => (req, res, next) => next()
}));
describe('Members API', () => {
    beforeAll(async () => {
        await (0, db_1.initializeDb)();
    });
    it('should get all members', async () => {
        const response = await (0, supertest_1.default)(app).get('/api/members');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it('should create a member', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/api/members')
            .send({
            first_name: 'Test',
            last_name: 'Member',
            email: `member${Date.now()}@example.com`,
            phone: '0987654321'
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });
});

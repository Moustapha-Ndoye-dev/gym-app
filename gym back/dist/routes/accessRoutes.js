"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accessController_1 = require("../controllers/accessController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const verifySchema = zod_1.z.object({
    body: zod_1.z.object({
        qr_code: zod_1.z.string().min(1, 'Le code QR est requis'),
    }),
});
router.use(auth_1.auth);
router.get('/logs', accessController_1.getLogs);
router.post('/verify', (0, validate_1.validate)(verifySchema), accessController_1.verifyAccess);
exports.default = router;

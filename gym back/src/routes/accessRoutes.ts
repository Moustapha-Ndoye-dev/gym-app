import { Router } from 'express';
import { getLogs, verifyAccess } from '../controllers/accessController';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const verifySchema = z.object({
  body: z.object({
    qr_code: z.string().min(1, 'Le code QR est requis'),
  }),
});

router.use(auth);

router.get('/logs', getLogs);
router.post('/verify', validate(verifySchema), verifyAccess);

export default router;

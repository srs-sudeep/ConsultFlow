import { Router } from 'express';
import * as momController from '../controllers/momController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/generate', requireAuth, momController.generateMOM);

export default router;


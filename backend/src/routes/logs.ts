import { Router } from 'express';
import * as logController from '../controllers/logController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', logController.getLogs);
router.get('/:id', logController.getLog);

export default router;


import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as testController from '../controllers/testController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/login', authController.login);
router.get('/callback', authController.callback);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getMe);
router.get('/test-token', requireAuth, testController.testToken);

export default router;


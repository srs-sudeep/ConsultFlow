import { Router } from 'express';
import * as workflowController from '../controllers/workflowController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(requireAuth);

router.post('/', workflowController.createWorkflow);
router.get('/', workflowController.getWorkflows);
router.get('/:id', workflowController.getWorkflow);
router.post('/run/:id', workflowController.runWorkflow);
router.delete('/:id', workflowController.deleteWorkflow);

export default router;


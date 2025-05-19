import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const healthRouter = Router();

/**
 * @route GET /api/health
 * @desc Health check endpoint
 * @access Public
 */
healthRouter.get('/', healthController.checkHealth);

export { healthRouter };

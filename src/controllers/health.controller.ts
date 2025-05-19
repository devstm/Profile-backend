import { Request, Response } from 'express';
import { healthService } from '../services/health.service';

/**
 * Health controller for handling health check requests
 */
const healthController = {
  /**
   * Check the health of the application
   * @param req Express request
   * @param res Express response
   */
  checkHealth: async (req: Request, res: Response): Promise<void> => {
    try {
      const health = await healthService.getHealth();
      res.status(200).json(health);
    } catch (error) {
      console.error('Health check failed:', error);
      res.status(500).json({ status: 'error', message: 'Health check failed' });
    }
  }
};

export { healthController };

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
authRouter.post('/login', authController.login);

/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh access token
 * @access Public
 */
authRouter.post('/refresh-token', authController.refreshToken);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
authRouter.post('/logout', authenticate, authController.logout);

/**
 * @route POST /api/auth/oauth
 * @desc Handle OAuth login from frontend
 * @access Public
 */
authRouter.post('/oauth', authController.oauthLogin);

export { authRouter };

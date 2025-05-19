import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../types/auth.types';
import { Provider } from '@prisma/client';

/**
 * Authentication controller for handling auth requests
 */
const authController = {
  /**
   * Register a new user
   * @param req Express request
   * @param res Express response
   */
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      // Validate request
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      // Register user
      const result = await authService.register({ email, password, name });

      res.status(201).json(result);
    } catch (error) {
      console.error('Registration error:', error);

      if (error instanceof Error && error.message === 'User already exists') {
        res.status(409).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Registration failed' });
    }
  },

  /**
   * Login user
   * @param req Express request
   * @param res Express response
   */
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Validate request
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      // Login user
      const result = await authService.login({ email, password });

      res.status(200).json(result);
    } catch (error) {
      console.error('Login error:', error);

      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Login failed' });
    }
  },

  /**
   * Refresh access token
   * @param req Express request
   * @param res Express response
   */
  refreshToken: async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      // Validate request
      if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' });
        return;
      }

      // Refresh token
      const result = await authService.refreshToken({ refreshToken });

      res.status(200).json(result);
    } catch (error) {
      console.error('Token refresh error:', error);

      if (error instanceof Error && error.message === 'Invalid refresh token') {
        res.status(401).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Token refresh failed' });
    }
  },

  /**
   * Logout user
   * @param req Express request
   * @param res Express response
   */
  logout: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Logout user
      await authService.logout(req.user.userId);

      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Logout failed' });
    }
  },

  /**
   * OAuth login/register
   * @param req Express request
   * @param res Express response
   */
  oauthLogin: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, name, provider, providerId, avatar } = req.body;

      // Validate request
      if (!email || !provider || !providerId) {
        res.status(400).json({
          message: 'Email, provider, and providerId are required'
        });
        return;
      }

      // Validate provider enum
      if (!Object.values(Provider).includes(provider)) {
        res.status(400).json({
          message: 'Invalid provider. Must be one of: ' + Object.values(Provider).join(', ')
        });
        return;
      }

      // Process OAuth login
      const result = await authService.oauthLogin({
        email,
        name,
        provider,
        providerId,
        avatar
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('OAuth login error:', error);

      if (error instanceof Error && error.message === 'Email already in use with different provider') {
        res.status(409).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'OAuth login failed' });
    }
  }
};

export { authController };

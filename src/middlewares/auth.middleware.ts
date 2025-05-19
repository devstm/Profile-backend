import { Response, NextFunction } from 'express';
import { Role } from '../generated/prisma';
import { verifyAccessToken } from '../utils/jwt.utils';
import { AuthRequest } from '../types/auth.types';

/**
 * Authentication middleware to verify JWT token
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized - No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      res.status(401).json({ message: 'Unauthorized - Invalid token' });
      return;
    }

    // Add user data to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Unauthorized - Authentication failed' });
  }
};

/**
 * Authorization middleware to check user role
 * @param roles Allowed roles
 * @returns Middleware function
 */
export const authorize = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized - Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
      return;
    }

    next();
  };
};

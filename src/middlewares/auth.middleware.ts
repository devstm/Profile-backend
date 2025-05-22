import { Response, NextFunction } from 'express';
import { Role } from '../generated/prisma';
import { AuthRequest } from '../types/auth.types';
import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to verify JWT token or handle NextAuth tokens
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
    // Extract token and user info from different sources
    const token = extractToken(req);

    // First try standard JWT verification
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || '4Oln0ORSMLh5ryKL17jeiB4bIwgXkikWv/ht8DR0x9c=');
        if (decoded) {
          req.user = {
            userId: decoded.sub || decoded.userId,
            email: decoded.email,
            role: decoded.role || 'USER'
          };
          console.log(`Authenticated user via JWT: ${req.user.email} (${req.user.userId})`);
          return next();
        }
      } catch (jwtError) {
        console.log('Standard JWT verification failed, trying NextAuth handler');
      }
    }

    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

/**
 * Extract authentication token from request
 * @param req Request object
 * @returns Token string if found
 */
function extractToken(req: AuthRequest): string | undefined {
  // 1. Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    console.log('Token found in Authorization header');
    return authHeader.split(' ')[1];
  }

  // 2. Check custom X-Auth-Session header
  const sessionHeader = req.headers['x-auth-session'];
  if (sessionHeader) {
    console.log('Token found in X-Auth-Session header');
    return Array.isArray(sessionHeader) ? sessionHeader[0] : sessionHeader;
  }

  // 3. Check cookies for NextAuth session token
  if (req.cookies) {
    const nextAuthSessionToken =
      req.cookies['next-auth.session-token'] ||
      req.cookies['__Secure-next-auth.session-token'] ||
      req.cookies['__Host-next-auth.session-token'];

    if (nextAuthSessionToken) {
      console.log('Token found in cookies');
      return nextAuthSessionToken;
    }
  }

  return undefined;
}


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

import jwt from 'jsonwebtoken';
import { User } from '../generated/prisma';

// JWT secret keys should be stored in environment variables
const ACCESS_TOKEN_SECRET = process.env.NEXTAUTH_SECRET || '4Oln0ORSMLh5ryKL17jeiB4bIwgXkikWv/ht8DR0x9c=';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '7d'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

/**
 * Generate JWT access token
 * @param user User object
 * @returns JWT access token
 */
export const generateAccessToken = (user: User): string => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate JWT refresh token
 * @param user User object
 * @returns JWT refresh token
 */
export const generateRefreshToken = (user: User): string => {
  return jwt.sign(
    { userId: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Verify JWT access token
 * @param token JWT access token
 * @returns Decoded token payload or null if invalid
 */
export const verifyAccessToken = (token: string): any => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verify JWT refresh token
 * @param token JWT refresh token
 * @returns Decoded token payload or null if invalid
 */
export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verify any JWT token (unified verification)
 * Tries to verify with access token secret first, then refresh token secret
 * 
 * @param token JWT token
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): any => {
  try {
    // Try to decode without verification first to check if it's a NextAuth token
    const decoded: any = jwt.decode(token);
    
    // If it has a 'sub' property, it's likely a NextAuth token
    if (decoded && decoded.sub) {
      console.log('Detected NextAuth token format');
      // For NextAuth tokens we use the same secret as configured in NextAuth
      return jwt.verify(token, ACCESS_TOKEN_SECRET);
    }
    
    // Try verifying with access token secret first
    try {
      console.log('token from: ', token);
      return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (accessError) {
      console.log('accessError: ', accessError);
      // If access token verification fails, try refresh token secret
      try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
      } catch (refreshError) {
        console.log('Token verification failed with both secrets');
        return null;
      }
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

// JWT secret keys should be stored in environment variables
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
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

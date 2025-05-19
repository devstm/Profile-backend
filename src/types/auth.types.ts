import { Request } from 'express';
import { User, Role, Provider } from '../generated/prisma';

/**
 * Authentication request with user data
 */
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
}

/**
 * Login request body
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request body
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

/**
 * OAuth user data from frontend
 */
export interface OAuthUserRequest {
  email: string;
  name?: string;
  provider: Provider;
  providerId: string;
  avatar?: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: Omit<User, 'password' | 'refreshToken'>;
  accessToken: string;
  refreshToken: string;
}

/**
 * Refresh token request body
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Token response
 */
export interface TokenResponse {
  accessToken: string;
}

import { PrismaClient, User, Provider } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  TokenResponse,
  OAuthUserRequest
} from '../types/auth.types';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/jwt.utils';

// Create a singleton instance of PrismaClient to be used throughout the application
// This makes it easier to mock in tests
let prismaInstance: PrismaClient | null = null;

export const getPrismaInstance = (): PrismaClient => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
};

// For testing purposes
export const setPrismaInstance = (instance: PrismaClient): void => {
  prismaInstance = instance;
};

const SALT_ROUNDS = 10;

/**
 * Authentication service for handling user authentication
 */
const authService = {
  /**
   * Register a new user
   * @param data User registration data
   * @returns Authentication response with tokens
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const prisma = getPrismaInstance();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name
      }
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    // Return user data and tokens
    const { password: _, refreshToken: __, ...userData } = user;
    return {
      user: userData,
      accessToken,
      refreshToken
    };
  },

  /**
   * Login user
   * @param data User login data
   * @returns Authentication response with tokens
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const prisma = getPrismaInstance();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    // Return user data and tokens
    const { password: _, refreshToken: __, ...userData } = user;
    return {
      user: userData,
      accessToken,
      refreshToken
    };
  },

  /**
   * Refresh access token
   * @param data Refresh token data
   * @returns New access token
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<TokenResponse> => {
    const prisma = getPrismaInstance();

    // Verify refresh token
    const decoded = verifyRefreshToken(data.refreshToken);
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    // Find user by ID and refresh token
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        refreshToken: data.refreshToken
      }
    });

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    return { accessToken };
  },

  /**
   * Logout user
   * @param userId User ID
   */
  logout: async (userId: string): Promise<void> => {
    const prisma = getPrismaInstance();

    // Clear refresh token in database
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });
  },

  /**
   * Authenticate user with OAuth provider
   * @param data OAuth user data from frontend
   * @returns Authentication response with tokens
   */
  oauthLogin: async (data: OAuthUserRequest): Promise<AuthResponse> => {
    const prisma = getPrismaInstance();

    // Check if user exists by provider and providerId
    let user = await prisma.user.findFirst({
      where: {
        provider: data.provider,
        providerId: data.providerId
      }
    });

    // If user doesn't exist by provider ID, try to find by email
    if (!user) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        // If user exists with email but different provider, update the user with provider info
        if (!existingUser.provider || !existingUser.providerId) {
          user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              provider: data.provider,
              providerId: data.providerId,
              avatar: data.avatar
            }
          });
        } else {
          // User exists with different provider - this is a conflict
          throw new Error('Email already in use with different provider');
        }
      } else {
        // Create new user with OAuth data
        user = await prisma.user.create({
          data: {
            email: data.email,
            name: data.name,
            provider: data.provider,
            providerId: data.providerId,
            avatar: data.avatar
          }
        });
      }
    } else {
      // Update existing user data if needed
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: data.name || user.name,
          avatar: data.avatar || user.avatar
        }
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    // Return user data and tokens
    const { password: _, refreshToken: __, ...userData } = user;
    return {
      user: userData,
      accessToken,
      refreshToken
    };
  }
};

export { authService };

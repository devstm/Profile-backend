import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app, server } from '../server';
import { setPrismaInstance } from '../services/auth.service';

// Create mock Prisma client
const mockPrismaClient = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  $connect: vi.fn(),
  $disconnect: vi.fn(),
};

// Mock PrismaClient
vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn(() => mockPrismaClient),
    Role: {
      USER: 'USER',
      ADMIN: 'ADMIN'
    },
    Provider: {
      LOCAL: 'LOCAL',
      GOOGLE: 'GOOGLE',
      FACEBOOK: 'FACEBOOK'
    }
  };
});

// Mock bcrypt
vi.mock('bcrypt', () => {
  return {
    default: {
      hash: vi.fn(() => 'hashed-password'),
      compare: vi.fn(() => true),
    },
    hash: vi.fn(() => 'hashed-password'),
    compare: vi.fn(() => true),
  };
});

// Mock JWT utils
vi.mock('../utils/jwt.utils', () => ({
  generateAccessToken: vi.fn(() => 'mock-access-token'),
  generateRefreshToken: vi.fn(() => 'mock-refresh-token'),
  verifyAccessToken: vi.fn(() => ({ userId: 'user-id', email: 'test@example.com', role: 'USER' })),
  verifyRefreshToken: vi.fn(() => ({ userId: 'user-id' })),
}));

describe('Auth Routes', () => {
  beforeAll(() => {
    // Set the mock Prisma instance for the auth service
    setPrismaInstance(mockPrismaClient);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock user not existing
      mockPrismaClient.user.findUnique.mockResolvedValueOnce(null);

      // Mock user creation
      mockPrismaClient.user.create.mockResolvedValueOnce({
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
        role: 'USER',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken', 'mock-access-token');
      expect(response.body).toHaveProperty('refreshToken', 'mock-refresh-token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 409 if user already exists', async () => {
      // Mock user already existing
      mockPrismaClient.user.findUnique.mockResolvedValueOnce({
        id: 'user-id',
        email: 'test@example.com',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      // Mock user existing
      mockPrismaClient.user.findUnique.mockResolvedValueOnce({
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
        role: 'USER',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken', 'mock-access-token');
      expect(response.body).toHaveProperty('refreshToken', 'mock-refresh-token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should return 401 if credentials are invalid', async () => {
      // Mock user not found
      mockPrismaClient.user.findUnique.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    it('should refresh token successfully', async () => {
      // Mock user found by refresh token
      mockPrismaClient.user.findFirst.mockResolvedValueOnce({
        id: 'user-id',
        email: 'test@example.com',
      });

      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({
          refreshToken: 'valid-refresh-token',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken', 'mock-access-token');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer valid-access-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logout successful');
    });
  });

  describe('POST /api/auth/oauth', () => {
    it('should login OAuth user successfully', async () => {
      // Mock user not existing by provider ID
      mockPrismaClient.user.findFirst.mockResolvedValueOnce(null);

      // Mock user not existing by email
      mockPrismaClient.user.findUnique.mockResolvedValueOnce(null);

      // Mock user creation
      mockPrismaClient.user.create.mockResolvedValueOnce({
        id: 'user-id',
        email: 'oauth-user@example.com',
        password: null,
        name: 'OAuth User',
        role: 'USER',
        provider: 'GOOGLE',
        providerId: 'google-user-id',
        avatar: 'https://example.com/avatar.jpg',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/auth/oauth')
        .send({
          email: 'oauth-user@example.com',
          name: 'OAuth User',
          provider: 'GOOGLE',
          providerId: 'google-user-id',
          avatar: 'https://example.com/avatar.jpg',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken', 'mock-access-token');
      expect(response.body).toHaveProperty('refreshToken', 'mock-refresh-token');
      expect(response.body.user).toHaveProperty('email', 'oauth-user@example.com');
      expect(response.body.user).toHaveProperty('provider', 'GOOGLE');
      expect(response.body.user).toHaveProperty('providerId', 'google-user-id');
    });

    it('should update existing user when OAuth user with same email exists', async () => {
      // Mock user not existing by provider ID
      mockPrismaClient.user.findFirst.mockResolvedValueOnce(null);

      // Mock user existing by email
      mockPrismaClient.user.findUnique.mockResolvedValueOnce({
        id: 'existing-user-id',
        email: 'existing@example.com',
        provider: null,
        providerId: null,
      });

      // Mock user update
      mockPrismaClient.user.update.mockResolvedValueOnce({
        id: 'existing-user-id',
        email: 'existing@example.com',
        password: null,
        name: 'Existing User',
        role: 'USER',
        provider: 'FACEBOOK',
        providerId: 'facebook-user-id',
        avatar: 'https://example.com/fb-avatar.jpg',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/auth/oauth')
        .send({
          email: 'existing@example.com',
          name: 'Existing User',
          provider: 'FACEBOOK',
          providerId: 'facebook-user-id',
          avatar: 'https://example.com/fb-avatar.jpg',
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('provider', 'FACEBOOK');
      expect(response.body.user).toHaveProperty('providerId', 'facebook-user-id');
    });

    it('should return 409 if email is already in use with different provider', async () => {
      // Mock user not existing by provider ID
      mockPrismaClient.user.findFirst.mockResolvedValueOnce(null);

      // Mock user existing by email with different provider
      mockPrismaClient.user.findUnique.mockResolvedValueOnce({
        id: 'existing-user-id',
        email: 'conflict@example.com',
        provider: 'GOOGLE',
        providerId: 'google-user-id',
      });

      const response = await request(app)
        .post('/api/auth/oauth')
        .send({
          email: 'conflict@example.com',
          provider: 'FACEBOOK',
          providerId: 'facebook-user-id',
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'Email already in use with different provider');
    });
  });
});

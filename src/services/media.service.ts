import { PrismaClient, Media } from '../generated/prisma';
import { MediaUploadRequest } from '../types/template.types';
import { getPrismaInstance } from './auth.service';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Base URL for media files
const MEDIA_BASE_URL = process.env.MEDIA_BASE_URL || 'http://localhost:3000/uploads';

// Upload directory
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Media service for handling media operations
 */
const mediaService = {
  /**
   * Upload media file
   * @param userId User ID
   * @param data Media upload data
   * @returns Uploaded media
   */
  uploadMedia: async (userId: string, data: MediaUploadRequest): Promise<Media> => {
    const prisma = getPrismaInstance();

    // Generate unique filename
    const fileExtension = path.extname(data.file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Save file to disk
    fs.writeFileSync(filePath, data.file.buffer);

    // Create media record in database
    return await prisma.media.create({
      data: {
        fileName,
        fileType: data.file.mimetype,
        fileSize: data.file.size,
        url: `${MEDIA_BASE_URL}/${fileName}`,
        userId,
        ...(data.templateId && { templateId: data.templateId })
      }
    });
  },

  /**
   * Get media by ID
   * @param mediaId Media ID
   * @returns Media or null if not found
   */
  getMediaById: async (mediaId: string): Promise<Media | null> => {
    const prisma = getPrismaInstance();

    return await prisma.media.findUnique({
      where: { id: mediaId }
    });
  },

  /**
   * Get media by user ID
   * @param userId User ID
   * @returns List of media
   */
  getMediaByUserId: async (userId: string): Promise<Media[]> => {
    const prisma = getPrismaInstance();

    return await prisma.media.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  },

  /**
   * Get media by template ID
   * @param templateId Template ID
   * @returns List of media
   */
  getMediaByTemplateId: async (templateId: string): Promise<Media[]> => {
    const prisma = getPrismaInstance();

    return await prisma.media.findMany({
      where: { templateId },
      orderBy: { createdAt: 'desc' }
    });
  },

  /**
   * Delete media
   * @param mediaId Media ID
   * @param userId User ID (for authorization)
   * @returns Deleted media
   */
  deleteMedia: async (mediaId: string, userId: string): Promise<Media> => {
    const prisma = getPrismaInstance();

    // Check if media exists and belongs to user
    const media = await prisma.media.findFirst({
      where: {
        id: mediaId,
        userId
      }
    });

    if (!media) {
      throw new Error('Media not found or unauthorized');
    }

    // Delete file from disk
    const filePath = path.join(UPLOAD_DIR, media.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete media record from database
    return await prisma.media.delete({
      where: { id: mediaId }
    });
  },

  /**
   * Associate media with template
   * @param mediaId Media ID
   * @param templateId Template ID
   * @param userId User ID (for authorization)
   * @returns Updated media
   */
  associateMediaWithTemplate: async (mediaId: string, templateId: string, userId: string): Promise<Media> => {
    const prisma = getPrismaInstance();

    // Check if media exists and belongs to user
    const media = await prisma.media.findFirst({
      where: {
        id: mediaId,
        userId
      }
    });

    if (!media) {
      throw new Error('Media not found or unauthorized');
    }

    // Check if template exists and belongs to user
    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        userId
      }
    });

    if (!template) {
      throw new Error('Template not found or unauthorized');
    }

    // Associate media with template
    return await prisma.media.update({
      where: { id: mediaId },
      data: { templateId }
    });
  }
};

export { mediaService };

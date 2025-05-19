import { Request, Response } from 'express';
import { mediaService } from '../services/media.service';
import { AuthRequest } from '../types/auth.types';

/**
 * Media controller for handling media requests
 */
const mediaController = {
  /**
   * Upload media
   * @param req Express request
   * @param res Express response
   */
  uploadMedia: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Check if file exists
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const { templateId } = req.body;

      // Upload media
      const media = await mediaService.uploadMedia(req.user.userId, {
        file: req.file,
        templateId
      });

      res.status(201).json(media);
    } catch (error) {
      console.error('Media upload error:', error);
      res.status(500).json({ message: 'Failed to upload media' });
    }
  },

  /**
   * Get media by ID
   * @param req Express request
   * @param res Express response
   */
  getMediaById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Get media
      const media = await mediaService.getMediaById(id);

      if (!media) {
        res.status(404).json({ message: 'Media not found' });
        return;
      }

      res.status(200).json(media);
    } catch (error) {
      console.error('Media retrieval error:', error);
      res.status(500).json({ message: 'Failed to retrieve media' });
    }
  },

  /**
   * Get media by user ID
   * @param req Express request
   * @param res Express response
   */
  getMediaByUserId: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Get media
      const media = await mediaService.getMediaByUserId(req.user.userId);

      res.status(200).json(media);
    } catch (error) {
      console.error('Media retrieval error:', error);
      res.status(500).json({ message: 'Failed to retrieve media' });
    }
  },

  /**
   * Get media by template ID
   * @param req Express request
   * @param res Express response
   */
  getMediaByTemplateId: async (req: Request, res: Response): Promise<void> => {
    try {
      const { templateId } = req.params;

      // Get media
      const media = await mediaService.getMediaByTemplateId(templateId);

      res.status(200).json(media);
    } catch (error) {
      console.error('Media retrieval error:', error);
      res.status(500).json({ message: 'Failed to retrieve media' });
    }
  },

  /**
   * Delete media
   * @param req Express request
   * @param res Express response
   */
  deleteMedia: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      // Delete media
      try {
        await mediaService.deleteMedia(id, req.user.userId);
        res.status(200).json({ message: 'Media deleted successfully' });
      } catch (error) {
        if (error instanceof Error && error.message === 'Media not found or unauthorized') {
          res.status(404).json({ message: error.message });
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Media deletion error:', error);
      res.status(500).json({ message: 'Failed to delete media' });
    }
  },

  /**
   * Associate media with template
   * @param req Express request
   * @param res Express response
   */
  associateMediaWithTemplate: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { mediaId } = req.params;
      const { templateId } = req.body;

      // Validate request
      if (!templateId) {
        res.status(400).json({ message: 'Template ID is required' });
        return;
      }

      // Associate media with template
      try {
        const media = await mediaService.associateMediaWithTemplate(mediaId, templateId, req.user.userId);
        res.status(200).json(media);
      } catch (error) {
        if (error instanceof Error && 
            (error.message === 'Media not found or unauthorized' || 
             error.message === 'Template not found or unauthorized')) {
          res.status(404).json({ message: error.message });
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Media association error:', error);
      res.status(500).json({ message: 'Failed to associate media with template' });
    }
  }
};

export { mediaController };

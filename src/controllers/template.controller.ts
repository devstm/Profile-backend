import { Request, Response } from 'express';
import { templateService } from '../services/template.service';
import { AuthRequest } from '../types/auth.types';
import { TemplateType } from '../generated/prisma';

/**
 * Template controller for handling template requests
 */
const templateController = {
  /**
   * Create a new template
   * @param req Express request
   * @param res Express response
   */
  createTemplate: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { name, description, templateType, isPublic, templateData } = req.body;

      // Validate request
      if (!name || !templateType) {
        res.status(400).json({ message: 'Name and template type are required' });
        return;
      }

      // Validate template type
      if (!Object.values(TemplateType).includes(templateType)) {
        res.status(400).json({
          message: 'Invalid template type. Must be one of: ' + Object.values(TemplateType).join(', ')
        });
        return;
      }

      // Create template
      const template = await templateService.createTemplate(req.user.userId, {
        name,
        description,
        templateType,
        isPublic,
        templateData
      });

      res.status(201).json(template);
    } catch (error) {
      console.error('Template creation error:', error);
      res.status(500).json({ message: 'Failed to create template' });
    }
  },

  /**
   * Get template by ID
   * @param req Express request
   * @param res Express response
   */
  getTemplateById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Get template
      const template = await templateService.getTemplateById(id);

      if (!template) {
        res.status(404).json({ message: 'Template not found' });
        return;
      }

      res.status(200).json(template);
    } catch (error) {
      console.error('Template retrieval error:', error);
      res.status(500).json({ message: 'Failed to retrieve template' });
    }
  },

  /**
   * Get templates by user ID
   * @param req Express request
   * @param res Express response
   */
  getTemplatesByUserId: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Get templates
      const templates = await templateService.getTemplatesByUserId(req.user.userId);

      res.status(200).json(templates);
    } catch (error) {
      console.error('Templates retrieval error:', error);
      res.status(500).json({ message: 'Failed to retrieve templates' });
    }
  },

  /**
   * Get public templates
   * @param req Express request
   * @param res Express response
   */
  getPublicTemplates: async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.query;
      let templateType: TemplateType | undefined;

      // Validate template type if provided
      if (type && typeof type === 'string') {
        if (!Object.values(TemplateType).includes(type as TemplateType)) {
          res.status(400).json({
            message: 'Invalid template type. Must be one of: ' + Object.values(TemplateType).join(', ')
          });
          return;
        }
        templateType = type as TemplateType;
      }

      // Get public templates
      const templates = await templateService.getPublicTemplates(templateType);

      res.status(200).json(templates);
    } catch (error) {
      console.error('Public templates retrieval error:', error);
      res.status(500).json({ message: 'Failed to retrieve public templates' });
    }
  },

  /**
   * Update template
   * @param req Express request
   * @param res Express response
   */
  updateTemplate: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const { name, description, templateType, isPublic, templateData } = req.body;

      // Validate template type if provided
      if (templateType && !Object.values(TemplateType).includes(templateType)) {
        res.status(400).json({
          message: 'Invalid template type. Must be one of: ' + Object.values(TemplateType).join(', ')
        });
        return;
      }

      // Update template
      try {
        const template = await templateService.updateTemplate(id, req.user.userId, {
          name,
          description,
          templateType,
          isPublic,
          templateData
        });

        res.status(200).json(template);
      } catch (error) {
        if (error instanceof Error && error.message === 'Template not found or unauthorized') {
          res.status(404).json({ message: error.message });
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Template update error:', error);
      res.status(500).json({ message: 'Failed to update template' });
    }
  },

  /**
   * Delete template
   * @param req Express request
   * @param res Express response
   */
  deleteTemplate: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      // Delete template
      try {
        await templateService.deleteTemplate(id, req.user.userId);
        res.status(200).json({ message: 'Template deleted successfully' });
      } catch (error) {
        if (error instanceof Error && error.message === 'Template not found or unauthorized') {
          res.status(404).json({ message: error.message });
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Template deletion error:', error);
      res.status(500).json({ message: 'Failed to delete template' });
    }
  },

  /**
   * Update template data
   * @param req Express request
   * @param res Express response
   */
  updateTemplateData: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const templateData = req.body;

      // Update template data
      try {
        const template = await templateService.updateTemplateData(id, req.user.userId, templateData);
        res.status(200).json(template);
      } catch (error) {
        if (error instanceof Error && error.message === 'Template not found or unauthorized') {
          res.status(404).json({ message: error.message });
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Template data update error:', error);
      res.status(500).json({ message: 'Failed to update template data' });
    }
  }
};

export { templateController };

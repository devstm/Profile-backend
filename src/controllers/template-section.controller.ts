import { Response } from 'express';
import { templateService } from '../services/template.service';
import { AuthRequest } from '../types/auth.types';
import { SectionType } from '../generated/prisma';

/**
 * Template section controller for handling template section requests
 */
const templateSectionController = {
  /**
   * Add section to template
   * @param req Express request
   * @param res Express response
   */
  addTemplateSection: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { templateId } = req.params;
      const { name, sectionType, sectionData, order } = req.body;

      // Validate request
      if (!name || !sectionType) {
        res.status(400).json({ message: 'Name and section type are required' });
        return;
      }

      // Validate section type
      if (!Object.values(SectionType).includes(sectionType)) {
        res.status(400).json({
          message: 'Invalid section type. Must be one of: ' + Object.values(SectionType).join(', ')
        });
        return;
      }

      // Add section
      try {
        const section = await templateService.addTemplateSection(templateId, req.user.userId, {
          name,
          sectionType,
          sectionData,
          order
        });

        res.status(201).json(section);
      } catch (error) {
        if (error instanceof Error && error.message === 'Template not found or unauthorized') {
          res.status(404).json({ message: error.message });
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Section creation error:', error);
      res.status(500).json({ message: 'Failed to create section' });
    }
  },

  /**
   * Update template section
   * @param req Express request
   * @param res Express response
   */
  updateTemplateSection: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { sectionId } = req.params;
      const { name, sectionType, sectionData, order } = req.body;

      // Validate section type if provided
      if (sectionType && !Object.values(SectionType).includes(sectionType)) {
        res.status(400).json({
          message: 'Invalid section type. Must be one of: ' + Object.values(SectionType).join(', ')
        });
        return;
      }

      // Update section
      try {
        const section = await templateService.updateTemplateSection(sectionId, req.user.userId, {
          name,
          sectionType,
          sectionData,
          order
        });

        res.status(200).json(section);
      } catch (error) {
        if (error instanceof Error && error.message === 'Section not found or unauthorized') {
          res.status(404).json({ message: error.message });
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Section update error:', error);
      res.status(500).json({ message: 'Failed to update section' });
    }
  },

  /**
   * Delete template section
   * @param req Express request
   * @param res Express response
   */
  deleteTemplateSection: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { sectionId } = req.params;

      // Delete section
      try {
        await templateService.deleteTemplateSection(sectionId, req.user.userId);
        res.status(200).json({ message: 'Section deleted successfully' });
      } catch (error) {
        if (error instanceof Error && error.message === 'Section not found or unauthorized') {
          res.status(404).json({ message: error.message });
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Section deletion error:', error);
      res.status(500).json({ message: 'Failed to delete section' });
    }
  }
};

export { templateSectionController };

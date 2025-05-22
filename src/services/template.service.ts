import { PrismaClient, Template, TemplateSection, Media, TemplateType, SectionType } from '../generated/prisma';
import {
  CreateTemplateRequest,
  UpdateTemplateRequest,
  TemplateSectionRequest,
  MediaUploadRequest,
  TemplateData
} from '../types/template.types';
import { getPrismaInstance } from './auth.service';

/**
 * Template service for handling template operations
 */
const templateService = {
  /**
   * Create a new template
   * @param userId User ID
   * @param data Template data
   * @returns Created template
   */
  createTemplate: async (userId: string, data: CreateTemplateRequest): Promise<Template> => {
    const prisma = getPrismaInstance();
    
    console.log('userId: ', userId);
    console.log('data: ', data);
    return await prisma.template.create({
      data: {
        name: data.name,
        description: data.description,
        templateType: data.templateType,
        isPublic: data.isPublic || false,
        templateData: data.templateData ? data.templateData : {},
        userId
      }
    });
  },

  /**
   * Get template by ID
   * @param templateId Template ID
   * @returns Template or null if not found
   */
  getTemplateById: async (templateId: string): Promise<Template | null> => {
    const prisma = getPrismaInstance();

    return await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        },
        media: true
      }
    });
  },

  /**
   * Get templates by user ID
   * @param userId User ID
   * @returns List of templates
   */
  getTemplatesByUserId: async (userId: string): Promise<Template[]> => {
    const prisma = getPrismaInstance();

    return await prisma.template.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        },
        media: true
      }
    });
  },

  /**
   * Get public templates
   * @param templateType Optional template type filter
   * @returns List of public templates
   */
  getPublicTemplates: async (templateType?: TemplateType): Promise<Template[]> => {
    const prisma = getPrismaInstance();

    return await prisma.template.findMany({
      where: {
        isPublic: true,
        ...(templateType && { templateType })
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        },
        media: true
      }
    });
  },

  /**
   * Update template
   * @param templateId Template ID
   * @param userId User ID (for authorization)
   * @param data Template update data
   * @returns Updated template
   */
  updateTemplate: async (templateId: string, userId: string, data: UpdateTemplateRequest): Promise<Template> => {
    const prisma = getPrismaInstance();

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

    // Update template
    return await prisma.template.update({
      where: { id: templateId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.templateType && { templateType: data.templateType }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
        ...(data.templateData && { templateData: data.templateData })
      },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        },
        media: true
      }
    });
  },

  /**
   * Delete template
   * @param templateId Template ID
   * @param userId User ID (for authorization)
   * @returns Deleted template
   */
  deleteTemplate: async (templateId: string, userId: string): Promise<Template> => {
    const prisma = getPrismaInstance();

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

    // Delete template
    return await prisma.template.delete({
      where: { id: templateId }
    });
  },

  /**
   * Add section to template
   * @param templateId Template ID
   * @param userId User ID (for authorization)
   * @param data Section data
   * @returns Created section
   */
  addTemplateSection: async (templateId: string, userId: string, data: TemplateSectionRequest): Promise<TemplateSection> => {
    const prisma = getPrismaInstance();

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

    // Create section
    return await prisma.templateSection.create({
      data: {
        name: data.name,
        sectionType: data.sectionType,
        sectionData: data.sectionData || {},
        order: data.order || 0,
        templateId
      }
    });
  },

  /**
   * Update template section
   * @param sectionId Section ID
   * @param userId User ID (for authorization)
   * @param data Section update data
   * @returns Updated section
   */
  updateTemplateSection: async (sectionId: string, userId: string, data: Partial<TemplateSectionRequest>): Promise<TemplateSection> => {
    const prisma = getPrismaInstance();

    // Check if section exists and belongs to user's template
    const section = await prisma.templateSection.findUnique({
      where: { id: sectionId },
      include: { template: true }
    });

    if (!section || section.template.userId !== userId) {
      throw new Error('Section not found or unauthorized');
    }

    // Update section
    return await prisma.templateSection.update({
      where: { id: sectionId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.sectionType && { sectionType: data.sectionType }),
        ...(data.sectionData && { sectionData: data.sectionData }),
        ...(data.order !== undefined && { order: data.order })
      }
    });
  },

  /**
   * Delete template section
   * @param sectionId Section ID
   * @param userId User ID (for authorization)
   * @returns Deleted section
   */
  deleteTemplateSection: async (sectionId: string, userId: string): Promise<TemplateSection> => {
    const prisma = getPrismaInstance();

    // Check if section exists and belongs to user's template
    const section = await prisma.templateSection.findUnique({
      where: { id: sectionId },
      include: { template: true }
    });

    if (!section || section.template.userId !== userId) {
      throw new Error('Section not found or unauthorized');
    }

    // Delete section
    return await prisma.templateSection.delete({
      where: { id: sectionId }
    });
  },

  /**
   * Update template data
   * @param templateId Template ID
   * @param userId User ID (for authorization)
   * @param templateData Template data
   * @returns Updated template
   */
  updateTemplateData: async (templateId: string, userId: string, templateData: TemplateData): Promise<Template> => {
    const prisma = getPrismaInstance();

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

    // Update template data
    return await prisma.template.update({
      where: { id: templateId },
      data: {
        templateData
      }
    });
  }
};

export { templateService };

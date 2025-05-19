import { Router } from 'express';
import { templateController } from '../controllers/template.controller';
import { templateSectionController } from '../controllers/template-section.controller';
import { authenticate } from '../middlewares/auth.middleware';

const templateRouter = Router();

/**
 * @route POST /api/templates
 * @desc Create a new template
 * @access Private
 */
templateRouter.post('/', authenticate, templateController.createTemplate);

/**
 * @route GET /api/templates/:id
 * @desc Get template by ID
 * @access Public
 */
templateRouter.get('/:id', templateController.getTemplateById);

/**
 * @route GET /api/templates
 * @desc Get templates by user ID
 * @access Private
 */
templateRouter.get('/', authenticate, templateController.getTemplatesByUserId);

/**
 * @route GET /api/templates/public
 * @desc Get public templates
 * @access Public
 */
templateRouter.get('/public', templateController.getPublicTemplates);

/**
 * @route PUT /api/templates/:id
 * @desc Update template
 * @access Private
 */
templateRouter.put('/:id', authenticate, templateController.updateTemplate);

/**
 * @route DELETE /api/templates/:id
 * @desc Delete template
 * @access Private
 */
templateRouter.delete('/:id', authenticate, templateController.deleteTemplate);

/**
 * @route PUT /api/templates/:id/data
 * @desc Update template data
 * @access Private
 */
templateRouter.put('/:id/data', authenticate, templateController.updateTemplateData);

/**
 * @route POST /api/templates/:templateId/sections
 * @desc Add section to template
 * @access Private
 */
templateRouter.post('/:templateId/sections', authenticate, templateSectionController.addTemplateSection);

/**
 * @route PUT /api/templates/sections/:sectionId
 * @desc Update template section
 * @access Private
 */
templateRouter.put('/sections/:sectionId', authenticate, templateSectionController.updateTemplateSection);

/**
 * @route DELETE /api/templates/sections/:sectionId
 * @desc Delete template section
 * @access Private
 */
templateRouter.delete('/sections/:sectionId', authenticate, templateSectionController.deleteTemplateSection);

export { templateRouter };

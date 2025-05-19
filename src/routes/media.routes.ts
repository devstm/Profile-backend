import { Router } from 'express';
import { mediaController } from '../controllers/media.controller';
import { authenticate } from '../middlewares/auth.middleware';
import multer from 'multer';

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

const mediaRouter = Router();

/**
 * @route POST /api/media
 * @desc Upload media
 * @access Private
 */
mediaRouter.post('/', authenticate, upload.single('file'), mediaController.uploadMedia);

/**
 * @route GET /api/media/:id
 * @desc Get media by ID
 * @access Public
 */
mediaRouter.get('/:id', mediaController.getMediaById);

/**
 * @route GET /api/media
 * @desc Get media by user ID
 * @access Private
 */
mediaRouter.get('/', authenticate, mediaController.getMediaByUserId);

/**
 * @route GET /api/media/template/:templateId
 * @desc Get media by template ID
 * @access Public
 */
mediaRouter.get('/template/:templateId', mediaController.getMediaByTemplateId);

/**
 * @route DELETE /api/media/:id
 * @desc Delete media
 * @access Private
 */
mediaRouter.delete('/:id', authenticate, mediaController.deleteMedia);

/**
 * @route PUT /api/media/:mediaId/template
 * @desc Associate media with template
 * @access Private
 */
mediaRouter.put('/:mediaId/template', authenticate, mediaController.associateMediaWithTemplate);

export { mediaRouter };

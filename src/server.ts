import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { healthRouter } from './routes/health.routes';
import { authRouter } from './routes/auth.routes';
import { templateRouter } from './routes/template.routes';
import { mediaRouter } from './routes/media.routes';

// Load environment variables
dotenv.config();

// Create Express server
const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '50mb' })); // Increased limit for large template data
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploads
const uploadsDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/templates', templateRouter);
app.use('/api/media', mediaRouter);

// Start server
const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export { app, server };

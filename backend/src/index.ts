/**
 * Sales Insight Automator API — Entry Point
 * Sets up Express app with all middleware, routes, and starts the server
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { rateLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';
import uploadRoutes from './routes/uploadRoutes';

const app = express();

// ─── Security Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(
    cors({
        origin: env.CORS_ORIGIN,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// ─── Request Logging ────────────────────────────────────────────────
app.use(
    morgan('combined', {
        stream: { write: (msg: string) => logger.info(msg.trim()) },
    })
);

// ─── Body Parsers ───────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Global Rate Limiter ────────────────────────────────────────────
app.use(rateLimiter);

// ─── Swagger Documentation ──────────────────────────────────────────
app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customSiteTitle: 'Sales Insight Automator API Docs',
        customCss: '.swagger-ui .topbar { background-color: #1a3c6e; }',
    })
);

// ─── Health Check ───────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'Sales Insight Automator API',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});

// ─── API Routes ─────────────────────────────────────────────────────
app.use('/api', uploadRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ─── Centralized Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────────
const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
    logger.info(`📊 Swagger docs available at http://localhost:${env.PORT}/docs`);
    logger.info(`🌍 Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received — shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

export default app;

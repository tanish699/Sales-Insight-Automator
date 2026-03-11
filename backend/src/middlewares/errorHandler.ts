/**
 * Centralized Error Handler Middleware
 * Catches all unhandled errors and returns standardized JSON responses
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
    statusCode?: number;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred';

    logger.error(`[${req.method}] ${req.path} — ${statusCode}: ${message}`);
    if (err.stack) {
        logger.error(err.stack);
    }

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

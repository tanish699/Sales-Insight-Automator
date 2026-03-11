/**
 * Rate Limiter Middleware
 * Limits each IP to 100 requests per 15 minutes window
 */

import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests from this IP. Please try again after 15 minutes.',
    },
});

/**
 * Stricter limiter for the upload endpoint to prevent abuse
 */
export const uploadRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many upload requests. Please try again after 15 minutes.',
    },
});

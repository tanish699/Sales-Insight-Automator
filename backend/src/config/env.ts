/**
 * Environment configuration module
 * Validates and exports all required environment variables
 */

import dotenv from 'dotenv';
dotenv.config();

const requiredVars = ['GEMINI_API_KEY', 'RESEND_API_KEY', 'EMAIL_FROM'] as const;

for (const varName of requiredVars) {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
}

export const env = {
    PORT: parseInt(process.env.PORT || '8000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
    RESEND_API_KEY: process.env.RESEND_API_KEY as string,
    EMAIL_FROM: process.env.EMAIL_FROM as string,
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};

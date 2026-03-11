/**
 * File Validation Middleware
 * Validates uploaded files before passing to the controller
 */

import { Request, Response, NextFunction } from 'express';
import path from 'path';

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateFile = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded. Please attach a CSV or XLSX file.' });
        return;
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        res.status(400).json({
            error: `Invalid file type: "${ext}". Only CSV and XLSX files are accepted.`,
        });
        return;
    }

    if (req.file.size > MAX_FILE_SIZE) {
        res.status(400).json({
            error: 'File too large. Maximum allowed size is 5MB.',
        });
        return;
    }

    // Validate recipient email field
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
        res.status(400).json({ error: 'Recipient email address is required.' });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        res.status(400).json({ error: 'Invalid email address format.' });
        return;
    }

    next();
};

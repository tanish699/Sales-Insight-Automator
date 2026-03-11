/**
 * Upload Routes
 * Defines the /api/upload endpoint with multer and validation middleware
 */

import { Router } from 'express';
import multer from 'multer';
import os from 'os';
import path from 'path';
import { uploadAndProcess } from '../controllers/uploadController';
import { validateFile } from '../middlewares/validateFile';
import { uploadRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Store file in OS temp directory; we'll clean it up after processing
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, os.tmpdir());
    },
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `upload-${unique}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB hard limit at multer level
});

/**
 * POST /api/upload
 * Accepts multipart/form-data with `file` and `email` fields
 */
router.post(
    '/upload',
    uploadRateLimiter,
    upload.single('file'),
    validateFile,
    uploadAndProcess
);

export default router;

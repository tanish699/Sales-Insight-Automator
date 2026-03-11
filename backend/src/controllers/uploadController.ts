/**
 * Upload Controller
 * Orchestrates the full pipeline: parse → AI summary → email
 */

import { Request, Response, NextFunction } from 'express';
import { parseFile, cleanupFile } from '../services/fileParserService';
import { generateSummary } from '../services/aiService';
import { sendSummaryEmail } from '../services/emailService';
import { logger } from '../utils/logger';

export const uploadAndProcess = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const startTime = Date.now();
    const file = req.file as Express.Multer.File;
    const email = (req.body.email as string).trim();

    logger.info(`Processing upload — file: ${file.originalname}, recipient: ${email}`);

    try {
        // Step 1: Parse the uploaded file
        logger.info('Step 1/3: Parsing file...');
        const salesData = await parseFile(file.path, file.originalname);

        if (salesData.length === 0) {
            res.status(400).json({ error: 'The uploaded file is empty or contains no parseable rows.' });
            return;
        }

        // Step 2: Generate AI executive summary
        logger.info('Step 2/3: Generating AI summary...');
        const summary = await generateSummary(salesData);

        // Step 3: Send email with the summary
        logger.info('Step 3/3: Sending email...');
        await sendSummaryEmail(email, summary);

        const elapsed = Date.now() - startTime;
        logger.info(`Pipeline completed in ${elapsed}ms for ${file.originalname}`);

        res.status(200).json({ message: 'Summary generated and sent successfully' });
    } catch (err) {
        next(err);
    } finally {
        // Always cleanup the temp file
        if (file?.path) {
            cleanupFile(file.path);
        }
    }
};

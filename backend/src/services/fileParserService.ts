/**
 * File parser service
 * Handles parsing of both CSV and XLSX files into structured SalesRecord arrays
 */

import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import * as XLSX from 'xlsx';
import { SalesRecord, SalesDataset } from '../types/sales';
import { logger } from '../utils/logger';

/**
 * Detect file type from extension
 */
const getFileExtension = (filename: string): string => {
    return path.extname(filename).toLowerCase().replace('.', '');
};

/**
 * Normalize a raw row object into a typed SalesRecord
 */
const normalizeRow = (row: Record<string, unknown>): SalesRecord => ({
    Date: String(row['Date'] || row['date'] || ''),
    Product_Category: String(row['Product_Category'] || row['product_category'] || ''),
    Region: String(row['Region'] || row['region'] || ''),
    Units_Sold: Number(row['Units_Sold'] || row['units_sold'] || 0),
    Unit_Price: Number(row['Unit_Price'] || row['unit_price'] || 0),
    Revenue: Number(row['Revenue'] || row['revenue'] || 0),
    Status: String(row['Status'] || row['status'] || ''),
});

/**
 * Parse CSV file using csv-parser streaming
 */
const parseCSV = (filePath: string): Promise<SalesDataset> => {
    return new Promise((resolve, reject) => {
        const records: SalesDataset = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row: Record<string, unknown>) => {
                records.push(normalizeRow(row));
            })
            .on('end', () => {
                logger.info(`CSV parsed successfully: ${records.length} records found`);
                resolve(records);
            })
            .on('error', (err: Error) => {
                logger.error('CSV parsing error:', err);
                reject(new Error(`CSV parsing failed: ${err.message}`));
            });
    });
};

/**
 * Parse XLSX file using xlsx library
 */
const parseXLSX = (filePath: string): Promise<SalesDataset> => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);
            const records = rawData.map(normalizeRow);

            logger.info(`XLSX parsed successfully: ${records.length} records found`);
            resolve(records);
        } catch (err) {
            logger.error('XLSX parsing error:', err);
            reject(new Error(`XLSX parsing failed: ${(err as Error).message}`));
        }
    });
};

/**
 * Main parser entry point — detects file type and delegates
 */
export const parseFile = async (
    filePath: string,
    originalName: string
): Promise<SalesDataset> => {
    const ext = getFileExtension(originalName);

    logger.info(`Parsing file: ${originalName} (type: ${ext})`);

    if (ext === 'csv') {
        return parseCSV(filePath);
    } else if (ext === 'xlsx' || ext === 'xls') {
        return parseXLSX(filePath);
    } else {
        throw new Error(`Unsupported file type: .${ext}`);
    }
};

/**
 * Cleanup uploaded temp file
 */
export const cleanupFile = (filePath: string): void => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`Cleaned up temp file: ${filePath}`);
    }
};

/**
 * AI Summary Service
 * Uses Google Gemini API to analyze sales data and generate executive summaries
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { SalesDataset } from '../types/sales';
import { logger } from '../utils/logger';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

/**
 * Build the analysis prompt from the sales dataset
 */
const buildPrompt = (data: SalesDataset): string => {
    const dataJson = JSON.stringify(data, null, 2);

    return `You are a senior business analyst with expertise in sales analytics and executive reporting.

Analyze the following sales dataset and generate a professional executive summary.

Your summary MUST include:
1. **Total Revenue** — Calculate and state the total revenue across all records
2. **Best Performing Region** — Identify which region generated the most revenue
3. **Top Selling Product Category** — Identify the best-performing product category
4. **Sales Trends Across Months** — Highlight notable trends over time
5. **Important Business Insights** — Surface 2-3 actionable insights from the data
6. **Strategic Recommendations** — Provide 2-3 concrete recommendations for leadership

Sales Dataset:
${dataJson}

Write the summary in a concise, professional tone suitable for executive leadership. 
Use clear headings and bullet points where appropriate. 
Keep the total length to 400-600 words.`;
};

/**
 * Generate an AI-powered executive summary from sales data
 */
export const generateSummary = async (data: SalesDataset): Promise<string> => {
    const startTime = Date.now();
    logger.info(`Sending ${data.length} records to Gemini for analysis`);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = buildPrompt(data);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text();

    const elapsed = Date.now() - startTime;
    logger.info(`AI summary generated in ${elapsed}ms`);

    return summary;
};

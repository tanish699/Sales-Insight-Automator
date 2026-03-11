/**
 * Email Service
 * Sends the AI-generated summary via Resend API
 */

import { Resend } from 'resend';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const resend = new Resend(env.RESEND_API_KEY);

/**
 * Build the HTML body of the email
 */
const buildEmailHtml = (summary: string): string => {
    // Convert markdown-like headings and bullets to HTML for better email rendering
    const formattedSummary = summary
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n## (.*?)\n/g, '<h2 style="color:#1a3c6e;margin-top:16px;">$1</h2>')
        .replace(/\n### (.*?)\n/g, '<h3 style="color:#2563eb;margin-top:12px;">$1</h3>')
        .replace(/\n- (.*)/g, '<li style="margin:4px 0;">$1</li>')
        .replace(/\n\n/g, '</p><p style="margin:10px 0;">');

    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Sales Data Executive Summary</title>
  </head>
  <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #f4f6fa; margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #1a3c6e 0%, #2563eb 100%); padding: 32px 40px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:700; letter-spacing:-0.5px;">
                  📊 Sales Insight Automator
                </h1>
                <p style="color:#bfdbfe; margin:8px 0 0; font-size:14px;">
                  AI-Powered Executive Summary Report
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <p style="color:#374151; font-size:16px; margin:0 0 20px;">Hello,</p>
                <p style="color:#374151; font-size:15px; line-height:1.6; margin:0 0 24px;">
                  An AI-generated analysis of your recent sales data is provided below. 
                  This summary was crafted using Google Gemini to surface the most critical insights for your leadership team.
                </p>
                <div style="background:#f8faff; border-left:4px solid #2563eb; border-radius:4px; padding:24px; color:#1f2937; font-size:14px; line-height:1.8;">
                  <p style="margin:0;">${formattedSummary}</p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; border-top:1px solid #e5e7eb; padding: 24px 40px; text-align:center;">
                <p style="color:#9ca3af; font-size:12px; margin:0;">
                  This summary was generated automatically by the <strong>Sales Insight Automator</strong>.
                </p>
                <p style="color:#9ca3af; font-size:11px; margin:8px 0 0;">
                  Powered by Rabbitt AI &nbsp;•&nbsp; Do not reply to this email
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

/**
 * Send the AI-generated summary to the recipient email
 */
export const sendSummaryEmail = async (
    recipientEmail: string,
    summary: string
): Promise<void> => {
    logger.info(`Sending summary email to: ${recipientEmail}`);

    const { error } = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: [recipientEmail],
        subject: '📊 Sales Data Executive Summary — Sales Insight Automator',
        html: buildEmailHtml(summary),
    });

    if (error) {
        logger.error('Resend API error:', error);
        throw new Error(`Email delivery failed: ${error.message}`);
    }

    logger.info(`Email sent successfully to: ${recipientEmail}`);
};

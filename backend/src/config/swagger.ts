/**
 * Swagger / OpenAPI configuration
 * Exposes API documentation at /docs
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sales Insight Automator API',
            version: '1.0.0',
            description:
                'Production-ready API for uploading sales datasets, generating AI-powered executive summaries, and emailing results.',
            contact: {
                name: 'Rabbitt AI',
                url: 'https://rabbittai.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Local development server',
            },
            {
                url: 'https://your-app.onrender.com',
                description: 'Production server (Render)',
            },
        ],
        components: {
            schemas: {
                HealthResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'ok' },
                        service: { type: 'string', example: 'Sales Insight Automator API' },
                    },
                },
                UploadSuccessResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Summary generated and sent successfully',
                        },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            example: 'Invalid file type',
                        },
                    },
                },
            },
        },
        paths: {
            '/health': {
                get: {
                    summary: 'Health Check',
                    description: 'Returns the current status of the API service',
                    tags: ['System'],
                    responses: {
                        '200': {
                            description: 'Service is running',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/HealthResponse' },
                                },
                            },
                        },
                    },
                },
            },
            '/api/upload': {
                post: {
                    summary: 'Upload Sales Data',
                    description:
                        'Accepts a CSV or XLSX sales dataset and recipient email. Parses the file, sends data to Google Gemini, generates an executive summary, and emails it to the recipient.',
                    tags: ['Upload'],
                    requestBody: {
                        required: true,
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    required: ['file', 'email'],
                                    properties: {
                                        file: {
                                            type: 'string',
                                            format: 'binary',
                                            description: 'CSV or XLSX sales dataset (max 5MB)',
                                        },
                                        email: {
                                            type: 'string',
                                            format: 'email',
                                            description: 'Recipient email for the executive summary',
                                            example: 'executive@company.com',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Summary generated and emailed successfully',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/UploadSuccessResponse' },
                                },
                            },
                        },
                        '400': {
                            description: 'Bad request (invalid file type, missing fields, etc.)',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                },
                            },
                        },
                        '429': {
                            description: 'Rate limit exceeded',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                },
                            },
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);

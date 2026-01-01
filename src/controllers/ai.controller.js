import { processFieldRequest } from '../services/llm.service.js';
import crypto from 'crypto';

export const handleFieldRequest = async (req, res) => {
    const startTime = Date.now();
    const requestId = `resp_${crypto.randomUUID().substring(0, 8)}`;

    try {
        const { action, fieldName, originalText, instruction, tone, format } = req.body;

        // Validate Schema
        if (!action || !['REWRITE', 'GENERATE'].includes(action)) {
            return res.status(400).json({
                error: 'INVALID_ACTION',
                message: 'Action must be REWRITE or GENERATE'
            });
        }

        if (!fieldName) {
            return res.status(400).json({
                error: 'MISSING_FIELD',
                message: 'fieldName is required'
            });
        }

        if (action === 'REWRITE' && !originalText) {
            return res.status(400).json({
                error: 'MISSING_TEXT',
                message: 'originalText is required for REWRITE action'
            });
        }

        // Process Request
        const result = await processFieldRequest({
            action,
            fieldName,
            originalText: originalText || '',
            instruction: instruction || '',
            tone: tone || '',
            format: format || ''
        });

        // Response
        res.json({
            id: requestId,
            newText: result.newText,
            meta: {
                processingTimeMs: Date.now() - startTime,
                action,
                fieldName
            }
        });

    } catch (error) {
        console.error('Controller Error:', error);
        res.status(500).json({
            error: 'PROVIDER_ERROR',
            message: error.message
        });
    }
};

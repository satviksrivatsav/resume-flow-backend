import { processAIRequest } from '../services/llm.service.js';
import crypto from 'crypto';

export const handleChat = async (req, res) => {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    try {
        const { action, history, userInstruction, context } = req.body;

        // 1. Validate Schema
        if (!action || !['CHAT', 'REWRITE', 'SUMMARIZE', 'FIX_GRAMMAR'].includes(action)) {
            return res.status(400).json({ error: 'INVALID_SCHEMA: Invalid or missing action' });
        }

        if (action === 'REWRITE' && (!context || !context.data)) {
            return res.status(400).json({ error: 'MISSING_CONTEXT: Action REWRITE requires context.data' });
        }

        // 2. Process Request via Service
        const aiResult = await processAIRequest({
            action,
            history: history || [],
            userInstruction,
            context: context || {}
        });

        // 3. Construct Response
        const responsePayload = {
            id: requestId,
            message: aiResult.message,
            suggestedUpdates: aiResult.suggestedUpdates || null,
            meta: {
                tokensUsed: aiResult.tokensUsed || 0, // Placeholder if not returned by service
                processingTimeMs: Date.now() - startTime,
                model: "Qwen/Qwen2.5-7B-Instruct"
            }
        };

        res.json(responsePayload);

    } catch (error) {
        console.error('Controller Error:', error);
        // Map specific errors if needed
        res.status(500).json({
            error: 'PROVIDER_ERROR',
            message: error.message
        });
    }
};

import { generateChatResponse } from '../services/llm.service.js';

export const handleChat = async (req, res) => {
    try {
        const { messages, context, action } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        const result = await generateChatResponse(messages, context || {}, action);
        res.json(result);
    } catch (error) {
        console.error('Controller Error:', error);
        res.status(500).json({ error: error.message });
    }
};

import dotenv from 'dotenv';
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const client = new InferenceClient(process.env.HF_TOKEN);

const SYSTEM_PROMPT = `You are an expert resume consultant. Your job is to help the user improve their resume.
You will receive a conversation history, user context (resume data), and an optional specific action (like "rewrite").
You MUST respond IN JSON FORMAT ONLY. Do not include any text outside the JSON block.

The JSON structure must be:
{
  "message": "Your conversational response to the user.",
  "suggestedUpdates": {
    // Optional: Only include this if you are suggesting concrete changes to the resume data.
    // The keys should match the resume sections provided in the context (e.g., "workExperience").
    // Each item must have its ID if updating an existing item.
  }
}

Example:
User says: "Rewrite the description for my Google role."
Context: { "workExperience": [{ "id": "1", "company": "Google", "description": "Did backend work." }] }

Response:
{
  "message": "I've rewritten the description to be more impact-driven.",
  "suggestedUpdates": {
    "workExperience": [{ "id": "1", "company": "Google", "description": "Engineered scalable backend services..." }]
  }
}

Keep your "message" helpful and concise.
If the user asks a general question, just provide the "message".
If the user asks to rewrite or improve, provide "suggestedUpdates".
`;

export async function generateChatResponse(messages, context, action) {
  try {
    // Construct the context string
    const contextString = JSON.stringify(context, null, 2);
    
    // Construct the final user message
    // We append the context to the latest message or system instruction effectively
    // But since this is a chat, we'll append it to the last user message or as a separate system-like user message.
    
    const relevantMessages = messages.map(m => ({
        role: m.role,
        content: m.content
    }));

    // Add instructions and context to the last message or as a new context message
    const lastMessage = relevantMessages[relevantMessages.length - 1];
    
    let promptContent = `
    Context (Resume Data):
    ${contextString}
    
    Action: ${action || "chat"}
    `;

    if (lastMessage && lastMessage.role === 'user') {
        lastMessage.content += `\n\n${promptContent}`;
    } else {
        relevantMessages.push({
            role: 'user',
            content: promptContent
        });
    }

    const payload = [
        { role: "system", content: SYSTEM_PROMPT },
        ...relevantMessages
    ];

    const chatCompletion = await client.chatCompletion({
        model: "Qwen/Qwen2.5-7B-Instruct", 
        messages: payload,
        temperature: 0.7,
        max_tokens: 2048, 
        response_format: { type: "json_object" } // Enforce JSON if supported, otherwise prompt does it
    });

    const content = chatCompletion.choices[0].message.content;
    
    // Parse JSON
    try {
        const parsed = JSON.parse(content);
        return parsed;
    } catch (e) {
        console.error("Failed to parse LLM response as JSON:", content);
        // Fallback if model fails to output JSON
        return {
            message: "I processed your request, but I had trouble structuring the update. Here is my raw response: " + content,
            suggestedUpdates: {}
        };
    }

  } catch (error) {
    console.error("LLM Service Error:", error);
    throw new Error("Failed to communicate with AI service");
  }
}

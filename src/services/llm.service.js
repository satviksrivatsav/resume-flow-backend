import dotenv from 'dotenv';
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const client = new InferenceClient(process.env.HF_TOKEN);

const SYSTEM_PROMPT_BASE = `You are a Resume Expert AI. 
Your goal is to assist users in creating high-quality, professional resumes.
You must output your response in strict JSON format.
NO preamble, NO markdown code blocks, JUST the JSON object.

Response Schema:
{
  "message": "Conversational text for the user...",
  "suggestedUpdates": { 
      // Optional: Only if data should change.
      // Keys must match ResumeData section names (e.g., "workExperience").
      // Arrays should contain objects with "id" matching the input.
  }
}
`;

/**
 * Constructs the core prompt based on the action.
 */
function constructPrompt(action, userInstruction, context) {
  let specificInstruction = "";
  let dataContextString = "";

  if (context && context.data) {
    dataContextString = JSON.stringify(context.data, null, 2);
  }

  switch (action) {
    case 'REWRITE':
      specificInstruction = `
Action: REWRITE
Target: ${context.targetSection || 'General'} (ID: ${context.targetId || 'N/A'})
Instruction: ${userInstruction || 'Improve this text.'}
Data to Rewrite:
${dataContextString}

Task: Rewrite the fields in the data to be better. Return the updated fields in 'suggestedUpdates' under the section '${context.targetSection}'. Ensure IDs are preserved.
Answer with a helpful message explaining what you changed.
`;
      break;
    case 'SUMMARIZE':
      specificInstruction = `
Action: SUMMARIZE
Data:
${dataContextString}

Task: Create a professional summary based on the provided data.
Return the result in 'suggestedUpdates.personalInfo.summary'.
Answer with "Here is a draft summary based on your experience."
`;
      break;
    case 'FIX_GRAMMAR':
      specificInstruction = `
Action: FIX_GRAMMAR
Data:
${dataContextString}

Task: Correct grammar and spelling in the data. Return updates in 'suggestedUpdates'.
`;
      break;
    case 'CHAT':
    default:
      specificInstruction = `
Action: CHAT
User Input: ${userInstruction}
Context Data (Reference only):
${dataContextString}

Task: Answer the user's question. If you suggest specific changes to the resume textual content, you CAN include them in 'suggestedUpdates', but mostly just chat.
`;
      break;
  }

  return specificInstruction;
}

export async function processAIRequest({ action, history, userInstruction, context }) {
  try {
    const promptContent = constructPrompt(action, userInstruction, context);

    // Build messages array
    // 1. System Prompt
    const messages = [
      { role: "system", content: SYSTEM_PROMPT_BASE }
    ];

    // 2. History (Last 10)
    if (history && history.length > 0) {
      messages.push(...history.slice(-10));
    }

    // 3. Current Turn
    messages.push({
      role: "user",
      content: promptContent
    });

    const chatCompletion = await client.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0].message.content;
    const tokensUsed = 0; // Usage stats not always available in standard HF inference response wrapper, setting 0 for now.

    try {
      // Sanitize potential markdown blocks if the model ignores the "no markdown" rule
      const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonString);

      return {
        message: parsed.message || "Processed your request.",
        suggestedUpdates: parsed.suggestedUpdates,
        tokensUsed
      };
    } catch (e) {
      console.error("Failed to parse LLM response as JSON:", content);
      return {
        message: "I processed your request, but there was a technical issue formatting the response. " + content.substring(0, 100) + "...",
        suggestedUpdates: null,
        tokensUsed
      };
    }

  } catch (error) {
    console.error("LLM Service Error:", error);
    throw new Error("AI Service Unavailable");
  }
}

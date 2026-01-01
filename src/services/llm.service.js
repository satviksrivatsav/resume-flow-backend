import dotenv from 'dotenv';
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const client = new InferenceClient(process.env.HF_TOKEN);

/**
 * Process a field-level AI request (REWRITE or GENERATE)
 */
export async function processFieldRequest({ action, fieldName, originalText, instruction, tone, format }) {
  // Build system prompt
  const systemPrompt = `You are a professional resume writer.
Field: ${fieldName}
Action: ${action}
${originalText ? `Original: ${originalText}` : ''}
${instruction ? `Instructions: ${instruction}` : ''}
${tone ? `Tone: ${tone}` : ''}
${format ? `Format: ${format}` : ''}

Generate professional resume content. Be concise, impactful, and use action verbs.
Return ONLY the improved text, no explanations.`;

  // Build user prompt
  let userPrompt = "";

  if (action === "REWRITE") {
    userPrompt = `Rewrite the following text for a resume ${fieldName} field.
${instruction ? `Instructions: ${instruction}` : ''}
${tone ? `Tone: ${tone}` : ''}
${format === 'bullets' ? 'Format as bullet points (start each with •).' : ''}
${format === 'paragraph' ? 'Format as a paragraph.' : ''}

Text to rewrite:
"${originalText}"

Respond with ONLY the rewritten text.`;
  } else {
    userPrompt = `Generate content for a resume ${fieldName} field.
${instruction ? `Instructions: ${instruction}` : ''}
${tone ? `Tone: ${tone}` : ''}
${format === 'bullets' ? 'Format as bullet points (start each with •).' : ''}
${format === 'paragraph' ? 'Format as a paragraph.' : ''}

Respond with ONLY the generated text.`;
  }

  const chatCompletion = await client.chatCompletion({
    model: "Qwen/Qwen2.5-7B-Instruct",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1024
  });

  return { newText: chatCompletion.choices[0].message.content.trim() };
}

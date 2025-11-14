import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export default async function main(tone) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Respond in ${tone} tone, How AI is changing the world?`,
  });
  return response.text;
}
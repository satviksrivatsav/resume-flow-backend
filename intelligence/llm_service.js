import dotenv from 'dotenv';
import { InferenceClient } from "@huggingface/inference";

// Load the secrets from .env file
dotenv.config();


// Initialize the Hugging Face Inference Client with the API token
const client = new InferenceClient(process.env.HF_TOKEN);

// Function to get chat completion from the model
export default async function getChatCompletion(prompt) {
    const chatCompletion = await client.chatCompletion({
    model: "Qwen/Qwen2.5-7B-Instruct:together",
    messages: [
        {
            role: "user",
            content: `${prompt}`,
        },
    ],
});
    return chatCompletion.choices[0].message.content;
}
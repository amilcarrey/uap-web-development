import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import OpenAI from "openai";

export const client = createOpenRouter({
    //baseURL: process.env.OPENROUTER_BASE_URL,
    apiKey: process.env.OPENROUTER_API_KEY,
})


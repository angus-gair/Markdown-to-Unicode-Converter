import { GoogleGenAI } from "@google/genai";

const getGenAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper to determine config based on model
const getConfig = (model: string) => {
  if (model === 'gemini-3-pro-preview') {
    return {
      thinkingConfig: { thinkingBudget: 32768 }
    };
  }
  // For other models (like flash), we stick to defaults (no explicit thinking budget)
  return {};
};

export const improveContent = async (text: string, model: string = 'gemini-3-pro-preview'): Promise<string> => {
  if (!text.trim()) {
    return text;
  }
  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: model,
      contents: `You are an expert career coach and copywriter specializing in LinkedIn. Review the following text and improve it for clarity, impact, and professional tone. Make it more readable and engaging. Ensure you use Markdown formatting (like bolding for keywords, bullet points for lists) to structure the content effectively. Return ONLY the improved Markdown text, without any introductory phrases like "Here's the improved version:".

Here is the text to improve:
---
${text}
---`,
      config: getConfig(model),
    });
    return response.text || text;
  } catch (error: any) {
    console.error("Error improving content:", error);
    throw new Error(`Failed to improve content. ${error.message || ''}`);
  }
};

export const formatContent = async (text: string, model: string = 'gemini-2.5-flash'): Promise<string> => {
    if (!text.trim()) {
    return text;
  }
  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: model,
      contents: `You are an expert text formatter. Reformat the following text using Markdown to improve its readability and structure. IMPORTANT: Do not change the original wording or content. Only add or adjust Markdown formatting such as headings, bolding, italics, and bullet points where appropriate to make it easier to read on platforms like LinkedIn. Return ONLY the formatted Markdown text, without any introductory phrases like "Here is the formatted text:".

Here is the text to format:
---
${text}
---`,
      config: getConfig(model),
    });
    return response.text || text;
  } catch (error: any) {
    console.error("Error formatting content:", error);
    throw new Error(`Failed to format content. ${error.message || ''}`);
  }
};

export const summarizeContent = async (text: string, model: string = 'gemini-2.5-flash'): Promise<string> => {
  if (!text.trim()) {
    return text;
  }
  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: model,
      contents: `You are an expert in creating concise and impactful summaries for professional social media platforms like LinkedIn. Summarize the following text, capturing the key points and main message. The summary should be easy to read and engaging. Use Markdown formatting (like bolding or bullet points) if it enhances clarity. Return ONLY the summarized Markdown text, without any introductory phrases like "Here is the summary:".

Here is the text to summarize:
---
${text}
---`,
      config: getConfig(model),
    });
    return response.text || text;
  } catch (error: any) {
    console.error("Error summarizing content:", error);
    throw new Error(`Failed to summarize content. ${error.message || ''}`);
  }
};
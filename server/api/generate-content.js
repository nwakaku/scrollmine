// Server-side API endpoint for AI content generation
// This keeps the Gemini API key secure on the server

import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt, platform, content } = req.body;

    if (!prompt || !platform) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get Gemini API key from environment variable
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ message: 'AI service not configured' });
    }

    // Initialize Google GenAI
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    // Generate content using the new SDK
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    if (response && response.text) {
      return res.status(200).json({ 
        content: response.text.trim(),
        platform,
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(500).json({ message: 'No content generated from AI' });
    }

  } catch (error) {
    console.error('AI generation error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

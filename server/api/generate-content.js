// Server-side API endpoint for AI content generation
// This keeps the Gemini API key secure on the server

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
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ message: 'AI service not configured' });
    }

    // Call Gemini 2.0 Flash API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': geminiApiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return res.status(response.status).json({ 
        message: `AI generation failed: ${errorData.error?.message || 'Unknown error'}` 
      });
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const generatedContent = data.candidates[0].content.parts[0].text.trim();
      
      return res.status(200).json({ 
        content: generatedContent,
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

# AI Content Generation Setup Guide

## 🤖 Real AI Implementation with Gemini

Your ScrollMine app now uses **Google's Gemini AI** to generate content with **server-side security**!

### **How Content Access Works:**

1. **Extension Content Capture**: 
   - The browser extension captures **actual page content**, not just titles
   - Uses smart selectors to find main content areas (article, main, .content, etc.)
   - Filters out navigation, ads, and other non-content elements
   - Stores up to 3000 characters of actual content

2. **Content Processing**:
   - Gemini AI analyzes the real content, snippets, and tags
   - Creates platform-specific posts based on actual insights
   - Generates unique, contextual content for each platform

### **Setup Instructions:**

#### **1. Get Gemini API Key**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (starts with `AIza`)

#### **2. Set Up Environment Variables**
Create a `.env` file in your project root:
```env
# Gemini AI API Key (get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### **3. Apply Database Schema**
Run this SQL in your Supabase dashboard:
```sql
-- Add content column to existing table
ALTER TABLE public.saved_items ADD COLUMN content TEXT;
```

### **How to Use:**

#### **1. Save Content with Extension**
1. Browse any webpage
2. Click the ScrollMine extension
3. The extension automatically captures:
   - Page title
   - Selected text (if any)
   - **Actual page content** (for AI processing)
   - Tags
4. Click "Save Content"

#### **2. Generate AI Content**
1. Go to your dashboard
2. Select saved items you want to generate from
3. Choose platform (Twitter, LinkedIn, Instagram, General)
4. Click "Generate AI Content"
5. Gemini AI creates platform-specific posts based on the actual content

### **AI Features:**

- **Platform-Specific Generation**: Different styles for each platform
- **Content Analysis**: Gemini reads actual article content, not just titles
- **Smart Prompts**: Optimized prompts for each platform
- **Contextual Posts**: Based on real insights from your saved content
- **Professional Quality**: Generates engaging, shareable content

### **Security:**

- **Server-Side API Key**: Your Gemini key stays on the server
- **No Client Exposure**: API key never sent to the browser
- **Centralized Control**: You control the AI service
- **Rate Limiting**: Can implement usage controls
- **Privacy**: Your content stays private

### **Cost:**

- Uses Google's Gemini Pro model
- Very cost-effective (often free tier available)
- You control your own API usage
- No hidden fees or subscriptions

### **Troubleshooting:**

**"No content available for AI processing"**
- Make sure you're saving content from article pages
- The extension needs to find main content areas
- Try refreshing the page before saving

**"AI service not configured"**
- Check your `.env` file has `GEMINI_API_KEY` set
- Ensure the API key starts with `AIza`
- Restart your development server after adding the key

**"Generation failed"**
- Check your internet connection
- Verify your Google AI Studio account has credits
- Try with fewer selected items
- Check server logs for detailed error messages

### **Example Workflow:**

1. **Save Article**: Read an interesting article → Save with extension
2. **Generate Post**: Select saved article → Choose Twitter → Generate
3. **Get AI Post**: Gemini creates engaging tweet based on article content
4. **Copy & Share**: Copy the generated content → Post to Twitter

The Gemini AI will analyze the actual article content and create posts that are:
- Engaging and shareable
- Platform-appropriate
- Based on real insights from the content
- Unique each time (not templates)

### **Why Server-Side?**

- **Security**: API key never exposed to users
- **Simplicity**: No user setup required
- **Control**: You manage the AI service
- **Reliability**: Centralized error handling
- **Scalability**: Easy to add rate limiting and monitoring

Enjoy your secure, Gemini-powered content generation! 🚀

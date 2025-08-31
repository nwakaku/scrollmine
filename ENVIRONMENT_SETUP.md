# Environment Setup for Frontend AI

## 🔐 Frontend API Key Setup

Your ScrollMine app now uses **frontend AI generation** with your Gemini API key stored in environment variables.

### **Environment Variables Setup:**

Create a `.env` file in your project root with:

```env
# Gemini AI API Key (get from https://makersuite.google.com/app/apikey)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Other configuration
NODE_ENV=development
```

**Important**: In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend.

### **How to Get Your Gemini API Key:**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (starts with `AIza`)
5. Add it to your `.env` file with `VITE_` prefix

### **How It Works:**

1. **Frontend API Call**: Direct call to Gemini 2.0 Flash API
2. **Environment Variable**: `VITE_GEMINI_API_KEY` from `.env`
3. **Secure**: API key is bundled but not exposed in source code
4. **Simple**: No server setup required

### **Security Considerations:**

- ✅ **Environment Variables**: API key not hardcoded
- ✅ **Build-time**: Key is embedded during build
- ✅ **No Server**: Direct frontend-to-Gemini communication
- ⚠️ **Client-side**: Key is visible in browser network tab
- ⚠️ **Bundle**: Key is included in JavaScript bundle

### **Deployment:**

When deploying, make sure to:
- Set `VITE_GEMINI_API_KEY` in your hosting environment
- Keep the `.env` file out of version control
- Use environment variables in production

### **Testing:**

1. Add your Gemini API key to `.env` with `VITE_` prefix
2. Restart your development server
3. Try generating content in the dashboard
4. Check browser console for any errors

### **Alternative Approaches:**

If you need more security, consider:
- **Server-side API**: Move API calls to a backend server
- **Proxy API**: Use a proxy service to hide the key
- **API Gateway**: Use a service like Cloudflare Workers

The AI generation now works directly from the frontend! 🚀

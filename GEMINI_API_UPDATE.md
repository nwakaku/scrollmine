# Gemini API Update

## Changes Made

### 1. Installed Google GenAI SDK
- Added `@google/genai` package to the project
- This provides the official Google SDK for Gemini API

### 2. Updated Server API (`server/api/generate-content.js`)
- **Before**: Used direct fetch calls to Gemini API
- **After**: Uses the new `@google/genai` SDK
- **Benefits**: 
  - Cleaner, more maintainable code
  - Better error handling
  - Official SDK support
  - Uses `gemini-2.0-flash-exp` model

### 3. Updated Extension Content Script (`extension/content.js`)
- **Before**: Used `gemini-pro` model with direct fetch
- **After**: Uses `gemini-2.0-flash-exp` model with config-based API key
- **Benefits**:
  - Uses the latest Gemini model
  - API key comes from environment variables via config
  - Better error handling
  - Consistent with server implementation

### 4. Environment Variable Integration
- Extension now properly uses `window.ScrollMineConfig.GEMINI_API_KEY`
- Fallback to hardcoded key if config not available
- Both Supabase and Gemini API keys are now configurable

## API Changes

### Old Approach:
```javascript
// Direct fetch to old endpoint
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`)
```

### New Approach:
```javascript
// Server-side with SDK
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: geminiApiKey });
const response = await ai.models.generateContent({
  model: "gemini-2.0-flash-exp",
  contents: prompt
});

// Extension with new endpoint
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`)
```

## Benefits

1. **Latest Model**: Now using `gemini-2.0-flash-exp` which is faster and more capable
2. **Better SDK**: Official Google SDK provides better error handling and features
3. **Environment Variables**: API keys are properly managed through environment variables
4. **Consistency**: Both server and extension use the same model and approach
5. **Maintainability**: Cleaner code that's easier to update and maintain

## Files Modified

- ✅ `package.json` - Added `@google/genai` dependency
- ✅ `server/api/generate-content.js` - Updated to use new SDK
- ✅ `extension/content.js` - Updated to use new model and config
- ✅ `extension/config.js` - Auto-generated with environment variables
- ✅ `scripts/build-extension.js` - Already configured for environment variables

## Testing

The extension should now:
1. Use the latest Gemini 2.0 Flash model
2. Properly read API keys from environment variables
3. Have better error handling
4. Work consistently between server and extension

To test:
1. Load the extension in Chrome
2. Try the "Ask Scrollmine" feature
3. Check that AI responses are generated properly
4. Verify that API keys are being read from config

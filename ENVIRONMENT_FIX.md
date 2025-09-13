# Environment Variables Fix

## Problem
The environment variables were not connecting properly between the frontend and extension because:

1. **Missing `.env` file** - Only `env.example` existed
2. **Hardcoded values in extension** - Extension had hardcoded Supabase credentials
3. **No build process** - Extension couldn't access environment variables

## Solution

### 1. Created Shared Configuration
- `src/lib/config.ts` - Centralized config for frontend
- `extension/config.js` - Auto-generated config for extension

### 2. Updated Files
- `src/lib/supabase.ts` - Now uses shared config
- `extension/supabase.js` - Now uses config file
- `extension/popup.html` - Includes config script

### 3. Added Build Scripts
- `scripts/setup-env.js` - Creates `.env` from `env.example`
- `scripts/build-extension.js` - Injects env vars into extension config

### 4. New NPM Scripts
```bash
npm run setup          # Create .env file
npm run build:extension # Update extension config
npm run build:all      # Build both frontend and extension
```

## How to Use

1. **First time setup:**
   ```bash
   npm run setup
   ```

2. **Update your API keys in `.env`** (if needed)

3. **Build extension with env vars:**
   ```bash
   npm run build:extension
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

## Environment Variables

The following variables are now properly connected:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key  
- `VITE_GEMINI_API_KEY` - Gemini AI API key

## Files Modified

- ✅ `src/lib/config.ts` - New shared config
- ✅ `src/lib/supabase.ts` - Uses shared config
- ✅ `extension/config.js` - Auto-generated config
- ✅ `extension/supabase.js` - Uses config file
- ✅ `extension/popup.html` - Includes config script
- ✅ `package.json` - Added build scripts
- ✅ `.env` - Created from env.example

The environment variables should now work properly in both the frontend and extension!

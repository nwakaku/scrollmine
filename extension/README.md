# ScrollMine Browser Extension

A browser extension that captures valuable content from your daily online surfing and transforms it into social media posts.

## Features

- 📝 Capture selected text from any webpage
- 🏷️ Add custom tags to organize your content
- 💾 Save content directly to your ScrollMine dashboard
- 🔐 Secure authentication with Supabase
- 🎨 Beautiful, modern UI

## Installation

### For Development

1. **Load the extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension` folder from this project

2. **Start the dashboard:**
   ```bash
   npm run dev
   ```

3. **Log in to your dashboard:**
   - Go to `http://localhost:3000`
   - Create an account or sign in
   - The extension will use your session to save content

### For Production

1. Build the extension:
   ```bash
   # Add build script to package.json if needed
   npm run build:extension
   ```

2. Load the built extension in Chrome as described above.

## How to Use

1. **Navigate to any webpage** you want to save content from
2. **Select text** on the page (optional)
3. **Click the ScrollMine extension icon** in your browser toolbar
4. **Review the captured content** - the extension automatically captures:
   - Page title
   - Page URL
   - Selected text (if any)
5. **Add tags** to organize your content (optional)
6. **Click "Save Content"** to save to your dashboard
7. **Click "Dashboard"** to view all your saved content

## Troubleshooting

### Common Issues

#### "Please log in to your ScrollMine dashboard first"
- **Solution:** Go to `http://localhost:3000` and sign in to your account
- The extension needs an active session to save content

#### "Error checking authentication status"
- **Solution:** Refresh the extension popup or restart your browser
- This usually happens when the session expires

#### "Content Security Policy violation"
- **Solution:** The extension now uses a local Supabase bundle instead of CDN
- If you still see this error, reload the extension in `chrome://extensions/`

#### Extension not working on certain websites
- **Solution:** The extension works on most websites, but some may block content scripts
- Try refreshing the page or using the context menu option

### Debug Mode

To enable debug logging:

1. Open the extension popup
2. Right-click and select "Inspect"
3. Check the console for detailed error messages

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── content.js            # Content script for webpage interaction
├── background.js         # Background service worker
├── supabase-bundle.js    # Local Supabase client
├── supabase.js           # Supabase configuration
└── icons/                # Extension icons
```

## Configuration

### Supabase Setup

The extension is configured to work with your Supabase project. Make sure:

1. Your Supabase URL and anon key are correct in `supabase.js`
2. The `saved_items` table exists in your Supabase database
3. Row Level Security (RLS) is properly configured

### Database Schema

The extension expects a `saved_items` table with the following columns:

```sql
CREATE TABLE saved_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  snippet TEXT,
  tags TEXT[],
  type TEXT DEFAULT 'article',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Development

### Making Changes

1. **Edit the files** in the `extension/` directory
2. **Reload the extension** in `chrome://extensions/`
3. **Test your changes** by clicking the extension icon

### Adding New Features

1. **UI Changes:** Edit `popup.html` and `popup.js`
2. **Content Interaction:** Modify `content.js`
3. **Background Tasks:** Update `background.js`
4. **Database Operations:** Modify `supabase.js`

## Security

- The extension only requests necessary permissions
- Authentication tokens are stored securely in Chrome's local storage
- No sensitive data is logged or transmitted unnecessarily
- Content Security Policy is properly configured

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Look at the browser console for error messages
3. Ensure your dashboard is running and accessible
4. Verify your Supabase configuration is correct

## License

This extension is part of the ScrollMine project.

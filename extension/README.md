# ScrollMine Browser Extension

A powerful browser extension that captures content from web pages and saves it to ScrollMine for AI-powered content generation.

## Features

### 🔐 **Authentication Modes**

#### **Authenticated Mode**
- Full access to ScrollMine dashboard
- Content synced across devices
- AI content generation
- Advanced features and analytics

#### **Local Mode** (NEW!)
- **No signup required** - start using immediately
- Content saved to browser's localStorage
- Full content capture and organization
- Seamless upgrade path to full account
- Data migration when you sign up

### 📱 **Core Functionality**

- **Smart Content Capture**: Automatically extracts page title, URL, and content
- **Text Selection**: Capture specific text snippets by highlighting
- **Content Type Detection**: Automatically detects articles, tweets, videos, etc.
- **Tagging System**: Add custom tags for better organization
- **Cross-Platform Support**: Works on Twitter, LinkedIn, YouTube, Medium, and more

## Installation

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scrollmine/extension
   ```

2. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension` folder

3. **Configure the extension**
   - Update `popup.js` with your ScrollMine dashboard URL
   - Set `DASHBOARD_URL` to your production URL when ready

## Usage

### Getting Started

1. **Click the ScrollMine extension icon** in your browser toolbar
2. **Choose your mode**:
   - **Local Mode**: Start saving content immediately (no signup)
   - **Sign In**: Use your ScrollMine account for full features

### Saving Content

1. **Navigate to any webpage** you want to save
2. **Open the extension** and review the captured information:
   - Page title and URL (auto-captured)
   - Selected text (if you highlighted any)
   - Page content (for AI processing)
3. **Add optional tags** for better organization
4. **Click "Save Content"** to store it

### Local Mode Features

- **Immediate Use**: No account required
- **Full Functionality**: Save, organize, and manage content
- **Data Persistence**: Content saved in your browser
- **Easy Upgrade**: Sign up anytime to sync your data
- **Migration**: All local data transfers when you create an account

### Authenticated Mode Features

- **Cloud Sync**: Access content from any device
- **AI Generation**: Create social media posts from saved content
- **Advanced Analytics**: Track content performance
- **Team Features**: Share and collaborate (coming soon)

## Technical Details

### Content Capture

The extension intelligently captures:
- **Page Metadata**: Title, URL, description, author, published date
- **Content Type**: Automatically detects articles, tweets, videos, etc.
- **Page Content**: Extracts main content for AI processing
- **Selected Text**: User-highlighted text snippets

### Storage

#### Local Mode
- Uses browser's localStorage
- Data structure matches cloud version
- Automatic migration to cloud when signing up
- Data persists until browser data is cleared

#### Authenticated Mode
- Saves to ScrollMine cloud database
- Real-time sync across devices
- Backup and recovery options

### Supported Platforms

- **Social Media**: Twitter, LinkedIn, Facebook, Instagram
- **Video Platforms**: YouTube, Vimeo
- **Blog Platforms**: Medium, Substack, WordPress
- **News Sites**: Most major news websites
- **General Web**: Any webpage with content

## Development

### File Structure

```
extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── content.js            # Content script for page interaction
├── background.js         # Background script
├── supabase.js           # Supabase client configuration
├── icons/                # Extension icons
└── README.md            # This file
```

### Key Components

#### `popup.js`
- Main extension logic
- Authentication handling
- Content saving (local and cloud)
- UI state management

#### `content.js`
- Page content extraction
- Text selection handling
- Metadata detection
- Content type classification

#### `supabase.js`
- Supabase client setup
- Authentication methods
- Database operations

### Local Storage Schema

```javascript
// Saved Items
{
  id: string,
  title: string,
  url: string,
  snippet?: string,
  content?: string,
  tags: string[],
  type: string,
  created_at: string,
  is_favorite: boolean,
  usage_count: number,
  last_used_at?: string
}
```

## Configuration

### Environment Variables

Update these in `popup.js`:
```javascript
const DASHBOARD_URL = 'https://your-app.scrollmine.com/dashboard';
const LOCAL_DASHBOARD_URL = 'https://your-app.scrollmine.com/local-dashboard';
```

### Supabase Configuration

Update `supabase.js` with your Supabase credentials:
```javascript
const SUPABASE_URL = 'your-supabase-url';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
```

## Troubleshooting

### Common Issues

1. **Extension not loading**
   - Check Chrome's developer console for errors
   - Verify all files are present in the extension folder
   - Ensure manifest.json is valid

2. **Content not saving**
   - Check authentication status
   - Verify Supabase configuration
   - Check browser console for error messages

3. **Local mode not working**
   - Ensure localStorage is enabled in browser
   - Check for browser storage limits
   - Verify extension permissions

### Debug Mode

Enable debug logging by adding to `popup.js`:
```javascript
const DEBUG = true;
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This extension is part of the ScrollMine project and follows the same license terms.

## Support

For support and questions:
- Check the main ScrollMine documentation
- Open an issue on GitHub
- Contact the development team

---

**Note**: This extension is designed to work with the ScrollMine web application. Make sure you have the web app running or configured to use the extension effectively.

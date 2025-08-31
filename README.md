# ScrollMine - Smart Content Capture & Generation

ScrollMine is a powerful tool that helps creators capture valuable content from their daily online surfing and transform it into engaging social media posts using AI.

## 🚀 Features

- **Browser Extension**: One-click content saving with smart text selection
- **Beautiful Dashboard**: Modern React interface with Tailwind CSS
- **AI Content Generation**: Create posts for Twitter, LinkedIn, Instagram
- **Smart Organization**: Tag and categorize your saved content
- **Real-time Sync**: Seamless integration between extension and dashboard
- **Authentication**: Secure user management with Supabase

## 🛠️ Tech Stack

- **Frontend**: Vite + React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth + PostgreSQL) - No separate backend server
- **Browser Extension**: Chrome Extension Manifest V3
- **AI**: OpenAI/Gemini API (configurable)
- **Deployment**: Vercel (frontend), Supabase (backend)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Chrome/Edge browser
- Supabase account
- OpenAI or Google Gemini API key (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd scrollmine
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Get your project URL and anon key from Settings > API
4. Get your service role key from Settings > API (for the server)

### 4. Configure Environment Variables

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (Optional - for AI content generation)
VITE_OPENAI_API_KEY=your_openai_api_key

# Google Gemini Configuration (Optional - for AI content generation)
VITE_GEMINI_API_KEY=your_gemini_api_key

# App Configuration
VITE_APP_URL=http://localhost:3000
```

**Important**: Also update the Supabase configuration in `extension/supabase.js` with your project URL and anon key.

### 5. Run the Development Server

Start the frontend development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 6. Install Browser Extension

1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension` folder
4. The ScrollMine extension should now appear in your browser

## 📁 Project Structure

```
scrollmine/
├── src/                    # Vite source directory
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── dashboard/    # Dashboard components
│   │   └── providers/    # Context providers
│   ├── pages/            # Page components
│   ├── lib/              # Utility libraries
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── server/               # Express API server
│   └── index.ts          # API server entry point
├── extension/            # Chrome extension
│   ├── manifest.json     # Extension manifest
│   ├── popup.html        # Extension popup
│   ├── popup.js          # Popup logic
│   ├── content.js        # Content script
│   └── background.js     # Background script
├── supabase/             # Database schema
│   └── schema.sql        # SQL schema
├── public/               # Static assets
├── index.html            # Vite entry HTML
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Supabase Setup

1. **Database Schema**: Run the SQL commands in `supabase/schema.sql`
2. **Authentication**: Enable email authentication in Supabase Auth settings
3. **Row Level Security**: RLS policies are already configured in the schema
4. **Service Role Key**: Get this from Supabase Settings > API for the server

### AI Integration

The app includes mock AI generation by default. To use real AI:

1. **OpenAI**: Uncomment the OpenAI implementation in `server/index.ts`
2. **Gemini**: Uncomment the Gemini implementation in the same file
3. Add your API keys to `.env.local`

### Browser Extension

The extension is configured to work with `localhost:3000` (frontend) by default. For production:

1. Update the Supabase configuration in `extension/supabase.js`
2. Update `host_permissions` in `extension/manifest.json`
3. Update the dashboard URL in `extension/popup.js`

## 🎯 Usage

### 1. Sign Up/Login

- Visit the app and create an account
- Verify your email (if required by Supabase settings)

### 2. Save Content

- Browse any webpage
- Click the ScrollMine extension icon
- Add optional tags and notes
- Click "Save Content"

### 3. Generate Posts

- Go to your dashboard
- Select saved items
- Choose a platform (Twitter, LinkedIn, Instagram)
- Generate AI-powered content

### 4. Export Content

- Copy generated content to clipboard
- Save as final content
- Share across your social media platforms

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Backend (Supabase)

- Your Supabase project is already deployed
- Update the extension configuration for your production domain

### Extension

1. Update Supabase configuration in `extension/supabase.js` for production
2. Package the extension for Chrome Web Store (optional)

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication via Supabase
- Input validation on all client-side operations
- Secure direct Supabase integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- Check the [Issues](../../issues) page for known problems
- Create a new issue for bugs or feature requests
- Join our community discussions

## 🎉 Acknowledgments

- Built with Vite, React, and Supabase
- Icons from Heroicons
- Animations with Framer Motion
- Styling with Tailwind CSS

---

**Happy content mining! 🚀**

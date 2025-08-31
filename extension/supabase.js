// Supabase configuration for browser extension
const SUPABASE_URL = "https://vyxwxkexvveglzsxlwyc.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5eHd4a2V4dnZlZ2x6c3hsd3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MTEzMTQsImV4cCI6MjA3MjE4NzMxNH0.M1BkwS_2PoH4wGwLQtpCKcvMyvqgpIrkn3H3R1j6lxs"

// Direct API implementation for browser extension
class ScrollMineAPI {
  constructor() {
    this.url = SUPABASE_URL;
    this.key = SUPABASE_ANON_KEY;
  }

  // Get stored session
  async getSession() {
    try {
      const result = await chrome.storage.local.get(['supabase_session']);
      const session = result.supabase_session;
      
      if (session && session.expires_at && new Date(session.expires_at) > new Date()) {
        return { data: { session }, error: null };
      } else {
        await chrome.storage.local.remove(['supabase_session']);
        return { data: { session: null }, error: null };
      }
    } catch (error) {
      return { data: { session: null }, error };
    }
  }

  // Sign in user
  async signIn({ email, password }) {
    try {
      const response = await fetch(`${this.url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error_description || data.error);
      }

      // Store session
      await chrome.storage.local.set({ 
        supabase_session: {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
          user: data.user
        }
      });

      return { data: { session: data, user: data.user }, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  }

  // Sign out user
  async signOut() {
    try {
      await chrome.storage.local.remove(['supabase_session']);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Check authentication status
  async checkAuth() {
    try {
      const { data: { session }, error } = await this.getSession();
      return { isAuthenticated: !!session, session, error };
    } catch (error) {
      console.error('Error checking auth status:', error);
      return { isAuthenticated: false, session: null, error };
    }
  }

  // Save item to database
  async saveItem(itemData) {
    try {
      const { data: { session }, error: sessionError } = await this.getSession();
      
      if (sessionError || !session) {
        throw new Error('No authenticated session found. Please sign in first.');
      }

      const response = await fetch(`${this.url}/rest/v1/saved_items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.key,
          'Authorization': `Bearer ${session.access_token}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: session.user.id,
          url: itemData.url,
          title: itemData.title,
          snippet: itemData.snippet,
          tags: itemData.tags,
          type: itemData.type
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result };
      } else {
        throw new Error(result.message || result.error || 'Failed to save item');
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      throw error;
    }
  }
}

// Create global API instance
const scrollMineAPI = new ScrollMineAPI();

// Export functions for use in popup.js
window.ScrollMineSupabase = {
  saveItem: (itemData) => scrollMineAPI.saveItem(itemData),
  checkAuth: () => scrollMineAPI.checkAuth(),
  signIn: (credentials) => scrollMineAPI.signIn(credentials),
  signOut: () => scrollMineAPI.signOut(),
  api: scrollMineAPI
};

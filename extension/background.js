// Background service worker for ScrollMine extension

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // First time installation
    console.log('ScrollMine extension installed');
    
    // Open welcome page
    chrome.tabs.create({
      url: 'http://localhost:3000?welcome=true'
    });
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('ScrollMine extension updated');
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will only trigger if no popup is defined in manifest
  // For our extension, we have a popup, so this won't be called
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background script received message:', message);
  
  if (message.action === 'authenticate') {
    handleAuthentication(message.token);
  } else if (message.action === 'logout') {
    handleLogout();
  } else if (message.action === 'getAuthStatus') {
    getAuthStatus().then(sendResponse);
    return true; // Keep message channel open for async response
  } else if (message.action === 'saveContent') {
    console.log('Handling saveContent request');
    handleSaveContent(message.data).then(sendResponse);
    return true; // Keep message channel open for async response
  } else if (message.action === 'openPopup') {
    handleOpenPopup();
  }
});

// Handle user authentication
async function handleAuthentication(token) {
  try {
    // Store the token
    await chrome.storage.local.set({ scrollmine_token: token });
    
    // Update extension icon to show authenticated state
    chrome.action.setIcon({
      path: {
        "16": "icons/icon16.png",
        "32": "icons/icon32.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
      }
    });
    
    console.log('User authenticated successfully');
  } catch (error) {
    console.error('Error storing authentication token:', error);
  }
}

// Handle user logout
async function handleLogout() {
  try {
    // Remove stored token
    await chrome.storage.local.remove(['scrollmine_token']);
    
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error removing authentication token:', error);
  }
}

// Get authentication status
async function getAuthStatus() {
  try {
    const result = await chrome.storage.local.get(['scrollmine_token']);
    return {
      authenticated: !!result.scrollmine_token,
      token: result.scrollmine_token || null
    };
  } catch (error) {
    console.error('Error getting auth status:', error);
    return {
      authenticated: false,
      token: null
    };
  }
}

// Handle tab updates to show extension icon only on web pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    
    // Only show extension on http/https pages
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      chrome.action.enable(tabId);
    } else {
      chrome.action.disable(tabId);
    }
  }
});

// Handle context menu (optional feature)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'scrollmine-save',
    title: 'Save to ScrollMine',
    contexts: ['selection', 'page']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'scrollmine-save') {
    // Open popup programmatically
    chrome.action.openPopup();
  }
});

// Periodic token validation (optional)
async function validateToken() {
  try {
    const result = await chrome.storage.local.get(['scrollmine_token']);
    if (result.scrollmine_token) {
      // You could add token validation logic here
      // For now, we'll just keep the token as is
    }
  } catch (error) {
    console.error('Error validating token:', error);
  }
}

// Run token validation every hour
setInterval(validateToken, 60 * 60 * 1000);

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.scrollmine_token) {
    const newToken = changes.scrollmine_token.newValue;
    const oldToken = changes.scrollmine_token.oldValue;
    
    if (newToken && !oldToken) {
      console.log('User logged in');
    } else if (!newToken && oldToken) {
      console.log('User logged out');
    }
  }
});

// Handle content saving from floating bubble
async function handleSaveContent(data) {
  console.log('handleSaveContent called with data:', data);
  
  try {
    // Check if user is authenticated by checking for Supabase session
    const sessionResult = await chrome.storage.local.get(['supabase_session']);
    const session = sessionResult.supabase_session;
    
    console.log('Session check:', { hasSession: !!session, expiresAt: session?.expires_at });
    
    if (session && session.expires_at && new Date(session.expires_at) > new Date()) {
      console.log('User is authenticated, saving to Supabase');
      // User is authenticated, save to Supabase
      const response = await fetch('https://vyxwxkexvveglzsxlwyc.supabase.co/rest/v1/saved_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5eHd4a2V4dnZlZ2x6c3hsd3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MTEzMTQsImV4cCI6MjA3MjE4NzMxNH0.M1BkwS_2PoH4wGwLQtpCKcvMyvqgpIrkn3H3R1j6lxs',
          'Authorization': `Bearer ${session.access_token}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: session.user.id,
          url: data.url,
          title: data.title,
          snippet: data.snippet,
          content: data.content,
          tags: data.tags,
          type: data.type
        })
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to save to server');
      }
    } else {
      console.log('User not authenticated, saving to local storage');
      // User not authenticated, save to local storage
      const items = await chrome.storage.local.get(['savedItems']);
      const savedItems = items.savedItems || [];
      
      const newItem = {
        ...data,
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        is_favorite: false,
        usage_count: 0
      };
      
      console.log('Saving item to local storage:', newItem);
      savedItems.unshift(newItem);
      await chrome.storage.local.set({ savedItems });
      
      console.log('Successfully saved to local storage');
      return { success: true };
    }
  } catch (error) {
    console.error('Error saving content:', error);
    return { success: false, error: error.message };
  }
}

// Handle opening popup programmatically
function handleOpenPopup() {
  chrome.action.openPopup();
}

// Configuration - Using Supabase directly
const DASHBOARD_URL = 'http://localhost:3000/dashboard';
const LOCAL_DASHBOARD_URL = 'http://localhost:3000/local-dashboard';

// DOM elements
const loginSection = document.getElementById('loginSection');
const userInfo = document.getElementById('userInfo');
const contentSection = document.getElementById('contentSection');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const userEmail = document.getElementById('userEmail');
const openDashboard = document.getElementById('openDashboard');
const openDashboardFromContent = document.getElementById('openDashboardFromContent');

// Mode toggle elements
const continueModeBtn = document.getElementById('continueMode');
const signInModeBtn = document.getElementById('signInMode');

const pageTitleEl = document.getElementById('pageTitle');
const pageUrlEl = document.getElementById('pageUrl');
const snippetTextEl = document.getElementById('snippetText');
const tagsInputEl = document.getElementById('tagsInput');
const saveButtonEl = document.getElementById('saveButton');
const statusEl = document.getElementById('status');
const loadingEl = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');

// Settings elements
const bubbleEnabledCheckbox = document.getElementById('bubbleEnabled');

// State
let currentTab = null;
let selectedText = '';
let pageContent = '';
let isAuthenticated = false;
let isLocalMode = false;
let currentMode = 'continue'; // 'continue' or 'signin'

// Local Storage Keys
const LOCAL_STORAGE_KEYS = {
  SAVED_ITEMS: 'scrollmine_saved_items',
  USER_PREFERENCES: 'scrollmine_user_preferences'
};

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  // Wait for ScrollMineSupabase to be available
  await waitForScrollMineSupabase();
  await initializePopup();
  setupEventListeners();
  initializeSettings();
  setupModeToggle();
  
  // Test Supabase connection
  testSupabaseConnection();
});

// Test function to check Supabase connectivity
async function testSupabaseConnection() {
  if (!window.ScrollMineSupabase) {
    console.log('ScrollMineSupabase not available for testing');
    return;
  }
  
  try {
    console.log('Testing Supabase connection...');
    const result = await window.ScrollMineSupabase.checkAuth();
    console.log('Supabase connection test result:', result);
  } catch (error) {
    console.error('Supabase connection test failed:', error);
  }
}

// Wait for ScrollMineSupabase to be available
async function waitForScrollMineSupabase() {
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds max wait
  
  while (!window.ScrollMineSupabase && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }
  
  if (!window.ScrollMineSupabase) {
    console.warn('ScrollMineSupabase not loaded after 5 seconds, continuing in local mode');
    // Set current mode to continue if Supabase is not available
    currentMode = 'continue';
  }
}

async function initializePopup() {
  try {
    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;

    // Update page info
    pageTitleEl.textContent = tab.title || 'Untitled Page';
    pageUrlEl.textContent = tab.url || 'No URL available';

    // Get selected text and page content from content script
    try {
      const [textResponse, contentResponse] = await Promise.all([
        chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' }),
        chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' })
      ]);
      
      if (textResponse && textResponse.selectedText) {
        selectedText = textResponse.selectedText;
        snippetTextEl.value = selectedText;
      }
      
      if (contentResponse && contentResponse.pageContent) {
        pageContent = contentResponse.pageContent;
      }
    } catch (error) {
      // Content script might not be available, that's okay
      console.log('Content script not available:', error.message);
    }

    // Check authentication status
    await checkAuthAndUpdateUI();
  } catch (error) {
    console.error('Error initializing popup:', error);
    showStatus('Error loading page information', 'error');
  }
}

async function checkAuthAndUpdateUI() {
  try {
    // Check if ScrollMineSupabase is available
    if (!window.ScrollMineSupabase) {
      console.log('ScrollMineSupabase not available, using local mode');
      updateUIForCurrentMode();
      return;
    }
    
    const { isAuthenticated: authStatus, session, error } = await window.ScrollMineSupabase.checkAuth();
    isAuthenticated = authStatus;
    
    if (error) {
      console.error('Auth check error:', error);
      updateUIForCurrentMode();
    } else if (isAuthenticated && session) {
      showAuthenticatedUI(session);
    } else {
      updateUIForCurrentMode();
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    updateUIForCurrentMode();
  }
}

function setupModeToggle() {
  continueModeBtn.addEventListener('click', () => {
    currentMode = 'continue';
    updateModeToggleUI();
    updateUIForCurrentMode();
  });

  signInModeBtn.addEventListener('click', () => {
    currentMode = 'signin';
    updateModeToggleUI();
    updateUIForCurrentMode();
  });
}

function updateModeToggleUI() {
  if (currentMode === 'continue') {
    continueModeBtn.classList.add('active');
    signInModeBtn.classList.remove('active');
  } else {
    signInModeBtn.classList.add('active');
    continueModeBtn.classList.remove('active');
  }
}

function updateUIForCurrentMode() {
  if (currentMode === 'continue') {
    showLocalModeUI();
  } else {
    showLoginUI();
  }
}

function showLocalModeUI() {
  isLocalMode = true;
  loginSection.classList.remove('active');
  userInfo.classList.remove('active');
  contentSection.style.display = 'block';
  
  // Remove existing local mode indicator
  const existingIndicator = document.querySelector('.local-mode-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Update UI for local mode
  const localModeIndicator = document.createElement('div');
  localModeIndicator.className = 'local-mode-indicator';
  localModeIndicator.innerHTML = `
    <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 4px; padding: 8px; margin-bottom: 12px; font-size: 12px; color: #92400e;">
      <strong>Local Mode:</strong> Content will be saved to your browser. 
      <a href="#" id="signUpLink" style="color: #d97706; text-decoration: underline;">Sign up</a> to sync across devices.
    </div>
  `;
  
  // Insert at the top of content section
  contentSection.insertBefore(localModeIndicator, contentSection.firstChild);
  
  // Add event listener for sign up link
  document.getElementById('signUpLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'http://localhost:3000' });
  });
  
  showStatus('Local mode - content saved to browser', 'info');
}

function showLoginUI() {
  isLocalMode = false;
  loginSection.classList.add('active');
  userInfo.classList.remove('active');
  contentSection.style.display = 'none';
  
  // Remove local mode indicator if present
  const localModeIndicator = document.querySelector('.local-mode-indicator');
  if (localModeIndicator) {
    localModeIndicator.remove();
  }
  
  showStatus('Please sign in to use ScrollMine', 'error');
}

function showAuthenticatedUI(session) {
  isLocalMode = false;
  loginSection.classList.remove('active');
  userInfo.classList.add('active');
  contentSection.style.display = 'block';
  
  // Remove local mode indicator if present
  const localModeIndicator = document.querySelector('.local-mode-indicator');
  if (localModeIndicator) {
    localModeIndicator.remove();
  }
  
  // Show user email
  if (session.user && session.user.email) {
    userEmail.textContent = session.user.email;
  }
  
  showStatus('Ready to save content', 'success');
}

function setupEventListeners() {
  // Login button
  loginButton.addEventListener('click', handleLogin);

  // Logout button
  logoutButton.addEventListener('click', handleLogout);

  // Open dashboard buttons
  openDashboard.addEventListener('click', () => {
    const url = isLocalMode ? LOCAL_DASHBOARD_URL : DASHBOARD_URL;
    chrome.tabs.create({ url });
  });

  openDashboardFromContent.addEventListener('click', () => {
    const url = isLocalMode ? LOCAL_DASHBOARD_URL : DASHBOARD_URL;
    chrome.tabs.create({ url });
  });

  // Save button
  saveButtonEl.addEventListener('click', handleSaveContent);

  // Tags input - auto-format
  tagsInputEl.addEventListener('input', (e) => {
    const value = e.target.value;
    // Remove extra spaces and commas
    const cleaned = value.replace(/\s*,\s*/g, ', ').replace(/^,\s*/, '').replace(/\s*,$/, '');
    e.target.value = cleaned;
  });

  // Enter key on login form
  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      passwordInput.focus();
    }
  });

  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  });
}

async function handleLogin() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showStatus('Please enter both email and password', 'error');
    return;
  }

  // Check if ScrollMineSupabase is available
  if (!window.ScrollMineSupabase) {
    showStatus('Sign-in service not available. Please use "Continue" mode or refresh the extension.', 'error');
    return;
  }

  setLoading(true, 'Signing in...');
  loginButton.disabled = true;

  try {
    console.log('Attempting login with:', { email, password: '***' });
    const result = await window.ScrollMineSupabase.signIn({ email, password });
    console.log('Login result:', result);
    
    const { data, error } = result;
    
    if (error) {
      console.error('Login error from Supabase:', error);
      throw new Error(error.message || error.error_description || 'Login failed');
    }

    if (data && data.user) {
      isAuthenticated = true;
      showAuthenticatedUI(data);
      showStatus('Successfully signed in!', 'success');
      
      // Clear form
      emailInput.value = '';
      passwordInput.value = '';
    } else {
      console.error('No user data in response:', data);
      throw new Error('Login failed - no user data received');
    }
  } catch (error) {
    console.error('Login error:', error);
    showStatus(`Login failed: ${error.message}`, 'error');
  } finally {
    setLoading(false);
    loginButton.disabled = false;
  }
}

async function handleLogout() {
  try {
    if (!window.ScrollMineSupabase) {
      showStatus('Sign-out service not available. Please refresh the extension.', 'error');
      return;
    }
    
    await window.ScrollMineSupabase.signOut();
    isAuthenticated = false;
    updateUIForCurrentMode();
    showStatus('Successfully signed out', 'success');
  } catch (error) {
    console.error('Logout error:', error);
    showStatus('Error signing out', 'error');
  }
}

async function handleSaveContent() {
  if (!currentTab) {
    showStatus('No active tab found', 'error');
    return;
  }

  const content = {
    url: currentTab.url,
    title: currentTab.title,
    snippet: snippetTextEl.value.trim(),
    content: pageContent, // Store the actual page content for AI processing
    tags: tagsInputEl.value.trim().split(',').map(tag => tag.trim()).filter(tag => tag),
    type: detectContentType(currentTab.url)
  };

  if (!content.title) {
    showStatus('Page title is required', 'error');
    return;
  }

  setLoading(true, 'Saving content...');
  saveButtonEl.disabled = true;

  try {
    if (isAuthenticated) {
      // Save to Supabase
      const result = await window.ScrollMineSupabase.saveItem(content);
      
      if (result.success) {
        showStatus('Content saved successfully!', 'success');
        // Clear form
        snippetTextEl.value = '';
        tagsInputEl.value = '';
        
        // Update status after a delay
        setTimeout(() => {
          showStatus('Ready to save more content', 'success');
        }, 2000);
      } else {
        throw new Error('Failed to save content');
      }
    } else {
      // Save to localStorage
      const savedItem = saveToLocalStorage(content);
      if (savedItem) {
        showStatus('Content saved locally!', 'success');
        // Clear form
        snippetTextEl.value = '';
        tagsInputEl.value = '';
        
        // Update status after a delay
        setTimeout(() => {
          showStatus('Ready to save more content (local mode)', 'success');
        }, 2000);
      } else {
        throw new Error('Failed to save content locally');
      }
    }
  } catch (error) {
    console.error('Error saving content:', error);
    
    if (error.message.includes('No authenticated session')) {
      showStatus('Session expired. Please sign in again.', 'error');
      isAuthenticated = false;
      updateUIForCurrentMode();
    } else {
      showStatus(`Error: ${error.message}`, 'error');
    }
  } finally {
    setLoading(false);
    saveButtonEl.disabled = false;
  }
}

// Local Storage Functions
function saveToLocalStorage(item) {
  try {
    const items = getLocalSavedItems();
    const newItem = {
      ...item,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      is_favorite: false,
      usage_count: 0
    };
    
    items.unshift(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SAVED_ITEMS, JSON.stringify(items));
    return newItem;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return null;
  }
}

function getLocalSavedItems() {
  try {
    const items = localStorage.getItem(LOCAL_STORAGE_KEYS.SAVED_ITEMS);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

function detectContentType(url) {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
    return 'tweet';
  } else if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'video';
  } else if (urlLower.includes('linkedin.com')) {
    return 'article';
  } else {
    return 'article';
  }
}

function setLoading(loading, text = 'Loading...') {
  if (loading) {
    loadingEl.style.display = 'block';
    loadingText.textContent = text;
    if (saveButtonEl) saveButtonEl.textContent = 'Saving...';
  } else {
    loadingEl.style.display = 'none';
    if (saveButtonEl) saveButtonEl.textContent = 'Save Content';
  }
}

function showStatus(message, type = 'info') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  
  // Clear status after 5 seconds for success/error messages
  if (type === 'success' || type === 'error') {
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = 'status';
    }, 5000);
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateSelectedText') {
    selectedText = message.selectedText;
    snippetTextEl.value = selectedText;
  }
});

// Settings Functions
async function initializeSettings() {
  try {
    // Load bubble settings
    const result = await chrome.storage.local.get(['bubbleEnabled']);
    bubbleEnabledCheckbox.checked = result.bubbleEnabled !== false; // Default to enabled
    
    // Add event listener for bubble toggle
    bubbleEnabledCheckbox.addEventListener('change', handleBubbleToggle);
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
}

async function handleBubbleToggle() {
  try {
    const enabled = bubbleEnabledCheckbox.checked;
    await chrome.storage.local.set({ bubbleEnabled: enabled });
    
    // Notify all tabs to show/hide bubble
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'toggleBubble',
          enabled: enabled
        });
      } catch (error) {
        // Tab might not have content script, ignore
      }
    }
    
    showStatus(enabled ? 'Floating bubble enabled' : 'Floating bubble disabled', 'success');
  } catch (error) {
    console.error('Error toggling bubble:', error);
    showStatus('Error updating bubble settings', 'error');
  }
}

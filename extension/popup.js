// Configuration - Using Supabase directly
const DASHBOARD_URL = 'http://localhost:3000/dashboard';

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

const pageTitleEl = document.getElementById('pageTitle');
const pageUrlEl = document.getElementById('pageUrl');
const snippetTextEl = document.getElementById('snippetText');
const tagsInputEl = document.getElementById('tagsInput');
const saveButtonEl = document.getElementById('saveButton');
const statusEl = document.getElementById('status');
const loadingEl = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');

// State
let currentTab = null;
let selectedText = '';
let pageContent = '';
let isAuthenticated = false;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await initializePopup();
  setupEventListeners();
});

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
    const { isAuthenticated: authStatus, session, error } = await window.ScrollMineSupabase.checkAuth();
    isAuthenticated = authStatus;
    
    if (error) {
      console.error('Auth check error:', error);
      showLoginUI();
    } else if (isAuthenticated && session) {
      showAuthenticatedUI(session);
    } else {
      showLoginUI();
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    showLoginUI();
  }
}

function showLoginUI() {
  loginSection.classList.add('active');
  userInfo.classList.remove('active');
  contentSection.style.display = 'none';
  showStatus('Please sign in to use ScrollMine', 'error');
}

function showAuthenticatedUI(session) {
  loginSection.classList.remove('active');
  userInfo.classList.add('active');
  contentSection.style.display = 'block';
  
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
    chrome.tabs.create({ url: DASHBOARD_URL });
  });

  openDashboardFromContent.addEventListener('click', () => {
    chrome.tabs.create({ url: DASHBOARD_URL });
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

  setLoading(true, 'Signing in...');
  loginButton.disabled = true;

  try {
    const { data, error } = await window.ScrollMineSupabase.signIn({ email, password });
    
    if (error) {
      throw new Error(error.message || 'Login failed');
    }

    if (data && data.user) {
      isAuthenticated = true;
      showAuthenticatedUI(data);
      showStatus('Successfully signed in!', 'success');
      
      // Clear form
      emailInput.value = '';
      passwordInput.value = '';
    } else {
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
    await window.ScrollMineSupabase.signOut();
    isAuthenticated = false;
    showLoginUI();
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

  if (!isAuthenticated) {
    showStatus('Please sign in first', 'error');
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
    // Save directly to Supabase
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
  } catch (error) {
    console.error('Error saving content:', error);
    
    if (error.message.includes('No authenticated session')) {
      showStatus('Session expired. Please sign in again.', 'error');
      isAuthenticated = false;
      showLoginUI();
    } else {
      showStatus(`Error: ${error.message}`, 'error');
    }
  } finally {
    setLoading(false);
    saveButtonEl.disabled = false;
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

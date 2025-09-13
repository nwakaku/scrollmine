// Content script for ScrollMine extension
// Captures selected text and page information

let selectedText = '';
let pageContent = '';
let floatingBubble = null;
let chatPopup = null;
let bubblePosition = { x: 0, y: 0 };
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let isSaving = false; // Prevent duplicate saves
let isChatOpen = false;

// Initialize floating bubble
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFloatingBubble);
} else {
  // Document is already ready, initialize immediately
  initializeFloatingBubble();
}

// Listen for text selection
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('keyup', handleTextSelection);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSelectedText') {
    sendResponse({ selectedText });
  } else if (message.action === 'getPageContent') {
    sendResponse({ pageContent: extractPageContent() });
  } else if (message.action === 'toggleBubble') {
    handleBubbleToggle(message.enabled);
  }
});

function handleTextSelection() {
  const selection = window.getSelection();
  if (selection && selection.toString().trim()) {
    selectedText = selection.toString().trim();
    
    // Notify popup if it's open
    chrome.runtime.sendMessage({
      action: 'updateSelectedText',
      selectedText
    });
  }
}

// Enhanced page information extraction
function getPageMetadata() {
  const metadata = {
    title: document.title,
    url: window.location.href,
    description: '',
    author: '',
    publishedDate: '',
    tags: []
  };

  // Get meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metadata.description = metaDesc.getAttribute('content') || '';
  }

  // Get Open Graph description
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && !metadata.description) {
    metadata.description = ogDesc.getAttribute('content') || '';
  }

  // Get author
  const authorMeta = document.querySelector('meta[name="author"]') || 
                    document.querySelector('meta[property="article:author"]');
  if (authorMeta) {
    metadata.author = authorMeta.getAttribute('content') || '';
  }

  // Get published date
  const dateMeta = document.querySelector('meta[property="article:published_time"]') ||
                   document.querySelector('meta[name="date"]');
  if (dateMeta) {
    metadata.publishedDate = dateMeta.getAttribute('content') || '';
  }

  // Extract tags/keywords
  const keywordsMeta = document.querySelector('meta[name="keywords"]');
  if (keywordsMeta) {
    const keywords = keywordsMeta.getAttribute('content');
    if (keywords) {
      metadata.tags = keywords.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
  }

  return metadata;
}

// Extract actual page content for AI processing
function extractPageContent() {
  // Try to find the main content area
  const selectors = [
    'main',
    'article',
    '[role="main"]',
    '.content',
    '.post-content',
    '.entry-content',
    '.article-content',
    '.main-content',
    '.post-body',
    '.article-body',
    '.story-body',
    '.post-text'
  ];
  
  let content = '';
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      content = element.textContent.trim();
      if (content.length > 200) {
        break; // Found substantial content
      }
    }
  }
  
  // If no main content found, try body but filter out navigation, footer, etc.
  if (!content || content.length < 200) {
    const body = document.body;
    if (body) {
      // Clone body to avoid modifying the original
      const clone = body.cloneNode(true);
      
      // Remove common non-content elements
      const elementsToRemove = clone.querySelectorAll('nav, header, footer, .nav, .header, .footer, .sidebar, .menu, .advertisement, .ads, script, style, iframe, .social-share, .comments');
      elementsToRemove.forEach(el => el.remove());
      
      content = clone.textContent.trim();
    }
  }
  
  // Clean up the content
  content = content
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .trim();
  
  // Limit content length to avoid token limits
  if (content.length > 3000) {
    content = content.substring(0, 3000) + '...';
  }
  
  return content;
}

// Enhanced content type detection
function detectContentType() {
  const url = window.location.href.toLowerCase();
  const hostname = window.location.hostname.toLowerCase();
  
  // Social media platforms
  if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    return 'tweet';
  }
  
  if (hostname.includes('linkedin.com')) {
    return 'article';
  }
  
  if (hostname.includes('facebook.com')) {
    return 'article';
  }
  
  if (hostname.includes('instagram.com')) {
    return 'article';
  }
  
  // Video platforms
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
    return 'video';
  }
  
  if (hostname.includes('vimeo.com')) {
    return 'video';
  }
  
  // News and blog platforms
  if (hostname.includes('medium.com')) {
    return 'article';
  }
  
  if (hostname.includes('substack.com')) {
    return 'article';
  }
  
  // Default to article for most web pages
  return 'article';
}

// Listen for extension installation/update
chrome.runtime.onInstalled.addListener(() => {
  console.log('ScrollMine extension installed/updated');
});

// Floating Bubble Functions
function initializeFloatingBubble() {
  // Check if bubble should be enabled
  chrome.storage.local.get(['bubbleEnabled'], (result) => {
    if (result.bubbleEnabled !== false) { // Default to enabled
      createFloatingBubble();
    }
  });
}

function createFloatingBubble() {
  // Remove existing bubble if any
  if (floatingBubble) {
    floatingBubble.remove();
  }

  // Create bubble element
  floatingBubble = document.createElement('div');
  floatingBubble.id = 'scrollmine-floating-bubble';
  floatingBubble.innerHTML = `
    <div class="bubble-icon">📝</div>
    <div class="bubble-menu" style="display: none;">
      <div class="menu-item" data-action="save-page">Save Page</div>
      <div class="menu-item" data-action="save-selection">Save Selection</div>
      <div class="menu-item" data-action="expand-draft">Expand into Draft</div>
      <div class="menu-item" data-action="ask-scrollmine">Ask Scrollmine</div>
    </div>
  `;

  // Add CSS styles
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
    
    #scrollmine-floating-bubble {
      position: fixed;
      width: 44px;
      height: 44px;
      background: #2563eb;
      border-radius: 12px;
      cursor: pointer;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
      transition: all 0.2s ease;
      opacity: 0.7;
      user-select: none;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    #scrollmine-floating-bubble:hover {
      opacity: 1;
      transform: scale(1.05);
      box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
      background: #1d4ed8;
    }

    #scrollmine-floating-bubble.dragging {
      opacity: 0.8;
      transform: scale(1.02);
    }

    .bubble-icon {
      font-size: 20px;
      color: white;
      font-weight: 500;
    }

    .bubble-menu {
      position: absolute;
      bottom: 56px;
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      min-width: 180px;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.06);
      backdrop-filter: blur(8px);
    }

    .menu-item {
      padding: 14px 18px;
      cursor: pointer;
      font-size: 14px;
      color: #374151;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
      transition: all 0.2s ease;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 400;
    }

    .menu-item:last-child {
      border-bottom: none;
    }

    .menu-item:hover {
      background-color: #f3f4f6;
      color: #2563eb;
    }

    .scrollmine-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2563eb;
      color: white;
      padding: 14px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
      z-index: 2147483648;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      font-weight: 500;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .scrollmine-toast.show {
      opacity: 1;
      transform: translateX(0);
    }

    .scrollmine-toast.error {
      background: #dc2626;
      box-shadow: 0 4px 16px rgba(220, 38, 38, 0.2);
    }

    /* Chat Popup Styles */
    #scrollmine-chat-popup {
      position: fixed;
      width: 320px;
      height: 400px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      z-index: 2147483648;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(8px);
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
      opacity: 0;
      transform: scale(0.9) translateY(10px);
      transition: all 0.3s ease;
    }

    #scrollmine-chat-popup.show {
      opacity: 1;
      transform: scale(1) translateY(0);
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      background: #f8fafc;
      border-radius: 16px 16px 0 0;
    }

    .chat-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .chat-close-btn {
      background: none;
      border: none;
      font-size: 20px;
      color: #6b7280;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .chat-close-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      background: #f9fafb;
    }

    .quick-action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      color: #374151;
      transition: all 0.2s ease;
      font-family: 'Poppins', sans-serif;
    }

    .quick-action-btn:hover {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
      transform: translateY(-1px);
    }

    .action-icon {
      font-size: 14px;
    }

    .action-text {
      white-space: nowrap;
    }

    .chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .message {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .message.user {
      align-items: flex-end;
    }

    .message.assistant {
      align-items: flex-start;
    }

    .message-content {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .message.user .message-content {
      background: #2563eb;
      color: white;
      border-radius: 12px 12px 4px 12px;
    }

    .message.assistant .message-content {
      background: #f3f4f6;
      color: #374151;
      border-radius: 12px 12px 12px 4px;
    }

    .save-draft-btn {
      background: #10b981;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Poppins', sans-serif;
    }

    .save-draft-btn:hover {
      background: #059669;
      transform: translateY(-1px);
    }

    .chat-input-container {
      display: flex;
      padding: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      gap: 8px;
    }

    #chat-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      font-family: 'Poppins', sans-serif;
      outline: none;
      transition: border-color 0.2s ease;
      background: white;
      color: #374151;
    }

    #chat-input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    #chat-input::placeholder {
      color: #9ca3af;
    }

    .send-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .send-btn:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    /* Responsive adjustments */
    @media (max-width: 400px) {
      #scrollmine-chat-popup {
        width: 280px;
        height: 350px;
      }
      
      .quick-actions {
        padding: 8px 12px;
      }
      
      .quick-action-btn {
        padding: 6px 10px;
        font-size: 11px;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(floatingBubble);

  // Load saved position
  loadBubblePosition();

  // Set up event listeners
  setupBubbleEventListeners();
}

function setupBubbleEventListeners() {
  if (!floatingBubble) {
    console.log('No floating bubble to attach events to');
    return;
  }

  console.log('Setting up bubble event listeners');

  // Click handler
  floatingBubble.addEventListener('click', handleBubbleClick);
  console.log('Click handler attached');

  // Right click handler
  floatingBubble.addEventListener('contextmenu', handleBubbleRightClick);

  // Double click handler
  floatingBubble.addEventListener('dblclick', handleBubbleDoubleClick);

  // Drag handlers
  floatingBubble.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', endDrag);

  // Menu item handlers
  const menuItems = floatingBubble.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      handleMenuAction(item.dataset.action);
    });
  });

  // Hide menu when clicking outside
  document.addEventListener('click', hideBubbleMenu);
}

function handleBubbleClick(e) {
  console.log('Bubble clicked!', e);
  e.preventDefault();
  e.stopPropagation();
  
  if (isDragging) {
    console.log('Ignoring click - currently dragging');
    return;
  }

  // Show menu on single click
  toggleBubbleMenu();
}

function handleBubbleRightClick(e) {
  e.preventDefault();
  e.stopPropagation();
  toggleBubbleMenu();
}

function handleBubbleDoubleClick(e) {
  e.preventDefault();
  e.stopPropagation();
  openMiniComposer();
}

function startDrag(e) {
  if (e.button !== 0) return; // Only left mouse button
  
  isDragging = true;
  floatingBubble.classList.add('dragging');
  
  const rect = floatingBubble.getBoundingClientRect();
  dragOffset.x = e.clientX - rect.left;
  dragOffset.y = e.clientY - rect.top;
  
  e.preventDefault();
}

function handleDrag(e) {
  if (!isDragging) return;
  
  e.preventDefault();
  
  const newX = e.clientX - dragOffset.x;
  const newY = e.clientY - dragOffset.y;
  
  // Constrain to viewport
  const maxX = window.innerWidth - 40;
  const maxY = window.innerHeight - 40;
  
  bubblePosition.x = Math.max(0, Math.min(newX, maxX));
  bubblePosition.y = Math.max(0, Math.min(newY, maxY));
  
  updateBubblePosition();
}

function endDrag() {
  if (!isDragging) return;
  
  isDragging = false;
  floatingBubble.classList.remove('dragging');
  
  // Save position
  saveBubblePosition();
}

function updateBubblePosition() {
  if (floatingBubble) {
    floatingBubble.style.left = bubblePosition.x + 'px';
    floatingBubble.style.top = bubblePosition.y + 'px';
  }
}

function loadBubblePosition() {
  chrome.storage.local.get(['bubblePosition'], (result) => {
    if (result.bubblePosition) {
      bubblePosition = result.bubblePosition;
    } else {
      // Default position: bottom-right
      bubblePosition = {
        x: window.innerWidth - 60,
        y: window.innerHeight - 60
      };
    }
    updateBubblePosition();
  });
}

function saveBubblePosition() {
  chrome.storage.local.set({ bubblePosition });
}

function toggleBubbleMenu() {
  const menu = floatingBubble.querySelector('.bubble-menu');
  if (menu.style.display === 'none') {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
}

function hideBubbleMenu() {
  if (floatingBubble) {
    const menu = floatingBubble.querySelector('.bubble-menu');
    menu.style.display = 'none';
  }
}

function handleMenuAction(action) {
  hideBubbleMenu();
  
  switch (action) {
    case 'save-page':
      savePage();
      break;
    case 'save-selection':
      saveSelection();
      break;
    case 'expand-draft':
      openMiniComposer();
      break;
    case 'ask-scrollmine':
      openChatPopup();
      break;
  }
}

function savePage() {
  if (isSaving) {
    console.log('Already saving, ignoring duplicate call');
    return;
  }
  
  isSaving = true;
  console.log('savePage() called');
  
  const pageData = {
    url: window.location.href,
    title: document.title,
    snippet: '',
    content: extractPageContent(),
    tags: [],
    type: detectContentType()
  };

  console.log('Page data:', pageData);

  // Use direct save method instead of message passing
  saveContent(pageData).finally(() => {
    isSaving = false;
  });
}

function saveSelection() {
  if (isSaving) {
    console.log('Already saving, ignoring duplicate call');
    return;
  }
  
  isSaving = true;
  console.log('saveSelection() called');
  
  const selection = window.getSelection();
  if (!selection || !selection.toString().trim()) {
    console.log('No selection found');
    showToast('No text selected', 'error');
    isSaving = false;
    return;
  }

  const pageData = {
    url: window.location.href,
    title: document.title,
    snippet: selection.toString().trim(),
    content: extractPageContent(),
    tags: [],
    type: detectContentType()
  };

  console.log('Selection data:', pageData);

  // Use direct save method instead of message passing
  saveContent(pageData).finally(() => {
    isSaving = false;
  });
}

function openMiniComposer() {
  // Open popup programmatically
  chrome.runtime.sendMessage({ action: 'openPopup' });
}

function openAIQuickAnswer() {
  // For now, just open the main popup
  // In future versions, this could open a mini AI input
  chrome.runtime.sendMessage({ action: 'openPopup' });
}

function showToast(message, type = 'success') {
  // Remove existing toast
  const existingToast = document.querySelector('.scrollmine-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = `scrollmine-toast ${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto remove after 2 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }, 2000);
}

function handleBubbleToggle(enabled) {
  if (enabled) {
    if (!floatingBubble) {
      createFloatingBubble();
    }
  } else {
    if (floatingBubble) {
      floatingBubble.remove();
      floatingBubble = null;
    }
  }
}

// Proper save function that handles both authenticated and local modes
async function saveContent(data) {
  console.log('Saving content:', data);
  try {
    // Check if user is authenticated by checking for Supabase session
    const sessionResult = await chrome.storage.local.get(['supabase_session']);
    const session = sessionResult.supabase_session;
    
    if (session && session.expires_at && new Date(session.expires_at) > new Date()) {
      console.log('User authenticated, saving to Supabase');
      // User is authenticated, save to Supabase
      const supabaseUrl = window.ScrollMineConfig?.SUPABASE_URL || "https://vyxwxkexvveglzsxlwyc.supabase.co";
      const supabaseKey = window.ScrollMineConfig?.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5eHd4a2V4dnZlZ2x6c3hsd3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MTEzMTQsImV4cCI6MjA3MjE4NzMxNH0.M1BkwS_2PoH4wGwLQtpCKcvMyvqgpIrkn3H3R1j6lxs";
      
      const response = await fetch(`${supabaseUrl}/rest/v1/saved_items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
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
        console.log('Successfully saved to Supabase');
        showToast('Saved to Scrollmine ✅');
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
      
      savedItems.unshift(newItem);
      await chrome.storage.local.set({ savedItems });
      
      console.log('Successfully saved to local storage');
      showToast('Saved to local storage');
    }
  } catch (error) {
    console.error('Save error:', error);
    showToast('Failed to save content', 'error');
  }
}

// Chat Popup Functions
function openChatPopup() {
  if (chatPopup) {
    closeChatPopup();
  }
  
  isChatOpen = true;
  createChatPopup();
}

function closeChatPopup() {
  if (chatPopup) {
    chatPopup.classList.remove('show');
    setTimeout(() => {
      if (chatPopup) {
        chatPopup.remove();
        chatPopup = null;
      }
    }, 300);
  }
  isChatOpen = false;
}

function createChatPopup() {
  // Remove existing popup
  if (chatPopup) {
    chatPopup.remove();
  }

  // Detect if we're on a social media platform
  const isSocialMedia = detectSocialMediaPlatform();
  const socialActions = isSocialMedia ? `
    <button class="quick-action-btn" data-action="suggest-comment">
      <span class="action-icon">💬</span>
      <span class="action-text">Suggest Reply</span>
    </button>
  ` : '';

  // Create chat popup element
  chatPopup = document.createElement('div');
  chatPopup.id = 'scrollmine-chat-popup';
  chatPopup.innerHTML = `
    <div class="chat-header">
      <div class="chat-title">Ask Scrollmine</div>
      <button class="chat-close-btn" id="close-chat">×</button>
    </div>
    
    <div class="quick-actions">
      <button class="quick-action-btn" data-action="summarize">
        <span class="action-icon">📝</span>
        <span class="action-text">Summarize</span>
      </button>
      <button class="quick-action-btn" data-action="expand-draft">
        <span class="action-icon">✍️</span>
        <span class="action-text">Expand Draft</span>
      </button>
      <button class="quick-action-btn" data-action="explain">
        <span class="action-icon">💡</span>
        <span class="action-text">Explain</span>
      </button>
      <button class="quick-action-btn" data-action="relate">
        <span class="action-icon">🔗</span>
        <span class="action-text">Relate</span>
      </button>
      ${socialActions}
    </div>
    
    <div class="chat-messages" id="chat-messages">
      <div class="message assistant">
        <div class="message-content">
          Hi! I've captured this page context. What would you like me to help you with?
        </div>
      </div>
    </div>
    
    <div class="chat-input-container">
      <input type="text" id="chat-input" placeholder="Ask me anything about this page..." />
      <button id="send-message" class="send-btn">→</button>
    </div>
  `;

  // Position the chat popup
  positionChatPopup();
  
  // Add to document
  document.body.appendChild(chatPopup);
  
  // Trigger animation
  setTimeout(() => {
    chatPopup.classList.add('show');
  }, 10);
  
  // Set up event listeners
  setupChatEventListeners();
  
  // Auto-capture page context
  capturePageContext();
}

function positionChatPopup() {
  if (!chatPopup || !floatingBubble) return;
  
  const bubbleRect = floatingBubble.getBoundingClientRect();
  const popupWidth = 320;
  const popupHeight = 400;
  
  // Position above the bubble, centered
  let left = bubbleRect.left + (bubbleRect.width / 2) - (popupWidth / 2);
  let top = bubbleRect.top - popupHeight - 10;
  
  // Ensure popup stays within viewport
  if (left < 10) left = 10;
  if (left + popupWidth > window.innerWidth - 10) {
    left = window.innerWidth - popupWidth - 10;
  }
  if (top < 10) {
    top = bubbleRect.bottom + 10;
  }
  
  chatPopup.style.left = left + 'px';
  chatPopup.style.top = top + 'px';
}

function setupChatEventListeners() {
  if (!chatPopup) return;
  
  // Close button
  const closeBtn = chatPopup.querySelector('#close-chat');
  closeBtn.addEventListener('click', closeChatPopup);
  
  // Send button and Enter key
  const sendBtn = chatPopup.querySelector('#send-message');
  const chatInput = chatPopup.querySelector('#chat-input');
  
  sendBtn.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });
  
  // Quick action buttons
  const quickActions = chatPopup.querySelectorAll('.quick-action-btn');
  quickActions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.currentTarget.dataset.action;
      handleQuickAction(action);
    });
  });
  
  // Focus input
  setTimeout(() => {
    chatInput.focus();
  }, 100);
  
  // Close on outside click
  document.addEventListener('click', handleOutsideClick);
}

function handleOutsideClick(e) {
  if (chatPopup && !chatPopup.contains(e.target) && !floatingBubble.contains(e.target)) {
    closeChatPopup();
  }
}

function hideQuickActions() {
  if (chatPopup) {
    const quickActions = chatPopup.querySelector('.quick-actions');
    if (quickActions) {
      quickActions.style.display = 'none';
    }
  }
}

function capturePageContext() {
  const context = {
    url: window.location.href,
    title: document.title,
    selectedText: window.getSelection().toString().trim(),
    platform: detectSocialMediaPlatform(),
    content: extractPageContent()
  };
  
  console.log('Captured page context:', context);
  return context;
}

function detectSocialMediaPlatform() {
  const hostname = window.location.hostname.toLowerCase();
  
  if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    return 'twitter';
  }
  if (hostname.includes('linkedin.com')) {
    return 'linkedin';
  }
  if (hostname.includes('facebook.com')) {
    return 'facebook';
  }
  if (hostname.includes('instagram.com')) {
    return 'instagram';
  }
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
    return 'youtube';
  }
  
  return null;
}

function handleQuickAction(action) {
  const context = capturePageContext();
  let prompt = '';
  
  switch (action) {
    case 'summarize':
      prompt = `Summarize this page content in 2-3 key points: ${context.title}`;
      break;
    case 'expand-draft':
      prompt = `Create a social media draft post based on this content: ${context.title}`;
      break;
    case 'explain':
      prompt = `Explain this content in simple terms that anyone can understand: ${context.title}`;
      break;
    case 'relate':
      prompt = `How does this content relate to current trends or similar topics? ${context.title}`;
      break;
    case 'suggest-comment':
      prompt = `Suggest 2-3 smart replies or comments for this ${context.platform} post: ${context.title}`;
      break;
  }
  
  if (prompt) {
    // Hide quick actions once user clicks a quick action
    hideQuickActions();
    
    addMessageToChat('user', prompt);
    processAIRequest(prompt, context);
  }
}

function sendChatMessage() {
  const chatInput = chatPopup.querySelector('#chat-input');
  const message = chatInput.value.trim();
  
  if (!message) return;
  
  // Hide quick actions once user starts chatting
  hideQuickActions();
  
  addMessageToChat('user', message);
  chatInput.value = '';
  
  const context = capturePageContext();
  processAIRequest(message, context);
}

function addMessageToChat(sender, content) {
  const messagesContainer = chatPopup.querySelector('#chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  
  messageDiv.innerHTML = `
    <div class="message-content">${content}</div>
    ${sender === 'assistant' ? '<button class="save-draft-btn">Save as Draft</button>' : ''}
  `;
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Add save draft functionality
  if (sender === 'assistant') {
    const saveBtn = messageDiv.querySelector('.save-draft-btn');
    saveBtn.addEventListener('click', () => {
      saveAsDraft(content);
    });
  }
}

async function processAIRequest(prompt, context) {
  addMessageToChat('assistant', 'Thinking...');
  
  try {
    // Prepare the context for Gemini
    const fullPrompt = `Context: ${context.title}
URL: ${context.url}
${context.selectedText ? `Selected Text: ${context.selectedText}` : ''}
${context.content ? `Page Content: ${context.content.substring(0, 2000)}...` : ''}

User Request: ${prompt}

Please provide a helpful response based on the above context.`;

    // Get API key from config
    const apiKey = window.ScrollMineConfig?.GEMINI_API_KEY || "AIzaSyArypaJ4XUwK3OPei40wPOz2pEY8FGg1jY";

    // Send to Gemini API using the new endpoint structure
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t generate a response.';
      
      // Replace "Thinking..." with actual response
      const messages = chatPopup.querySelectorAll('.message.assistant');
      const lastMessage = messages[messages.length - 1];
      lastMessage.innerHTML = `
        <div class="message-content">${aiResponse}</div>
        <button class="save-draft-btn">Save as Draft</button>
      `;
      
      // Add save functionality
      const saveBtn = lastMessage.querySelector('.save-draft-btn');
      saveBtn.addEventListener('click', () => {
        saveAsDraft(aiResponse);
      });
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get AI response');
    }
  } catch (error) {
    console.error('AI request failed:', error);
    // Replace "Thinking..." with error message
    const messages = chatPopup.querySelectorAll('.message.assistant');
    const lastMessage = messages[messages.length - 1];
    lastMessage.innerHTML = `<div class="message-content">Sorry, I couldn't process that request: ${error.message}</div>`;
  }
}

function saveAsDraft(content) {
  const draftData = {
    url: window.location.href,
    title: document.title,
    snippet: content,
    content: content,
    tags: ['draft'],
    type: 'draft'
  };
  
  saveContent(draftData);
  showToast('Draft saved! ✅');
}

// Export functions for potential use
window.ScrollMine = {
  getPageMetadata,
  detectContentType,
  extractPageContent,
  getSelectedText: () => selectedText
};

// Content script for ScrollMine extension
// Captures selected text and page information

let selectedText = '';
let pageContent = '';

// Listen for text selection
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('keyup', handleTextSelection);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSelectedText') {
    sendResponse({ selectedText });
  } else if (message.action === 'getPageContent') {
    sendResponse({ pageContent: extractPageContent() });
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

// Export functions for potential use
window.ScrollMine = {
  getPageMetadata,
  detectContentType,
  extractPageContent,
  getSelectedText: () => selectedText
};

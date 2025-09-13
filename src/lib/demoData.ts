import { localStorageUtils } from './localStorage'

export const demoData = {
  addSampleItems: () => {
    const sampleItems = [
      {
        title: "The Future of AI in Content Creation",
        url: "https://example.com/ai-content-creation",
        snippet: "Discover how artificial intelligence is revolutionizing the way we create and consume content across digital platforms.",
        content: "Artificial intelligence has transformed content creation in unprecedented ways. From automated writing assistants to intelligent content curation, AI tools are becoming indispensable for creators and marketers alike. This article explores the latest developments and what the future holds for AI-powered content creation.",
        tags: ["AI", "content creation", "technology", "marketing"],
        type: "article"
      },
      {
        title: "10 Social Media Marketing Tips for 2024",
        url: "https://example.com/social-media-tips",
        snippet: "Learn the most effective social media marketing strategies that are driving engagement and conversions this year.",
        content: "Social media marketing continues to evolve rapidly. In 2024, successful strategies include leveraging short-form video content, building authentic community connections, and utilizing AI-powered analytics. This comprehensive guide covers everything you need to know.",
        tags: ["social media", "marketing", "tips", "2024"],
        type: "article"
      },
      {
        title: "Just launched our new AI-powered content tool! 🚀",
        url: "https://twitter.com/example/status/123456789",
        snippet: "Excited to share that we've just released our latest AI-powered content generation tool. It's designed to help creators save time while maintaining quality.",
        content: "Just launched our new AI-powered content tool! 🚀\n\n✨ Key features:\n• Smart content suggestions\n• Multi-platform optimization\n• Real-time analytics\n• Seamless integration\n\nTry it free: example.com/tool\n\n#AI #ContentCreation #ProductLaunch",
        tags: ["AI", "product launch", "content creation"],
        type: "tweet"
      },
      {
        title: "How to Build a Personal Brand on LinkedIn",
        url: "https://example.com/linkedin-personal-brand",
        snippet: "A step-by-step guide to building a strong personal brand on LinkedIn that attracts opportunities and grows your network.",
        content: "Building a personal brand on LinkedIn requires consistency, authenticity, and strategic content planning. This guide walks you through creating compelling profiles, sharing valuable content, and networking effectively to establish yourself as a thought leader in your industry.",
        tags: ["LinkedIn", "personal branding", "networking", "career"],
        type: "article"
      },
      {
        title: "Behind the Scenes: Our Content Creation Process",
        url: "https://example.com/content-process",
        snippet: "Take a peek behind the curtain to see how our team creates engaging content from ideation to publication.",
        content: "Ever wondered how professional content creators work? We're pulling back the curtain to show you our complete content creation process, from initial brainstorming sessions to final publication and performance analysis.",
        tags: ["content creation", "behind the scenes", "process", "team"],
        type: "video"
      }
    ]

    sampleItems.forEach(item => {
      localStorageUtils.saveItem(item)
    })

    return sampleItems.length
  },

  addSampleGeneratedContent: () => {
    const sampleContent = [
      {
        platform: "twitter",
        content: "🚀 Just discovered an amazing AI tool that's revolutionizing content creation!\n\n✨ Key benefits:\n• Saves hours of work\n• Improves quality\n• Multi-platform ready\n\nPerfect for creators and marketers looking to scale their content strategy.\n\n#AI #ContentCreation #Productivity #Marketing",
        item_ids: ["local_1", "local_2"]
      },
      {
        platform: "linkedin",
        content: "The landscape of content creation is evolving rapidly, and AI is at the forefront of this transformation.\n\nKey insights from recent research:\n\n• 73% of marketers report increased efficiency with AI tools\n• Content quality has improved by 40% on average\n• Time savings of 6-8 hours per week per creator\n\nAs we move into 2024, the integration of AI in content strategies isn't just an advantage—it's becoming essential for staying competitive.\n\nWhat's your experience with AI-powered content creation? I'd love to hear your thoughts in the comments below.\n\n#ContentCreation #AI #Marketing #DigitalTransformation",
        item_ids: ["local_1"]
      },
      {
        platform: "instagram",
        content: "✨ The future of content creation is here! 🚀\n\nJust spent the day exploring some incredible AI tools that are changing the game for creators everywhere. The possibilities are endless! 💫\n\nFrom automated writing to smart content optimization, these tools are helping us work smarter, not harder. 📈\n\nWhat's your favorite AI tool for content creation? Drop your recommendations below! 👇\n\n#AIContent #ContentCreation #CreatorEconomy #Innovation #TechTrends",
        item_ids: ["local_3", "local_4"]
      }
    ]

    sampleContent.forEach(content => {
      localStorageUtils.saveGeneratedContent(content)
    })

    return sampleContent.length
  },

  clearAllData: () => {
    localStorage.removeItem('scrollmine_saved_items')
    localStorage.removeItem('scrollmine_generated_content')
    localStorage.removeItem('scrollmine_user_preferences')
  },

  getDataStats: () => {
    const items = localStorageUtils.getSavedItems()
    const content = localStorageUtils.getGeneratedContent()
    
    return {
      savedItems: items.length,
      generatedContent: content.length,
      favorites: items.filter(item => item.is_favorite).length,
      totalUsage: items.reduce((sum, item) => sum + item.usage_count, 0)
    }
  }
}

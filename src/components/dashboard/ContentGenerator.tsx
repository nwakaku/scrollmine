import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Copy, Save, Trash2, Sparkles } from 'lucide-react';

interface SavedItem {
  id: string;
  title: string;
  url: string;
  snippet?: string;
  content?: string; // Actual page content for AI processing
  tags: string[];
  type: string;
  created_at: string;
}

interface GeneratedContent {
  id: string;
  platform: string;
  content: string;
  timestamp: string;
}

type Platform = 'twitter' | 'linkedin' | 'instagram' | 'general';

const ContentGenerator: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [platform, setPlatform] = useState<Platform>('twitter');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load saved items');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  }

  const generateContent = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to generate content from');
      return;
    }

    setGenerating(true);
    try {
      const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
      
      // Generate content using server-side AI
      const generatedContent = await generateAIContent(selectedItemsData, platform);
      
      // Update usage count and last_used_at for selected items
      await updateItemUsage(selectedItems);
      
      // Save to Supabase
      const { error } = await supabase
        .from('generated_contents')
        .insert({
          user_id: user?.id,
          item_ids: selectedItems,
          draft_text: generatedContent,
          platform: platform,
          is_final: false
        });

      if (error) throw error;
      
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        platform,
        content: generatedContent,
        timestamp: new Date().toISOString()
      };

      setGeneratedContent(prev => [newContent, ...prev]);
      toast.success('Content generated successfully!');
    } catch (error: any) {
      toast.error('Failed to generate content');
      console.error('Error generating content:', error);
    } finally {
      setGenerating(false);
    }
  };

  const updateItemUsage = async (itemIds: string[]) => {
    try {
      const now = new Date().toISOString();
      
      // Get current items to update their usage count
      const { data: currentItems, error: fetchError } = await supabase
        .from('saved_items')
        .select('id, usage_count')
        .in('id', itemIds);

      if (fetchError) throw fetchError;

      // Update each selected item's usage count and last_used_at
      for (const item of currentItems || []) {
        const { error } = await supabase
          .from('saved_items')
          .update({ 
            usage_count: item.usage_count + 1,
            last_used_at: now
          })
          .eq('id', item.id);

        if (error) {
          console.error('Error updating usage for item:', item.id, error);
        }
      }
    } catch (error) {
      console.error('Error updating item usage:', error);
    }
  };

  const generateAIContent = async (items: SavedItem[], platform: string): Promise<string> => {
    // Prepare content for AI processing
    const contentForAI = items.map(item => {
      let itemContent = `Title: ${item.title}\n`;
      if (item.snippet) itemContent += `Snippet: ${item.snippet}\n`;
      if (item.content) itemContent += `Content: ${item.content.substring(0, 1000)}...\n`;
      if (item.tags && item.tags.length > 0) itemContent += `Tags: ${item.tags.join(', ')}\n`;
      return itemContent;
    }).join('\n---\n');

    // Create platform-specific prompts
    const platformPrompts = {
      twitter: `Create an engaging Twitter post based on this content. Make it conversational, include relevant hashtags, and keep it under 280 characters. Focus on the most interesting insights and make it shareable.`,
      linkedin: `Create a professional LinkedIn post based on this content. Make it insightful, include bullet points for key takeaways, and encourage professional discussion. Keep it professional but engaging.`,
      instagram: `Create an Instagram caption based on this content. Make it visually descriptive, include emojis, and encourage engagement. Focus on inspiration and community.`,
      general: `Create a general social media post based on this content. Make it engaging and shareable across different platforms. Include key insights and encourage discussion.`
    };

    const prompt = `${platformPrompts[platform as keyof typeof platformPrompts]}

Content to analyze:
${contentForAI}

Generate a ${platform} post:`;

    try {
      // Get API key from environment variable (must be prefixed with VITE_ for Vite)
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!geminiApiKey) {
        throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file');
      }

      // Call Gemini 2.0 Flash API directly from frontend
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': geminiApiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`AI generation error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        throw new Error('No content generated from AI');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      throw new Error('Failed to generate AI content');
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Content copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };

  const saveAsFinal = async (content: GeneratedContent) => {
    try {
      const { error } = await supabase
        .from('generated_contents')
        .insert({
          user_id: user?.id,
          item_ids: selectedItems,
          draft_text: content.content,
          platform: content.platform,
          is_final: true
        });

      if (error) throw error;
      
      toast.success('Content saved as final!');
    } catch (error: any) {
      toast.error('Failed to save content');
      console.error('Error saving content:', error);
    }
  };

  const removeGeneratedContent = (id: string) => {
    setGeneratedContent(prev => prev.filter(content => content.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return '📄';
      case 'tweet':
        return '🐦';
      case 'video':
        return '🎥';
      default:
        return '🔗';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Platform Selection */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Platform</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'twitter', name: 'Twitter', color: 'bg-blue-500' },
            { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700' },
            { id: 'instagram', name: 'Instagram', color: 'bg-pink-500' },
            { id: 'general', name: 'General', color: 'bg-gray-500' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id as any)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                platform === p.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-8 h-8 ${p.color} rounded-full mx-auto mb-2`}></div>
              <span className="text-sm font-medium text-gray-900">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Item Selection */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Content to Generate From</h2>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No saved items found. Save some content first!</p>
        ) : (
          <div className="grid gap-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItemSelection(item.id)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedItems.includes(item.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{getTypeIcon(item.type)}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{item.url}</p>
                    {item.snippet && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.snippet}</p>
                    )}
                    {item.content && (
                      <p className="text-xs text-gray-400 mt-1">
                        Content available for AI processing
                      </p>
                  )}
                </div>
                </div>
                  </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="card">
        <button
          onClick={generateContent}
          disabled={selectedItems.length === 0 || generating}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate AI Content
            </>
          )}
        </button>
      </div>

      {/* Generated Content */}
      {generatedContent.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Content</h2>
        <div className="space-y-4">
            {generatedContent.map((content) => (
              <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {content.platform}
                    </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(content.content)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => saveAsFinal(content)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Save as final"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeGeneratedContent(content.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-3 whitespace-pre-wrap text-sm">
                    {content.content}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Generated at {new Date(content.timestamp).toLocaleString()}
                </div>
                </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;

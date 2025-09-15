import React, { useState, useEffect } from 'react';
import { localStorageUtils, LocalSavedItem, LocalGeneratedContent } from '@/lib/localStorage';
import { toast } from 'react-hot-toast';
import { Copy, Trash2, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Platform = 'twitter' | 'linkedin' | 'instagram' | 'general';

const LocalContentGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<LocalSavedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [platform, setPlatform] = useState<Platform>('twitter');
  const [generatedContent, setGeneratedContent] = useState<LocalGeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
    fetchGeneratedContent();
  }, []);

  const fetchItems = () => {
    try {
      const data = localStorageUtils.getSavedItems();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load saved items');
    } finally {
      setLoading(false);
    }
  };

  const fetchGeneratedContent = () => {
    try {
      const data = localStorageUtils.getGeneratedContent();
      setGeneratedContent(data);
    } catch (error) {
      console.error('Error fetching generated content:', error);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  }

  const handleGenerateClick = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to generate content from');
      return;
    }

    // Show upgrade prompt instead of generating
    toast.error('Content generation requires a full account. Please sign up to unlock this feature!');
    navigate('/');
  };


  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Content copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };

  const removeGeneratedContent = (id: string) => {
    try {
      const success = localStorageUtils.deleteGeneratedContent(id);
      if (success) {
        setGeneratedContent(prev => prev.filter(content => content.id !== id));
        toast.success('Content removed successfully');
      } else {
        toast.error('Failed to remove content');
      }
    } catch (error) {
      toast.error('Failed to remove content');
    }
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
      {/* Local Storage Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800">
              Limited Functionality - Local Mode
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              Content generation requires a full account. Your generated content is stored locally and will be lost if you clear your browser data.
              <button 
                onClick={() => navigate('/')}
                className="font-medium underline hover:no-underline ml-1"
              >
                Sign up for full access
              </button>
              {' '}to unlock AI content generation and sync across devices.
            </p>
          </div>
        </div>
      </div>

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
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No saved items found. Save some content first!</p>
            <button 
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Get Started
            </button>
          </div>
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
          onClick={handleGenerateClick}
          disabled={selectedItems.length === 0}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Upgrade to Generate AI Content
          <ArrowRight className="w-4 h-4" />
        </button>
        {selectedItems.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-2">
            Select at least one item to continue
          </p>
        )}
      </div>

      {/* Previously Generated Content */}
      {generatedContent.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Previously Generated Content</h2>
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

      {/* Upgrade CTA */}
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unlock Full AI Content Generation
          </h3>
          <p className="text-gray-600 mb-4">
            Get unlimited AI-powered content generation, cross-device sync, and advanced features.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Sign Up for Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalContentGenerator;

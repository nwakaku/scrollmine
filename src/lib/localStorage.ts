export interface LocalSavedItem {
  id: string;
  title: string;
  url: string;
  snippet?: string;
  content?: string;
  tags: string[];
  type: string;
  created_at: string;
  is_favorite: boolean;
  usage_count: number;
  last_used_at?: string;
}

export interface LocalGeneratedContent {
  id: string;
  platform: string;
  content: string;
  timestamp: string;
  item_ids: string[];
}

const STORAGE_KEYS = {
  SAVED_ITEMS: 'scrollmine_saved_items',
  GENERATED_CONTENT: 'scrollmine_generated_content',
  USER_PREFERENCES: 'scrollmine_user_preferences'
};

export const localStorageUtils = {
  // Saved Items
  getSavedItems: (): LocalSavedItem[] => {
    try {
      const items = localStorage.getItem(STORAGE_KEYS.SAVED_ITEMS);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error reading saved items from localStorage:', error);
      return [];
    }
  },

  saveItem: (item: Omit<LocalSavedItem, 'id' | 'created_at' | 'is_favorite' | 'usage_count'>): LocalSavedItem => {
    const items = localStorageUtils.getSavedItems();
    const newItem: LocalSavedItem = {
      ...item,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      is_favorite: false,
      usage_count: 0
    };
    
    items.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.SAVED_ITEMS, JSON.stringify(items));
    return newItem;
  },

  updateItem: (id: string, updates: Partial<LocalSavedItem>): boolean => {
    const items = localStorageUtils.getSavedItems();
    const index = items.findIndex(item => item.id === id);
    
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.SAVED_ITEMS, JSON.stringify(items));
      return true;
    }
    return false;
  },

  deleteItem: (id: string): boolean => {
    const items = localStorageUtils.getSavedItems();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length !== items.length) {
      localStorage.setItem(STORAGE_KEYS.SAVED_ITEMS, JSON.stringify(filteredItems));
      return true;
    }
    return false;
  },

  toggleFavorite: (id: string): boolean => {
    const items = localStorageUtils.getSavedItems();
    const item = items.find(i => i.id === id);
    
    if (item) {
      item.is_favorite = !item.is_favorite;
      localStorage.setItem(STORAGE_KEYS.SAVED_ITEMS, JSON.stringify(items));
      return true;
    }
    return false;
  },

  incrementUsage: (id: string): boolean => {
    const items = localStorageUtils.getSavedItems();
    const item = items.find(i => i.id === id);
    
    if (item) {
      item.usage_count += 1;
      item.last_used_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.SAVED_ITEMS, JSON.stringify(items));
      return true;
    }
    return false;
  },

  // Generated Content
  getGeneratedContent: (): LocalGeneratedContent[] => {
    try {
      const content = localStorage.getItem(STORAGE_KEYS.GENERATED_CONTENT);
      return content ? JSON.parse(content) : [];
    } catch (error) {
      console.error('Error reading generated content from localStorage:', error);
      return [];
    }
  },

  saveGeneratedContent: (content: Omit<LocalGeneratedContent, 'id' | 'timestamp'>): LocalGeneratedContent => {
    const contents = localStorageUtils.getGeneratedContent();
    const newContent: LocalGeneratedContent = {
      ...content,
      id: `local_gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    
    contents.unshift(newContent);
    localStorage.setItem(STORAGE_KEYS.GENERATED_CONTENT, JSON.stringify(contents));
    return newContent;
  },

  deleteGeneratedContent: (id: string): boolean => {
    const contents = localStorageUtils.getGeneratedContent();
    const filteredContents = contents.filter(content => content.id !== id);
    
    if (filteredContents.length !== contents.length) {
      localStorage.setItem(STORAGE_KEYS.GENERATED_CONTENT, JSON.stringify(filteredContents));
      return true;
    }
    return false;
  },

  // User Preferences
  getUserPreferences: () => {
    try {
      const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return prefs ? JSON.parse(prefs) : {};
    } catch (error) {
      console.error('Error reading user preferences from localStorage:', error);
      return {};
    }
  },

  saveUserPreferences: (preferences: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences to localStorage:', error);
    }
  },

  // Migration utilities
  migrateToSupabase: async (supabaseClient: any, userId: string) => {
    const localItems = localStorageUtils.getSavedItems();
    const localContent = localStorageUtils.getGeneratedContent();
    
    // Migrate saved items
    for (const item of localItems) {
      try {
        const { error } = await supabaseClient
          .from('saved_items')
          .insert({
            user_id: userId,
            title: item.title,
            url: item.url,
            snippet: item.snippet,
            content: item.content,
            tags: item.tags,
            type: item.type,
            is_favorite: item.is_favorite,
            usage_count: item.usage_count,
            last_used_at: item.last_used_at
          });
        
        if (error) {
          console.error('Error migrating item:', error);
        }
      } catch (error) {
        console.error('Error migrating item:', error);
      }
    }

    // Migrate generated content
    for (const content of localContent) {
      try {
        const { error } = await supabaseClient
          .from('generated_contents')
          .insert({
            user_id: userId,
            item_ids: content.item_ids,
            draft_text: content.content,
            platform: content.platform,
            is_final: false
          });
        
        if (error) {
          console.error('Error migrating generated content:', error);
        }
      } catch (error) {
        console.error('Error migrating generated content:', error);
      }
    }

    // Clear localStorage after successful migration
    localStorage.removeItem(STORAGE_KEYS.SAVED_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.GENERATED_CONTENT);
  }
};

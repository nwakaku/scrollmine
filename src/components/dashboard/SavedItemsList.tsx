import { useState, useEffect } from 'react'
import { supabase, SavedItem } from '@/lib/supabase'
import { useAuth } from '@/components/providers/AuthProvider'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  TagIcon,
  GlobeAltIcon,
  HeartIcon,
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

type SortOption = 'date_saved' | 'date_used' | 'usage_count' | 'favorites' | 'title'
type FilterOption = 'all' | 'favorites' | 'used' | 'unused' | 'article' | 'tweet' | 'video'

export function SavedItemsList() {
  const { user } = useAuth()
  const [items, setItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('date_saved')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (user) {
      fetchItems()
    }
  }, [user])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch saved items')
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setItems(prev => prev.filter(item => item.id !== id))
      setSelectedItems(prev => prev.filter(itemId => itemId !== id))
      toast.success('Item deleted successfully')
    } catch (error: any) {
      toast.error('Failed to delete item')
      console.error('Error deleting item:', error)
    }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const item = items.find(i => i.id === id)
      if (!item) return

      const { error } = await supabase
        .from('saved_items')
        .update({ is_favorite: !item.is_favorite })
        .eq('id', id)

      if (error) throw error
      
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
      ))
      toast.success(item.is_favorite ? 'Removed from favorites' : 'Added to favorites')
    } catch (error: any) {
      toast.error('Failed to update favorite status')
      console.error('Error updating favorite:', error)
    }
  }

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  // Filter items based on search and filter options
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    if (!matchesSearch) return false

    switch (filterBy) {
      case 'favorites':
        return item.is_favorite
      case 'used':
        return item.usage_count > 0
      case 'unused':
        return item.usage_count === 0
      case 'article':
        return item.type === 'article'
      case 'tweet':
        return item.type === 'tweet'
      case 'video':
        return item.type === 'video'
      default:
        return true
    }
  })

  // Sort items based on sort option
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'date_saved':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'date_used':
        if (!a.last_used_at && !b.last_used_at) return 0
        if (!a.last_used_at) return 1
        if (!b.last_used_at) return -1
        return new Date(b.last_used_at).getTime() - new Date(a.last_used_at).getTime()
      case 'usage_count':
        return b.usage_count - a.usage_count
      case 'favorites':
        return (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0)
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return '📄'
      case 'tweet':
        return '🐦'
      case 'video':
        return '🎥'
      default:
        return '🔗'
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search saved items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="w-4 h-4" />
              Filters
            </button>
            
            {selectedItems.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedItems.length} selected
                </span>
                <button
                  onClick={() => setSelectedItems([])}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Sort */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="date_saved">Date Saved</option>
                  <option value="date_used">Last Used</option>
                  <option value="usage_count">Most Used</option>
                  <option value="favorites">Favorites First</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Filter by:</label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Items</option>
                  <option value="favorites">Favorites</option>
                  <option value="used">Used for AI</option>
                  <option value="unused">Not Used</option>
                  <option value="article">Articles</option>
                  <option value="tweet">Tweets</option>
                  <option value="video">Videos</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
            <GlobeAltIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Favorites</p>
              <p className="text-2xl font-bold text-gray-900">{items.filter(i => i.is_favorite).length}</p>
            </div>
            <HeartIcon className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Used for AI</p>
              <p className="text-2xl font-bold text-gray-900">{items.filter(i => i.usage_count > 0).length}</p>
            </div>
            <SparklesIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">{items.reduce((sum, i) => sum + i.usage_count, 0)}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm || filterBy !== 'all' ? (
            <>
              <GlobeAltIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters</p>
            </>
          ) : (
            <>
              <GlobeAltIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved items yet</h3>
              <p className="text-gray-600">Start saving content with the browser extension</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {sortedItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedItems.includes(item.id) ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                } ${item.is_favorite ? 'border-2 border-red-200' : ''}`}
                onClick={() => toggleItemSelection(item.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getTypeIcon(item.type)}</span>
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {item.type}
                    </span>
                    {item.usage_count > 0 && (
                      <span className="flex items-center text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        <SparklesIcon className="w-3 h-3 mr-1" />
                        {item.usage_count}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(item.id)
                      }}
                      className={`p-1 transition-colors ${
                        item.is_favorite 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                      title={item.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {item.is_favorite ? (
                        <HeartIconSolid className="w-4 h-4" />
                      ) : (
                        <HeartIcon className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(item.url, '_blank')
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View original"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: Implement edit functionality
                      }}
                      className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteItem(item.id)
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>

                {item.snippet && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {item.snippet}
                  </p>
                )}

                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        <TagIcon className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{item.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  {item.last_used_at && (
                    <div className="flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {new Date(item.last_used_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

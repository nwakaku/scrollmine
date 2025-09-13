import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { SavedItemsList } from '@/components/dashboard/SavedItemsList'
import ContentGenerator from '@/components/dashboard/ContentGenerator'
import { motion } from 'framer-motion'
import { 
  BookmarkIcon, 
  SparklesIcon, 
  ChartBarIcon,
  PlusIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { localStorageUtils } from '@/lib/localStorage'

export default function DashboardPage() {
  const { user, migrateLocalData } = useAuth()
  const [activeTab, setActiveTab] = useState<'saved' | 'generate' | 'analytics'>('saved')
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false)

  const tabs = [
    { id: 'saved', name: 'Saved Items', icon: BookmarkIcon },
    { id: 'generate', name: 'Generate Content', icon: SparklesIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  ]

  useEffect(() => {
    // Check if there's local data to migrate
    const localItems = localStorageUtils.getSavedItems()
    const localContent = localStorageUtils.getGeneratedContent()
    
    if (localItems.length > 0 || localContent.length > 0) {
      setShowMigrationPrompt(true)
    }
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
            </div>
            <button className="btn-primary flex items-center space-x-2">
              <PlusIcon className="w-5 h-5" />
              <span>Add Item</span>
            </button>
          </div>

          {/* Migration Prompt */}
          {showMigrationPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-800">
                    Local Data Found
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    We found some data from your local demo. Would you like to migrate it to your account?
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={async () => {
                      await migrateLocalData()
                      setShowMigrationPrompt(false)
                    }}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Migrate Data
                  </button>
                  <button
                    onClick={() => setShowMigrationPrompt(false)}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border-b border-gray-200"
        >
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-[600px]"
        >
          {activeTab === 'saved' && <SavedItemsList />}
          {activeTab === 'generate' && <ContentGenerator />}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-600">Track your content performance and engagement metrics.</p>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

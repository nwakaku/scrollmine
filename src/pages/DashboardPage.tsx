import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { SavedItemsList } from '@/components/dashboard/SavedItemsList'
import ContentGenerator from '@/components/dashboard/ContentGenerator'
import { motion } from 'framer-motion'
import { 
  BookmarkIcon, 
  SparklesIcon, 
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'saved' | 'generate' | 'analytics'>('saved')

  const tabs = [
    { id: 'saved', name: 'Saved Items', icon: BookmarkIcon },
    { id: 'generate', name: 'Generate Content', icon: SparklesIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <PlusIcon className="w-5 h-5" />
            <span>Add Item</span>
          </button>
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

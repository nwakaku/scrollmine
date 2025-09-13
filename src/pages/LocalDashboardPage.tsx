import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { LocalSavedItemsList } from '@/components/dashboard/LocalSavedItemsList'
import LocalContentGenerator from '@/components/dashboard/LocalContentGenerator'
import { motion } from 'framer-motion'
import { 
  BookmarkIcon, 
  SparklesIcon, 
  ChartBarIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { demoData } from '@/lib/demoData'

export default function LocalDashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'saved' | 'generate' | 'analytics'>('saved')

  const tabs = [
    { id: 'saved', name: 'Saved Items', icon: BookmarkIcon },
    { id: 'generate', name: 'Generate Content', icon: SparklesIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  ]

  // Redirect to main dashboard if user is logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleUpgradeClick = () => {
    navigate('/')
    toast.success('Please sign up to unlock full features!')
  }

  const handleAddDemoData = () => {
    const itemsAdded = demoData.addSampleItems()
    const contentAdded = demoData.addSampleGeneratedContent()
    
    toast.success(`Added ${itemsAdded} sample items and ${contentAdded} sample generated content!`)
    
    // Refresh the page to show the new data
    window.location.reload()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Warning */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome to ScrollMine (Local Mode)</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleAddDemoData}
                className="btn-secondary flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Demo Data</span>
              </button>
              <button 
                onClick={handleUpgradeClick}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Upgrade to Full Access</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-amber-800">
                  Limited Functionality - Local Mode
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  You're using ScrollMine in local mode. Your data is stored in your browser and will be lost if you clear your data. 
                  <button 
                    onClick={handleUpgradeClick}
                    className="font-medium underline hover:no-underline ml-1"
                  >
                    Sign up for full access
                  </button>
                  {' '}to sync across devices, access advanced features, and never lose your content.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
          {activeTab === 'saved' && <LocalSavedItemsList />}
          {activeTab === 'generate' && <LocalContentGenerator />}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-600 mb-4">Track your content performance and engagement metrics.</p>
              <button 
                onClick={handleUpgradeClick}
                className="btn-primary"
              >
                Upgrade for Analytics
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

import { useAuth } from '@/components/providers/AuthProvider'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookmarkIcon, 
  SparklesIcon, 
  ShareIcon, 
  RocketLaunchIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const { user, loading } = useAuth()
  const [showSignUp, setShowSignUp] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <BookmarkIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ScrollMine
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Transform Your{' '}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Online Surfing
                </span>{' '}
                Into Engaging Content
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Capture valuable content from your daily browsing and let AI transform it into compelling social media posts. 
                Save time, boost engagement, and grow your online presence.
              </motion.p>
            </div>

            {/* Features */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">One-click browser extension to save content</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">AI-powered content generation for multiple platforms</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Smart organization with tags and notes</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Export and share your content seamlessly</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button 
                onClick={() => setShowSignUp(true)}
                className="btn-primary flex items-center justify-center space-x-2 text-lg px-8 py-4"
              >
                <RocketLaunchIcon className="w-5 h-5" />
                <span>Get Started Free</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/local-dashboard')}
                className="btn-secondary text-lg px-8 py-4"
              >
                Try Demo
              </button>
              <button 
                onClick={() => setShowSignUp(false)}
                className="btn-outline text-lg px-8 py-4"
              >
                Sign In
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="card max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {showSignUp ? 'Create Your Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {showSignUp 
                    ? 'Start capturing and creating amazing content today' 
                    : 'Sign in to access your content library'
                  }
                </p>
              </div>

              {showSignUp ? <SignUpForm /> : <LoginForm />}

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowSignUp(!showSignUp)}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showSignUp 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"
                  }
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* How it works section */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How ScrollMine Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <BookmarkIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">1. Capture Content</h3>
              <p className="text-gray-600">
                Use our browser extension to save articles, tweets, and videos with one click
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto">
                <SparklesIcon className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">2. AI Generation</h3>
              <p className="text-gray-600">
                Select your saved content and let AI create engaging posts for multiple platforms
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <ShareIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">3. Share & Grow</h3>
              <p className="text-gray-600">
                Export your content and share it across your social media channels
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

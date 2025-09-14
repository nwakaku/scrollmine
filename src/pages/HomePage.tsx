import { useAuth } from '@/components/providers/AuthProvider'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import Header from '@/components/layout/Header'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  SparklesIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserGroupIcon,
  PlayIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  const { user, loading } = useAuth()
  const [showSignUp, setShowSignUp] = useState<boolean | null>(false)
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header onSignInClick={() => setShowSignUp(false)} />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div
              data-aos="fade-right"
              data-aos-delay="100"
              className="space-y-8"
            >
              <div className="space-y-6">
                <h1 
                  data-aos="fade-up"
                  data-aos-delay="200"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                >
                  Stop Scrolling.{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                    Start Creating.
                  </span>
                </h1>
                
                <p 
                  data-aos="fade-up"
                  data-aos-delay="300"
                  className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                  Transform your daily browsing into engaging social media content effortlessly with our intuitive tools, comprehensive analytics, and expert support, ensuring you stay ahead in the ever-evolving digital landscape.
                </p>
              </div>

              <div 
                data-aos="fade-up"
                data-aos-delay="400"
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  onClick={() => setShowSignUp(true)}
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  Start Creating Now
                </Button>
                <Button 
                  onClick={() => navigate('/local-dashboard')}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  Try Free Demo
                </Button>
              </div>

              <div 
                data-aos="fade-up"
                data-aos-delay="500"
                className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-4 h-4" />
                  <span>1,500+ creators crushing it</span>
                </div>
              </div>
            </div>

            <div
              data-aos="fade-left"
              data-aos-delay="200"
              className="relative mt-8 lg:mt-0"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Team collaboration" 
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
                />
                
                {/* Floating notification cards */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-4 max-w-xs">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notifications</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">rubyxoxz_ started following you</span>
                      <button className="text-xs bg-primary-600 text-white px-2 py-1 rounded">Follow</button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Just now</div>
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-4 max-w-xs">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Comments</div>
                  <div className="space-y-2">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">rubyxoxz_</div>
                    <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">Wow, this beach looks amazing! You look so relaxed and happy 😊</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Just now</div>
                  </div>
                </div>

                {/* Social media icons */}
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">IG</span>
                </div>
                <div className="absolute top-8 left-2 sm:top-16 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">X</span>
                </div>
                <div className="absolute top-6 right-4 sm:top-12 sm:right-8 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">YT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-8">Trusted by 100+ Famous Companies</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12 opacity-60">
            {['Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum'].map((logo, index) => (
              <div key={index} className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-400 dark:text-gray-500">{logo}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 
              data-aos="fade-up"
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Content Creation. Simplified.
            </h2>
            <p 
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Three tools. Infinite possibilities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div 
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">#</span>
                  </div>
                  <CardTitle className="text-xl">Hashtags That Hit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="text-sm text-blue-600">#ThrowbackThursday 📸</div>
                    <div className="text-xs text-gray-500">1,299 people have used this hashtag</div>
                  </div>
                  <CardDescription className="text-gray-600">
                    AI finds the hashtags that work. You get the reach.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div 
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SparklesIcon className="w-8 h-8 text-secondary-600" />
                  </div>
                  <CardTitle className="text-xl">Reuse & Win</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg p-4 mb-4 h-20 flex items-center justify-center">
                    <div className="text-white text-sm">Reuse high-impact content</div>
                  </div>
                  <CardDescription className="text-gray-600">
                    One post. Ten variations. Maximum reach.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div 
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CalendarIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Schedule & Scale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-900">Schedule on Sep 1 at 4 PM</div>
                    <div className="text-xs text-gray-600">Midday meals are the best kind of...</div>
                    <div className="text-xs text-primary-600 mt-2">See more</div>
                  </div>
                  <CardDescription className="text-gray-600">
                    Set it. Forget it. Watch it grow.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div
              data-aos="fade-right"
            >
              <h2 
                data-aos="fade-up"
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Your Content Command Center
              </h2>
              <p 
                data-aos="fade-up"
                data-aos-delay="100"
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8"
              >
                One dashboard. All platforms. Zero chaos. Manage every account, track every metric, 
                and dominate every algorithm from a single, powerful interface.
              </p>
              <Button 
                data-aos="fade-up"
                data-aos-delay="200"
              >
                See It In Action
              </Button>
            </div>

            <div
              data-aos="fade-left"
              data-aos-delay="200"
              className="relative mt-8 lg:mt-0"
            >
              <img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Dashboard view" 
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
              />
              
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2">X - 1,839 followers</div>
                <div className="text-xs text-primary-600">View Profile</div>
              </div>

              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 sm:p-3">
                <div className="flex space-x-2 sm:space-x-4 text-xs sm:text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">4k</div>
                    <div className="text-gray-500 dark:text-gray-400">followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">5k</div>
                    <div className="text-gray-500 dark:text-gray-400">likes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">11</div>
                    <div className="text-gray-500 dark:text-gray-400">comments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Analytics dashboard" 
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
              />
              
            
            </motion.div>

            <div
              data-aos="fade-left"
              data-aos-delay="200"
              className="order-1 lg:order-2"
            >
              <h2 
                data-aos="fade-up"
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Data That Actually Drives Results
              </h2>
              <p 
                data-aos="fade-up"
                data-aos-delay="100"
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8"
              >
                Stop posting blind. Get real-time insights that show you exactly what works, 
                what doesn't, and how to 10x your engagement starting tomorrow.
              </p>
              <Button 
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Get The Data
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 
              data-aos="fade-up"
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Pick Your Power Level
            </h2>
            <p 
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Whether you're a solo creator or a content empire, we've got the perfect plan to supercharge your social media game.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div 
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl">Creator Starter</CardTitle>
                  <CardDescription>Perfect for solo creators ready to level up</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900 mb-6">$29<span className="text-lg text-gray-500">/month</span></div>
                  <Button variant="outline" className="w-full mb-8">Start Creating</Button>
                  <ul className="space-y-3 text-left">
                    {[
                      'Comprehensive Analytics Dashboard',
                      'Automated Posting',
                      'Custom Content Creation',
                      'Audience Engagement Tools',
                      'Campaign Management',
                      'Social Listening',
                      'Multi-Platform Integration',
                      'Advanced Reporting & Analytics'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div 
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Card className="text-center relative border-2 border-primary-600">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary-600 text-white px-4 py-1">Mostly Picked</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Content Boss</CardTitle>
                  <CardDescription>For serious creators and growing businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900 mb-6">$79<span className="text-lg text-gray-500">/month</span></div>
                  <Button className="w-full mb-8">Dominate Social</Button>
                  <ul className="space-y-3 text-left">
                    {[
                      'Comprehensive Analytics Dashboard',
                      'Automated Posting',
                      'Custom Content Creation',
                      'Audience Engagement Tools',
                      'Campaign Management',
                      'Social Listening',
                      'Multi-Platform Integration',
                      'Advanced Reporting & Analytics'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div 
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl">Content Empire</CardTitle>
                  <CardDescription>For agencies and content powerhouses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900 mb-6">$149<span className="text-lg text-gray-500">/month</span></div>
                  <Button variant="outline" className="w-full mb-8">Scale Everything</Button>
                  <ul className="space-y-3 text-left">
                    {[
                      'Comprehensive Analytics Dashboard',
                      'Automated Posting',
                      'Custom Content Creation',
                      'Audience Engagement Tools',
                      'Campaign Management',
                      'Social Listening',
                      'Multi-Platform Integration',
                      'Advanced Reporting & Analytics'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 sm:mb-16 gap-4">
            <div>
              <h2 
                data-aos="fade-up"
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Real Results
              </h2>
              <p 
                data-aos="fade-up"
                data-aos-delay="100"
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300"
              >
                From struggling to thriving.
              </p>
            </div>
            <Button 
              data-aos="fade-up"
              data-aos-delay="200"
              variant="outline" 
              className="self-start sm:self-auto"
            >
              More Stories
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div 
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <Card>
                <CardContent className="p-0">
                  <div className="relative mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                      alt="Sarah Thompson" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <PlayIcon className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">"ScrollMine Transformed Our Online Presence"</h3>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">Sarah Thompson</div>
                      <div>Marketing Director</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div 
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Card>
                <CardContent className="p-0">
                  <div className="relative mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                      alt="David Lee" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <PlayIcon className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">"A Game-Changer for Our Content Strategy"</h3>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">David Lee</div>
                      <div>Business Owner</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div 
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <Card>
                <CardContent className="p-0">
                  <div className="relative mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                      alt="Emily Carter" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <PlayIcon className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">"Exceptional Tools and Outstanding Support"</h3>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">Emily Carter</div>
                      <div>Content Manager</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-4 h-4 sm:w-8 sm:h-8 bg-secondary-500 rounded-full"></div>
          <div className="absolute top-8 right-4 sm:top-16 sm:right-8 w-4 h-4 sm:w-8 sm:h-8 bg-secondary-500 rounded-full"></div>
          <div className="absolute bottom-4 left-1/4 sm:bottom-8 sm:left-1/4 w-4 h-4 sm:w-8 sm:h-8 bg-secondary-500 rounded-full"></div>
          <div className="absolute bottom-8 right-1/4 sm:bottom-16 sm:right-1/4 w-4 h-4 sm:w-8 sm:h-8 bg-secondary-500 rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center z-10">
          <h2 
            data-aos="fade-up"
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
          >
            Ready to Create?
          </h2>
          <p 
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-lg sm:text-xl text-primary-100 mb-8"
          >
            Join 1,500+ creators already winning.
          </p>
          <Button 
            data-aos="fade-up"
            data-aos-delay="200"
            onClick={() => setShowSignUp(true)}
            variant="secondary"
            size="lg"
            className="bg-white text-primary-600 hover:bg-gray-100"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <BookmarkIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ScrollMine</span>
              </div>
              <p className="text-gray-400 mb-6">Your partner in content creation success.</p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs">IG</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs">X</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs">YT</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Who We Are</a></li>
                <li><a href="#" className="hover:text-white">What We Do</a></li>
                <li><a href="#" className="hover:text-white">Our Mission</a></li>
                <li><a href="#" className="hover:text-white">Our Vision</a></li>
                <li><a href="#" className="hover:text-white">Our Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Content Management</a></li>
                <li><a href="#" className="hover:text-white">Content Creation</a></li>
                <li><a href="#" className="hover:text-white">Analytics & Reporting</a></li>
                <li><a href="#" className="hover:text-white">Campaign Management</a></li>
                <li><a href="#" className="hover:text-white">Social Listening</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© Copyright ScrollMine 2024</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Dialog open={showSignUp !== null} onOpenChange={(open) => setShowSignUp(open ? true : null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {showSignUp ? 'Create Your Account' : 'Welcome Back'}
            </DialogTitle>
            <DialogDescription>
              {showSignUp 
                ? 'Start capturing and creating amazing content today' 
                : 'Sign in to access your content library'
              }
            </DialogDescription>
          </DialogHeader>

          {showSignUp ? <SignUpForm /> : <LoginForm />}

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setShowSignUp(!showSignUp)}
              className="text-primary-600 hover:text-primary-700"
            >
              {showSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

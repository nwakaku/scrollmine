import { BookmarkIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-8 relative">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
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
  )
}


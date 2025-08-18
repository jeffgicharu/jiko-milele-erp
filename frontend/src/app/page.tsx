'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { LogIn, ChefHat, Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthContext()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full mb-8">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Jiko Milele
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Modern Restaurant Management System for Kenyan Hospitality
          </p>
          
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Streamline your restaurant operations with our comprehensive ERP system designed specifically for the Kenyan hospitality industry.
          </p>
          
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Access System
          </Link>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Restaurant
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From kitchen operations to customer service, manage every aspect of your restaurant with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kitchen Management */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 rounded-lg mb-4">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kitchen Operations</h3>
              <p className="text-gray-600 mb-4">
                Manage orders, inventory, and kitchen workflows with our integrated kitchen display system.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Real-time order tracking</li>
                <li>• Inventory management</li>
                <li>• Recipe standardization</li>
                <li>• Cost analysis</li>
              </ul>
            </div>

            {/* Front of House */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Service</h3>
              <p className="text-gray-600 mb-4">
                Deliver exceptional customer experiences with our front-of-house management tools.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Table management</li>
                <li>• Reservation system</li>
                <li>• Customer profiles</li>
                <li>• Point of sale</li>
              </ul>
            </div>

            {/* Management & Analytics */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-lg mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Intelligence</h3>
              <p className="text-gray-600 mb-4">
                Make data-driven decisions with comprehensive analytics and reporting tools.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Sales analytics</li>
                <li>• Staff performance</li>
                <li>• Financial reporting</li>
                <li>• Operational insights</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Restaurant Operations?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join the modern era of restaurant management with Jiko Milele ERP system.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Staff Login
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-600">
          <p>&copy; 2024 Jiko Milele Restaurant. All rights reserved.</p>
          <p className="text-sm mt-2">Modern Kenyan Restaurant Management System</p>
        </footer>
      </div>
    </div>
  )
}

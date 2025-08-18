'use client'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Jiko Milele ERP
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Modern Kenyan Restaurant Management System
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
            Comprehensive ERP solution for Jiko Milele Restaurant featuring table management, 
            point of sale, kitchen display system, inventory management, and analytics.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-orange-500 text-2xl mb-3">🍽️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Table Management</h3>
              <p className="text-gray-600 text-sm">Reservation system and seating optimization</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-green-500 text-2xl mb-3">💳</div>
              <h3 className="font-semibold text-gray-900 mb-2">POS System</h3>
              <p className="text-gray-600 text-sm">Order processing with M-PESA integration</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-500 text-2xl mb-3">👨‍🍳</div>
              <h3 className="font-semibold text-gray-900 mb-2">Kitchen Display</h3>
              <p className="text-gray-600 text-sm">Real-time order coordination and timing</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-purple-500 text-2xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">Business intelligence and reporting</p>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-sm text-gray-500">
              Development Environment - Phase 1 Foundation Complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

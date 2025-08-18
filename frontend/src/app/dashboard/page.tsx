'use client'

import { useAuthContext } from '@/components/providers/AuthProvider'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { 
  User, 
  LogOut, 
  Settings, 
  Users, 
  ChefHat, 
  Utensils, 
  Coffee,
  BarChart3,
  Package,
  Calendar,
  CreditCard,
  Shield,
  Clock
} from 'lucide-react'

function DashboardContent() {
  const { 
    user, 
    logout, 
    role, 
    staffName, 
    permissions,
    isManager,
    isKitchenStaff,
    isFOHStaff,
    logoutLoading
  } = useAuthContext()

  const handleLogout = () => {
    logout()
  }

  const getRoleIcon = () => {
    switch (role) {
      case 'general_manager':
      case 'shift_supervisor':
        return <Shield className="w-8 h-8 text-red-600" />
      case 'head_chef':
      case 'sous_chef':
      case 'line_cook':
        return <ChefHat className="w-8 h-8 text-purple-600" />
      case 'server':
        return <Utensils className="w-8 h-8 text-blue-600" />
      case 'host':
        return <Users className="w-8 h-8 text-green-600" />
      case 'bartender':
        return <Coffee className="w-8 h-8 text-amber-600" />
      case 'busser':
        return <Clock className="w-8 h-8 text-gray-600" />
      default:
        return <User className="w-8 h-8 text-gray-600" />
    }
  }

  const getRoleBadgeColor = () => {
    if (isManager) return 'bg-red-100 text-red-800 border-red-200'
    if (isKitchenStaff) return 'bg-purple-100 text-purple-800 border-purple-200'
    if (isFOHStaff) return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JM</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Jiko Milele</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{staffName || user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getRoleIcon()}
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor()}`}>
                  {role?.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                <LogOut className="w-4 h-4 mr-1" />
                {logoutLoading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {staffName || user?.first_name || user?.username}!
          </h2>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Role-Based Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Manager Dashboard */}
            {isManager && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Management Dashboard
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-red-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Financial Reports</h4>
                    <p className="text-sm text-gray-600">Revenue, costs, and profit analysis</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Staff Management</h4>
                    <p className="text-sm text-gray-600">Schedules, performance, payroll</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Settings className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-medium text-gray-900">System Settings</h4>
                    <p className="text-sm text-gray-600">Configuration and preferences</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Operations</h4>
                    <p className="text-sm text-gray-600">Daily operations oversight</p>
                  </div>
                </div>
              </div>
            )}

            {/* Kitchen Dashboard */}
            {isKitchenStaff && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ChefHat className="w-5 h-5 mr-2 text-purple-600" />
                  Kitchen Management
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <Clock className="w-8 h-8 text-purple-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Active Orders</h4>
                    <p className="text-sm text-gray-600">Kitchen display system</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Package className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Inventory</h4>
                    <p className="text-sm text-gray-600">Ingredients and supplies</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <ChefHat className="w-8 h-8 text-orange-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Recipes</h4>
                    <p className="text-sm text-gray-600">Menu items and procedures</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Food Costs</h4>
                    <p className="text-sm text-gray-600">Cost analysis and optimization</p>
                  </div>
                </div>
              </div>
            )}

            {/* FOH Dashboard */}
            {isFOHStaff && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Utensils className="w-5 h-5 mr-2 text-blue-600" />
                  Front of House
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Utensils className="w-8 h-8 text-blue-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Table Management</h4>
                    <p className="text-sm text-gray-600">Seating and table status</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <CreditCard className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Point of Sale</h4>
                    <p className="text-sm text-gray-600">Order taking and payments</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Customers</h4>
                    <p className="text-sm text-gray-600">Customer service and profiles</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-orange-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Reservations</h4>
                    <p className="text-sm text-gray-600">Booking and scheduling</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Username</p>
                  <p className="text-sm text-gray-600">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Role</p>
                  <p className="text-sm text-gray-600">{role?.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Login</p>
                  <p className="text-sm text-gray-600">
                    {user?.last_login 
                      ? new Date(user.last_login).toLocaleDateString()
                      : 'First time login'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Permissions Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Permissions</h3>
              <div className="space-y-2">
                {permissions.length > 0 ? (
                  permissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {permission.replace('_', ' ').toLowerCase()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No specific permissions assigned</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Failed Logins</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.profile?.failed_login_attempts || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.date_joined 
                      ? new Date(user.date_joined).toLocaleDateString()
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
'use client'

import { useAuthContext } from '@/components/providers/AuthProvider'
import { 
  User,
  Shield,
  ChefHat,
  Utensils,
  Users,
  Coffee,
  Clock
} from 'lucide-react'

export function UserProfile() {
  const { user, role, staffName, permissions } = useAuthContext()

  const getRoleIcon = () => {
    switch (role) {
      case 'general_manager':
      case 'shift_supervisor':
        return <Shield className="w-5 h-5 text-red-600" />
      case 'head_chef':
      case 'sous_chef':
      case 'line_cook':
        return <ChefHat className="w-5 h-5 text-purple-600" />
      case 'server':
        return <Utensils className="w-5 h-5 text-blue-600" />
      case 'host':
        return <Users className="w-5 h-5 text-green-600" />
      case 'bartender':
        return <Coffee className="w-5 h-5 text-amber-600" />
      case 'busser':
        return <Clock className="w-5 h-5 text-gray-600" />
      default:
        return <User className="w-5 h-5 text-gray-600" />
    }
  }

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'general_manager':
      case 'shift_supervisor':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'head_chef':
      case 'sous_chef':
      case 'line_cook':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'server':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'host':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'bartender':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'busser':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      {/* User Avatar and Basic Info */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {staffName || user?.first_name || user?.username}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getRoleIcon()}
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor()}`}>
            {role?.replace('_', ' ').toUpperCase() || 'NO ROLE'}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="font-medium text-green-600">Active</span>
        </div>
        <div className="flex justify-between">
          <span>Permissions:</span>
          <span className="font-medium">{permissions.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Login:</span>
          <span className="font-medium">
            {user?.last_login 
              ? new Date(user.last_login).toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: 'short' 
                })
              : 'First time'
            }
          </span>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useAuthContext } from '@/components/providers/AuthProvider'
import { 
  Menu,
  Bell,
  Search,
  Settings,
  User
} from 'lucide-react'

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, staffName, role } = useAuthContext()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Menu button and search */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers, tables..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Center - Current time */}
        <div className="hidden lg:block">
          <div className="text-sm text-gray-600">
            {new Date().toLocaleString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Africa/Nairobi'
            })} EAT
          </div>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full relative">
            <Bell className="w-5 h-5" />
            {/* Notification badge */}
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          </button>

          {/* Settings - Manager only */}
          {(role === 'general_manager' || role === 'shift_supervisor') && (
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
              <Settings className="w-5 h-5" />
            </button>
          )}

          {/* User info - Desktop only */}
          <div className="hidden lg:flex lg:items-center lg:space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {staffName || user?.first_name || user?.username}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {role?.replace('_', ' ') || 'Staff Member'}
              </p>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
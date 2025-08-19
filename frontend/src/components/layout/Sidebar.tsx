'use client'

import { useAuthContext } from '@/components/providers/AuthProvider'
import { NavigationMenu } from './NavigationMenu'
import { UserProfile } from './UserProfile'
import { 
  ChefHat, 
  X,
  LogOut
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout, logoutLoading } = useAuthContext()

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent onClose={onClose} onLogout={handleLogout} logoutLoading={logoutLoading} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            <SidebarContent onLogout={handleLogout} logoutLoading={logoutLoading} />
          </div>
        </div>
      </div>
    </>
  )
}

interface SidebarContentProps {
  onClose?: () => void
  onLogout: () => void
  logoutLoading: boolean
}

function SidebarContent({ onClose, onLogout, logoutLoading }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Jiko Milele</h1>
            <p className="text-xs text-gray-500">Restaurant ERP</p>
          </div>
        </div>
        
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Profile Section */}
      <div className="mt-6 px-4">
        <UserProfile />
      </div>

      {/* Navigation Menu */}
      <div className="mt-6 flex-1">
        <NavigationMenu onItemClick={onClose} />
      </div>

      {/* Logout Button */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          disabled={logoutLoading}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-4 h-4 mr-3" />
          {logoutLoading ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  )
}
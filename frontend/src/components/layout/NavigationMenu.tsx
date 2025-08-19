'use client'

import React from 'react'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  BarChart3,
  Utensils,
  Users,
  User,
  Package,
  TrendingUp,
  Settings,
  Calendar,
  ChefHat,
  Coffee,
  CreditCard,
  Clock,
  Shield,
  FileText
} from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
  permissions?: string[]
}

const navigationItems: NavigationItem[] = [
  // General Manager Navigation
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    roles: ['general_manager', 'shift_supervisor', 'head_chef', 'server', 'host', 'bartender', 'busser', 'line_cook', 'sous_chef']
  },
  {
    name: 'Tables',
    href: '/tables',
    icon: Utensils,
    roles: ['general_manager', 'shift_supervisor', 'server', 'host', 'busser']
  },
  {
    name: 'Staff',
    href: '/staff',
    icon: Users,
    roles: ['general_manager', 'shift_supervisor']
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: User,
    roles: ['general_manager', 'shift_supervisor', 'server', 'host']
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Package,
    roles: ['general_manager', 'head_chef', 'sous_chef']
  },
  {
    name: 'Suppliers',
    href: '/suppliers',
    icon: FileText,
    roles: ['general_manager', 'head_chef']
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: TrendingUp,
    roles: ['general_manager', 'shift_supervisor', 'head_chef']
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['general_manager']
  },
  
  // Kitchen Staff Specific
  {
    name: 'Kitchen',
    href: '/kitchen',
    icon: ChefHat,
    roles: ['head_chef', 'sous_chef', 'line_cook']
  },
  {
    name: 'Recipes',
    href: '/recipes',
    icon: FileText,
    roles: ['head_chef', 'sous_chef']
  },
  
  // FOH Staff Specific
  {
    name: 'My Tables',
    href: '/my-tables',
    icon: Utensils,
    roles: ['server']
  },
  {
    name: 'Reservations',
    href: '/reservations',
    icon: Calendar,
    roles: ['host', 'general_manager', 'shift_supervisor']
  },
  {
    name: 'Bar',
    href: '/bar',
    icon: Coffee,
    roles: ['bartender']
  },
  {
    name: 'Sales',
    href: '/sales',
    icon: CreditCard,
    roles: ['server', 'bartender', 'general_manager', 'shift_supervisor']
  }
]

interface NavigationMenuProps {
  onItemClick?: () => void
}

export function NavigationMenu({ onItemClick }: NavigationMenuProps) {
  const { role, hasAnyRole, hasPermission } = useAuthContext()
  const pathname = usePathname()

  const filteredItems = navigationItems.filter(item => {
    // Check if user has required role
    if (!hasAnyRole(item.roles)) {
      return false
    }
    
    // Check if user has required permissions (if specified)
    if (item.permissions && item.permissions.length > 0) {
      return item.permissions.some(permission => hasPermission(permission))
    }
    
    return true
  })

  const getRoleIcon = () => {
    switch (role) {
      case 'general_manager':
      case 'shift_supervisor':
        return Shield
      case 'head_chef':
      case 'sous_chef':
      case 'line_cook':
        return ChefHat
      case 'server':
        return Utensils
      case 'host':
        return Users
      case 'bartender':
        return Coffee
      case 'busser':
        return Clock
      default:
        return User
    }
  }

  return (
    <nav className="px-2 space-y-1">
      {filteredItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={`
              group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
              ${isActive 
                ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <Icon 
              className={`
                mr-3 flex-shrink-0 h-5 w-5 transition-colors
                ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'}
              `} 
            />
            {item.name}
            
            {/* Active indicator */}
            {isActive && (
              <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full" />
            )}
          </Link>
        )
      })}
      
      {/* Role indicator at bottom of menu */}
      <div className="pt-4 mt-4 border-t border-gray-200">
        <div className="flex items-center px-2 py-2 text-xs text-gray-500">
          {React.createElement(getRoleIcon(), { className: 'w-4 h-4 mr-2' })}
          <span className="capitalize">
            {role?.replace('_', ' ') || 'No Role'}
          </span>
        </div>
      </div>
    </nav>
  )
}
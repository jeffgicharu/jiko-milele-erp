'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  href: string
  current: boolean
}

const pathNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  tables: 'Tables',
  staff: 'Staff',
  customers: 'Customers',
  inventory: 'Inventory',
  suppliers: 'Suppliers',
  reports: 'Reports',
  settings: 'Settings',
  kitchen: 'Kitchen',
  recipes: 'Recipes',
  'my-tables': 'My Tables',
  reservations: 'Reservations',
  bar: 'Bar',
  sales: 'Sales'
}

export function Breadcrumbs() {
  const pathname = usePathname()
  
  const pathSegments = pathname.split('/').filter(Boolean)
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: 'Home',
      href: '/dashboard',
      current: pathname === '/dashboard'
    }
  ]
  
  // Build breadcrumb trail from path segments
  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1
    
    // Skip the first segment if it's 'dashboard' since we already have 'Home'
    if (segment === 'dashboard' && index === 0) return
    
    breadcrumbs.push({
      name: pathNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: currentPath,
      current: isLast
    })
  })

  // Don't show breadcrumbs if we're only on the dashboard
  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href}>
            <div className="flex items-center">
              {index > 0 && (
                <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
              )}
              
              {index === 0 ? (
                <Link
                  href={breadcrumb.href}
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <Home className="flex-shrink-0 h-4 w-4" />
                  <span className="sr-only">{breadcrumb.name}</span>
                </Link>
              ) : breadcrumb.current ? (
                <span 
                  className="text-sm font-medium text-gray-900"
                  aria-current="page"
                >
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
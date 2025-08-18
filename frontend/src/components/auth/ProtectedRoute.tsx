'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { StaffRole, Permission } from '@/types/auth'
import { Loader2, Lock, AlertTriangle } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRoles?: StaffRole[]
  requiredPermissions?: Permission[]
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRoles = [],
  requiredPermissions = [],
  fallback,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { 
    isAuthenticated, 
    isLoading, 
    role, 
    hasAnyRole,
    hasPermission 
  } = useAuthContext()

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      // Redirect to login with current path as redirect parameter
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`
      router.push(redirectUrl)
    }
  }, [isLoading, isAuthenticated, requireAuth, router, redirectTo, pathname])

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated, don't render anything
  // (redirect will happen via useEffect)
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don&apos;t have the required role to access this page.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Your role:</strong> {role ? role.replace('_', ' ').toUpperCase() : 'No role assigned'}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Required roles:</strong> {requiredRoles.map(r => r.replace('_', ' ').toUpperCase()).join(' or ')}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const missingPermissions = requiredPermissions.filter(perm => !hasPermission(perm))
    
    if (missingPermissions.length > 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-8">
            <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Insufficient Permissions</h2>
            <p className="text-gray-600 mb-4">
              You don&apos;t have the required permissions to access this page.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Missing permissions:</strong>
              </p>
              <ul className="text-sm text-red-600 list-disc list-inside">
                {missingPermissions.map(perm => (
                  <li key={perm}>{perm.replace('_', ' ').toLowerCase()}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    }
  }

  // All checks passed, render the protected content
  return <>{children}</>
}

// Higher-order component version for easier use
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Specific role-based protected route components
export function ManagerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['general_manager', 'shift_supervisor']}>
      {children}
    </ProtectedRoute>
  )
}

export function KitchenRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['head_chef', 'sous_chef', 'line_cook']}>
      {children}
    </ProtectedRoute>
  )
}

export function FOHRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['server', 'host', 'bartender', 'busser']}>
      {children}
    </ProtectedRoute>
  )
}
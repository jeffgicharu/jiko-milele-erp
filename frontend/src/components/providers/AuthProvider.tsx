'use client'

import { createContext, useContext, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useAuth } from '@/hooks/useAuth'
import { AuthContextType } from '@/types/auth'

// Create the authentication context
const AuthContext = createContext<AuthContextType | null>(null)

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        // Don't retry on 401 or 403 errors
        if (error && typeof error === 'object' && 'response' in error) {
          const errorResponse = error.response as { status?: number }
          if (errorResponse?.status === 401 || errorResponse?.status === 403) {
            return false
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    },
  },
})

interface AuthProviderProps {
  children: ReactNode
}

// Auth wrapper component that provides auth context
function AuthWrapper({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

// Main AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthWrapper>
        {children}
      </AuthWrapper>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

// Custom hook to use auth context
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

// Export the auth context for direct access if needed
export { AuthContext }
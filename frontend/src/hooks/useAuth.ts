import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { User, LoginRequest, LoginResponse, AuthContextType } from '@/types/auth'
import { useIsClient } from './useIsClient'

export const useAuth = (): AuthContextType => {
  const queryClient = useQueryClient()
  const isClient = useIsClient()

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await api.get('/auth/profile/')
      return response.data
    },
    enabled: isClient && !!localStorage.getItem('access_token'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const loginMutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (credentials) => {
      const response = await api.post('/auth/login/', credentials)
      return response.data
    },
    onSuccess: (data) => {
      if (isClient) {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
      }
      queryClient.setQueryData(['user'], data.user)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (isClient) {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          try {
            await api.post('/auth/logout/', { refresh: refreshToken })
          } catch (error) {
            // Continue with logout even if server logout fails
            console.warn('Server logout failed:', error)
          }
        }
      }
    },
    onSettled: () => {
      // Clear tokens and cache regardless of server response
      if (isClient) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
      queryClient.clear()
    },
  })

  const isAuthenticated = !!user && isClient && !!localStorage.getItem('access_token')

  // Get user permissions and role information
  const permissions = user?.profile?.permissions || []
  const role = user?.profile?.current_role || null
  const staffName = user?.profile?.staff_name || null

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    loginLoading: loginMutation.isPending,
    logout: logoutMutation.mutate,
    logoutLoading: logoutMutation.isPending,
    isAuthenticated,
    permissions,
    role,
    staffName,
    
    // Role-based helpers
    isManager: role === 'general_manager' || role === 'shift_supervisor',
    isKitchenStaff: ['head_chef', 'sous_chef', 'line_cook'].includes(role || ''),
    isFOHStaff: ['server', 'host', 'bartender', 'busser'].includes(role || ''),
    
    // Permission helpers
    hasPermission: (permission: string) => permissions.includes(permission),
    hasRole: (requiredRole: string) => role === requiredRole,
    hasAnyRole: (roles: string[]) => roles.includes(role || ''),
  }
}
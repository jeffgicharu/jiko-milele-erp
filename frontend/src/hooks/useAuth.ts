import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { User, LoginRequest, LoginResponse } from '@/types/auth'

export const useAuth = () => {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await api.get('/auth/me/')
      return response.data
    },
    enabled: !!localStorage.getItem('access_token'),
    retry: false,
  })

  const loginMutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (credentials) => {
      const response = await api.post('/auth/login/', credentials)
      return response.data
    },
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      queryClient.setQueryData(['user'], data.user)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    queryClient.clear()
  }

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    logout,
    isAuthenticated: !!user && !!localStorage.getItem('access_token'),
  }
}
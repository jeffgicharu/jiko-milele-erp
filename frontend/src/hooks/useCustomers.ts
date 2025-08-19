import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customersService, Customer, CustomerListItem, CustomerCreateData, CustomerUpdateData, CustomerFilters } from '@/services/customersService'
import { queryKeys } from '@/lib/queryClient'
import { getErrorMessage } from '@/lib/api'

// Hook to fetch customers list with filters
export const useCustomers = (filters: CustomerFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.customers.list(filters),
    queryFn: () => customersService.getCustomers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes for customer data
  })
}

// Hook to fetch a single customer
export const useCustomer = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customersService.getCustomer(id),
    enabled: enabled && !!id,
  })
}

// Hook to search customers
export const useCustomerSearch = (query: { phone?: string; name?: string }, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.customers.search(query),
    queryFn: () => customersService.searchCustomers(query),
    enabled: enabled && (!!query.phone || !!query.name),
    staleTime: 1 * 60 * 1000, // 1 minute for search results
  })
}

// Hook to get customer statistics
export const useCustomerStats = () => {
  return useQuery({
    queryKey: queryKeys.customers.stats(),
    queryFn: () => customersService.getCustomerStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes for stats
  })
}

// Hook to create a customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CustomerCreateData) => customersService.createCustomer(data),
    onSuccess: (newCustomer) => {
      // Invalidate customers list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
      // Add the new customer to the cache
      queryClient.setQueryData(queryKeys.customers.detail(newCustomer.id), newCustomer)
      // Update stats
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.stats() })
    },
    onError: (error) => {
      console.error('Error creating customer:', getErrorMessage(error))
    },
  })
}

// Hook to update a customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CustomerUpdateData }) => 
      customersService.updateCustomer(id, data),
    onSuccess: (updatedCustomer, variables) => {
      // Update the specific customer in cache
      queryClient.setQueryData(queryKeys.customers.detail(variables.id), updatedCustomer)
      // Invalidate lists to ensure they reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
      // Update stats if relevant fields changed
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.stats() })
    },
    onError: (error) => {
      console.error('Error updating customer:', getErrorMessage(error))
    },
  })
}

// Hook to delete a customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => customersService.deleteCustomer(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.customers.detail(deletedId) })
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
      // Update stats
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.stats() })
    },
    onError: (error) => {
      console.error('Error deleting customer:', getErrorMessage(error))
    },
  })
}

// Utility hook for optimistic updates
export const useOptimisticCustomerUpdate = () => {
  const queryClient = useQueryClient()
  
  const updateCustomerOptimistically = (id: string, updates: Partial<Customer>) => {
    queryClient.setQueryData(
      queryKeys.customers.detail(id),
      (oldData: Customer | undefined) => {
        if (!oldData) return oldData
        return { ...oldData, ...updates }
      }
    )
  }
  
  const revertOptimisticUpdate = (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(id) })
  }
  
  return {
    updateCustomerOptimistically,
    revertOptimisticUpdate,
  }
}

// Custom hook for customer analytics
export const useCustomerAnalytics = (period: string = '30d') => {
  return useQuery({
    queryKey: [...queryKeys.customers.stats(), 'analytics', period],
    queryFn: async () => {
      // This would call a more detailed analytics endpoint
      // For now, we'll use the basic stats
      return customersService.getCustomerStats()
    },
    staleTime: 15 * 60 * 1000, // 15 minutes for analytics
  })
}
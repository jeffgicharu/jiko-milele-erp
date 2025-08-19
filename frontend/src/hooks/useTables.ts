import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tablesService, Table, TableListItem, TableCreateData, TableUpdateData, TableStatusUpdateData, TableFilters } from '@/services/tablesService'
import { queryKeys } from '@/lib/queryClient'
import { getErrorMessage } from '@/lib/api'

// Hook to fetch tables list with filters
export const useTables = (filters: TableFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.tables.list(filters),
    queryFn: () => tablesService.getTables(filters),
    staleTime: 30 * 1000, // 30 seconds for table data (more frequent updates needed)
    refetchInterval: 60 * 1000, // Auto-refetch every minute for real-time status
  })
}

// Hook to fetch all tables for floor plan (no pagination)
export const useAllTables = () => {
  return useQuery({
    queryKey: queryKeys.tables.floorPlan(),
    queryFn: () => tablesService.getAllTables(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for floor plan
  })
}

// Hook to fetch a single table
export const useTable = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.tables.detail(id),
    queryFn: () => tablesService.getTable(id),
    enabled: enabled && !!id,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Hook to get table statistics
export const useTableStats = () => {
  return useQuery({
    queryKey: queryKeys.tables.stats(),
    queryFn: () => tablesService.getTableStats(),
    staleTime: 1 * 60 * 1000, // 1 minute for stats
    refetchInterval: 2 * 60 * 1000, // Auto-refetch every 2 minutes
  })
}

// Hook to get table status summary
export const useTableStatusSummary = () => {
  return useQuery({
    queryKey: queryKeys.tables.statusSummary(),
    queryFn: () => tablesService.getTableStatusSummary(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

// Hook to create a table
export const useCreateTable = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: TableCreateData) => tablesService.createTable(data),
    onSuccess: (newTable) => {
      // Invalidate and refetch tables lists
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.floorPlan() })
      // Add the new table to the cache
      queryClient.setQueryData(queryKeys.tables.detail(newTable.id), newTable)
      // Update stats
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.stats() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.statusSummary() })
    },
    onError: (error) => {
      console.error('Error creating table:', getErrorMessage(error))
    },
  })
}

// Hook to update a table
export const useUpdateTable = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TableUpdateData }) => 
      tablesService.updateTable(id, data),
    onSuccess: (updatedTable, variables) => {
      // Update the specific table in cache
      queryClient.setQueryData(queryKeys.tables.detail(variables.id), updatedTable)
      // Invalidate lists to ensure they reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.floorPlan() })
      // Update stats and status summary
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.stats() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.statusSummary() })
    },
    onError: (error) => {
      console.error('Error updating table:', getErrorMessage(error))
    },
  })
}

// Hook to update table status only (optimized for frequent updates)
export const useUpdateTableStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TableStatusUpdateData }) => 
      tablesService.updateTableStatus(id, data),
    onSuccess: (updatedTable, variables) => {
      // Update the specific table in cache
      queryClient.setQueryData(queryKeys.tables.detail(variables.id), updatedTable)
      
      // Optimistically update lists without full refetch
      queryClient.setQueriesData(
        { queryKey: queryKeys.tables.lists() },
        (oldData: any) => {
          if (!oldData?.results) return oldData
          return {
            ...oldData,
            results: oldData.results.map((table: TableListItem) =>
              table.id === variables.id ? { ...table, status: variables.data.status } : table
            ),
          }
        }
      )
      
      // Update floor plan data
      queryClient.setQueryData(
        queryKeys.tables.floorPlan(),
        (oldData: Table[] | undefined) => {
          if (!oldData) return oldData
          return oldData.map(table =>
            table.id === variables.id ? { ...table, status: variables.data.status } : table
          )
        }
      )
      
      // Update status summary
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.statusSummary() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.stats() })
    },
    onError: (error) => {
      console.error('Error updating table status:', getErrorMessage(error))
      // Revert optimistic updates on error
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.floorPlan() })
    },
  })
}

// Hook to delete a table
export const useDeleteTable = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => tablesService.deleteTable(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.tables.detail(deletedId) })
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.floorPlan() })
      // Update stats
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.stats() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.statusSummary() })
    },
    onError: (error) => {
      console.error('Error deleting table:', getErrorMessage(error))
    },
  })
}

// Hook for batch status updates
export const useBatchUpdateTableStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (updates: Array<{ id: string; status: string }>) => 
      tablesService.batchUpdateTableStatus(updates),
    onSuccess: (updatedTables) => {
      // Update each table in cache
      updatedTables.forEach(table => {
        queryClient.setQueryData(queryKeys.tables.detail(table.id), table)
      })
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.floorPlan() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.statusSummary() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.stats() })
    },
    onError: (error) => {
      console.error('Error batch updating table status:', getErrorMessage(error))
    },
  })
}

// Utility hook for optimistic status updates
export const useOptimisticTableStatusUpdate = () => {
  const queryClient = useQueryClient()
  
  const updateTableStatusOptimistically = (id: string, status: string) => {
    // Update detail view
    queryClient.setQueryData(
      queryKeys.tables.detail(id),
      (oldData: Table | undefined) => {
        if (!oldData) return oldData
        return { ...oldData, status: status as any }
      }
    )
    
    // Update lists
    queryClient.setQueriesData(
      { queryKey: queryKeys.tables.lists() },
      (oldData: any) => {
        if (!oldData?.results) return oldData
        return {
          ...oldData,
          results: oldData.results.map((table: TableListItem) =>
            table.id === id ? { ...table, status: status as any } : table
          ),
        }
      }
    )
    
    // Update floor plan
    queryClient.setQueryData(
      queryKeys.tables.floorPlan(),
      (oldData: Table[] | undefined) => {
        if (!oldData) return oldData
        return oldData.map(table =>
          table.id === id ? { ...table, status: status as any } : table
        )
      }
    )
  }
  
  const revertOptimisticUpdate = (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tables.detail(id) })
    queryClient.invalidateQueries({ queryKey: queryKeys.tables.lists() })
    queryClient.invalidateQueries({ queryKey: queryKeys.tables.floorPlan() })
  }
  
  return {
    updateTableStatusOptimistically,
    revertOptimisticUpdate,
  }
}
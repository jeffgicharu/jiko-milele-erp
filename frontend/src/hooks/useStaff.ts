import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { staffService, Staff, StaffListItem, StaffCreateData, StaffUpdateData, StaffFilters } from '@/services/staffService'
import { queryKeys } from '@/lib/queryClient'
import { getErrorMessage } from '@/lib/api'

// Hook to fetch staff list with filters
export const useStaff = (filters: StaffFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.staff.list(filters),
    queryFn: () => staffService.getStaff(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes for staff data
  })
}

// Hook to fetch all staff without pagination
export const useAllStaff = () => {
  return useQuery({
    queryKey: [...queryKeys.staff.all, 'all'],
    queryFn: () => staffService.getAllStaff(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch a single staff member
export const useStaffMember = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.staff.detail(id),
    queryFn: () => staffService.getStaffMember(id),
    enabled: enabled && !!id,
  })
}

// Hook to get staff statistics
export const useStaffStats = () => {
  return useQuery({
    queryKey: queryKeys.staff.stats(),
    queryFn: () => staffService.getStaffStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes for stats
  })
}

// Hook to get current shift staff
export const useCurrentShiftStaff = () => {
  return useQuery({
    queryKey: queryKeys.staff.currentShift(),
    queryFn: () => staffService.getCurrentShiftStaff(),
    staleTime: 1 * 60 * 1000, // 1 minute for current shift data
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  })
}

// Hook to get staff schedule
export const useStaffSchedule = (startDate: string, endDate: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.staff.schedule(startDate, endDate),
    queryFn: () => staffService.getStaffSchedule(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000, // 2 minutes for schedule data
  })
}

// Hook to get staff performance
export const useStaffPerformance = (staffId: string, period?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.staff.performance(staffId, period),
    queryFn: () => staffService.getStaffPerformance(staffId, period),
    enabled: enabled && !!staffId,
    staleTime: 5 * 60 * 1000, // 5 minutes for performance data
  })
}

// Hook to create a staff member
export const useCreateStaffMember = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: StaffCreateData) => staffService.createStaffMember(data),
    onSuccess: (newStaffMember) => {
      // Invalidate staff lists to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.lists() })
      queryClient.invalidateQueries({ queryKey: [...queryKeys.staff.all, 'all'] })
      // Add the new staff member to the cache
      queryClient.setQueryData(queryKeys.staff.detail(newStaffMember.id), newStaffMember)
      // Update stats
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.stats() })
      // Update current shift if they're active
      if (newStaffMember.is_active) {
        queryClient.invalidateQueries({ queryKey: queryKeys.staff.currentShift() })
      }
    },
    onError: (error) => {
      console.error('Error creating staff member:', getErrorMessage(error))
    },
  })
}

// Hook to update a staff member
export const useUpdateStaffMember = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StaffUpdateData }) => 
      staffService.updateStaffMember(id, data),
    onSuccess: (updatedStaffMember, variables) => {
      // Update the specific staff member in cache
      queryClient.setQueryData(queryKeys.staff.detail(variables.id), updatedStaffMember)
      // Invalidate lists to ensure they reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.lists() })
      queryClient.invalidateQueries({ queryKey: [...queryKeys.staff.all, 'all'] })
      // Update stats if relevant fields changed
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.stats() })
      // Update current shift if status changed
      if ('is_active' in variables.data) {
        queryClient.invalidateQueries({ queryKey: queryKeys.staff.currentShift() })
      }
    },
    onError: (error) => {
      console.error('Error updating staff member:', getErrorMessage(error))
    },
  })
}

// Hook to toggle staff status (active/inactive)
export const useToggleStaffStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      staffService.toggleStaffStatus(id, isActive),
    onSuccess: (updatedStaffMember, variables) => {
      // Update the specific staff member in cache
      queryClient.setQueryData(queryKeys.staff.detail(variables.id), updatedStaffMember)
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.lists() })
      queryClient.invalidateQueries({ queryKey: [...queryKeys.staff.all, 'all'] })
      // Update stats and current shift
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.stats() })
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.currentShift() })
    },
    onError: (error) => {
      console.error('Error toggling staff status:', getErrorMessage(error))
    },
  })
}

// Hook to delete a staff member
export const useDeleteStaffMember = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => staffService.deleteStaffMember(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.staff.detail(deletedId) })
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.lists() })
      queryClient.invalidateQueries({ queryKey: [...queryKeys.staff.all, 'all'] })
      // Update stats and current shift
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.stats() })
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.currentShift() })
    },
    onError: (error) => {
      console.error('Error deleting staff member:', getErrorMessage(error))
    },
  })
}

// Hook for clock in/out functionality
export const useClockIn = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (staffId: string) => staffService.clockIn(staffId),
    onSuccess: (result, staffId) => {
      // Update current shift data
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.currentShift() })
      // Update staff member's status
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.detail(staffId) })
      // Update performance data if relevant
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.performance(staffId) })
    },
    onError: (error) => {
      console.error('Error clocking in:', getErrorMessage(error))
    },
  })
}

export const useClockOut = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (staffId: string) => staffService.clockOut(staffId),
    onSuccess: (result, staffId) => {
      // Update current shift data
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.currentShift() })
      // Update staff member's status
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.detail(staffId) })
      // Update performance data
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.performance(staffId) })
    },
    onError: (error) => {
      console.error('Error clocking out:', getErrorMessage(error))
    },
  })
}

// Utility hook for optimistic updates
export const useOptimisticStaffUpdate = () => {
  const queryClient = useQueryClient()
  
  const updateStaffOptimistically = (id: string, updates: Partial<Staff>) => {
    queryClient.setQueryData(
      queryKeys.staff.detail(id),
      (oldData: Staff | undefined) => {
        if (!oldData) return oldData
        return { ...oldData, ...updates }
      }
    )
  }
  
  const revertOptimisticUpdate = (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.staff.detail(id) })
  }
  
  return {
    updateStaffOptimistically,
    revertOptimisticUpdate,
  }
}

// Hook for staff analytics by role
export const useStaffAnalytics = (role?: string) => {
  return useQuery({
    queryKey: [...queryKeys.staff.stats(), 'analytics', role],
    queryFn: async () => {
      // This would call a more detailed analytics endpoint
      // For now, we'll use the basic stats with role filtering
      const stats = await staffService.getStaffStats()
      return role ? { ...stats, filtered_role: role } : stats
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for analytics
  })
}
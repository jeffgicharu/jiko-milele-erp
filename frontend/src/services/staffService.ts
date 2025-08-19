import { api } from '@/lib/api'

// Types based on backend models
export interface Staff {
  id: string
  employee_number: string
  user: {
    id: string
    username: string
    first_name: string
    last_name: string
    email: string
    is_active: boolean
  }
  full_name: string
  phone_number: string
  role: 'general_manager' | 'shift_supervisor' | 'head_chef' | 'sous_chef' | 'line_cook' | 'server' | 'host' | 'bartender' | 'busser'
  hire_date: string
  hourly_rate?: number
  emergency_contact_name?: string
  emergency_contact_phone?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StaffListItem {
  id: string
  employee_number: string
  full_name: string
  phone_number: string
  role: string
  hire_date: string
  is_active: boolean
}

export interface StaffCreateData {
  employee_number: string
  username: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  role: 'general_manager' | 'shift_supervisor' | 'head_chef' | 'sous_chef' | 'line_cook' | 'server' | 'host' | 'bartender' | 'busser'
  hire_date: string
  hourly_rate?: number
  emergency_contact_name?: string
  emergency_contact_phone?: string
  password: string
}

export interface StaffUpdateData {
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  role?: 'general_manager' | 'shift_supervisor' | 'head_chef' | 'sous_chef' | 'line_cook' | 'server' | 'host' | 'bartender' | 'busser'
  hourly_rate?: number
  emergency_contact_name?: string
  emergency_contact_phone?: string
  is_active?: boolean
}

export interface StaffFilters {
  search?: string
  role?: string
  is_active?: boolean
  hire_date_after?: string
  hire_date_before?: string
  ordering?: string
  page?: number
  page_size?: number
}

export interface PaginatedStaffResponse {
  count: number
  next?: string
  previous?: string
  results: StaffListItem[]
}

export interface StaffScheduleEntry {
  id: string
  staff_member: string
  shift_date: string
  shift_start: string
  shift_end: string
  break_start?: string
  break_end?: string
  status: 'scheduled' | 'checked_in' | 'on_break' | 'checked_out' | 'absent'
}

export const staffService = {
  // List staff with filtering and pagination
  getStaff: async (filters: StaffFilters = {}): Promise<PaginatedStaffResponse> => {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.role) params.append('role', filters.role)
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString())
    if (filters.hire_date_after) params.append('hire_date_after', filters.hire_date_after)
    if (filters.hire_date_before) params.append('hire_date_before', filters.hire_date_before)
    if (filters.ordering) params.append('ordering', filters.ordering)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.page_size) params.append('page_size', filters.page_size.toString())
    
    const response = await api.get(`/v1/staff/?${params.toString()}`)
    return response.data
  },

  // Get all staff without pagination
  getAllStaff: async (): Promise<Staff[]> => {
    const response = await api.get('/v1/staff/?page_size=1000')
    return response.data.results
  },

  // Get single staff member by ID
  getStaffMember: async (id: string): Promise<Staff> => {
    const response = await api.get(`/v1/staff/${id}/`)
    return response.data
  },

  // Create new staff member
  createStaffMember: async (data: StaffCreateData): Promise<Staff> => {
    const response = await api.post('/v1/staff/', data)
    return response.data
  },

  // Update staff member
  updateStaffMember: async (id: string, data: StaffUpdateData): Promise<Staff> => {
    const response = await api.patch(`/v1/staff/${id}/`, data)
    return response.data
  },

  // Delete staff member (deactivate)
  deleteStaffMember: async (id: string): Promise<void> => {
    await api.delete(`/v1/staff/${id}/`)
  },

  // Activate/Deactivate staff member
  toggleStaffStatus: async (id: string, isActive: boolean): Promise<Staff> => {
    const response = await api.patch(`/v1/staff/${id}/`, { is_active: isActive })
    return response.data
  },

  // Get staff statistics
  getStaffStats: async (): Promise<{
    total_staff: number
    active_staff: number
    staff_by_role: Record<string, number>
    recent_hires: number
  }> => {
    const response = await api.get('/v1/staff/stats/')
    return response.data
  },

  // Get current shift staff
  getCurrentShiftStaff: async (): Promise<StaffListItem[]> => {
    const response = await api.get('/v1/staff/current-shift/')
    return response.data
  },

  // Get staff schedule for a date range
  getStaffSchedule: async (startDate: string, endDate: string): Promise<StaffScheduleEntry[]> => {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    })
    
    const response = await api.get(`/v1/staff/schedule/?${params.toString()}`)
    return response.data
  },

  // Clock in/out functionality
  clockIn: async (staffId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/v1/staff/${staffId}/clock-in/`)
    return response.data
  },

  clockOut: async (staffId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/v1/staff/${staffId}/clock-out/`)
    return response.data
  },

  // Get staff performance metrics
  getStaffPerformance: async (staffId: string, period?: string): Promise<{
    tables_served: number
    total_sales: number
    average_table_time: number
    customer_ratings: number
    tips_earned: number
  }> => {
    const params = period ? `?period=${period}` : ''
    const response = await api.get(`/v1/staff/${staffId}/performance/${params}`)
    return response.data
  },
}
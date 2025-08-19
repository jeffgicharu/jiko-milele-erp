import { api } from '@/lib/api'

// Types based on backend models
export interface Table {
  id: string
  table_number: string
  capacity: number
  section?: string
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'out_of_order'
  x_coordinate?: number
  y_coordinate?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TableListItem {
  id: string
  table_number: string
  capacity: number
  section?: string
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'out_of_order'
  is_active: boolean
}

export interface TableCreateData {
  table_number: string
  capacity: number
  section?: string
  x_coordinate?: number
  y_coordinate?: number
  is_active?: boolean
}

export interface TableUpdateData {
  table_number?: string
  capacity?: number
  section?: string
  status?: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'out_of_order'
  x_coordinate?: number
  y_coordinate?: number
  is_active?: boolean
}

export interface TableStatusUpdateData {
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'out_of_order'
}

export interface TableFilters {
  status?: string
  section?: string
  is_active?: boolean
  capacity_min?: number
  capacity_max?: number
  search?: string
  ordering?: string
  page?: number
  page_size?: number
}

export interface PaginatedTableResponse {
  count: number
  next?: string
  previous?: string
  results: TableListItem[]
}

export const tablesService = {
  // List tables with filtering and pagination
  getTables: async (filters: TableFilters = {}): Promise<PaginatedTableResponse> => {
    const params = new URLSearchParams()
    
    if (filters.status) params.append('status', filters.status)
    if (filters.section) params.append('section', filters.section)
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString())
    if (filters.capacity_min) params.append('capacity_min', filters.capacity_min.toString())
    if (filters.capacity_max) params.append('capacity_max', filters.capacity_max.toString())
    if (filters.search) params.append('search', filters.search)
    if (filters.ordering) params.append('ordering', filters.ordering)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.page_size) params.append('page_size', filters.page_size.toString())
    
    const response = await api.get(`/v1/tables/?${params.toString()}`)
    return response.data
  },

  // Get all tables without pagination (for floor plan)
  getAllTables: async (): Promise<Table[]> => {
    const response = await api.get('/v1/tables/?page_size=1000')
    return response.data.results
  },

  // Get single table by ID
  getTable: async (id: string): Promise<Table> => {
    const response = await api.get(`/v1/tables/${id}/`)
    return response.data
  },

  // Create new table
  createTable: async (data: TableCreateData): Promise<Table> => {
    const response = await api.post('/v1/tables/', data)
    return response.data
  },

  // Update table
  updateTable: async (id: string, data: TableUpdateData): Promise<Table> => {
    const response = await api.patch(`/v1/tables/${id}/`, data)
    return response.data
  },

  // Update table status only
  updateTableStatus: async (id: string, data: TableStatusUpdateData): Promise<Table> => {
    const response = await api.patch(`/v1/tables/${id}/status/`, data)
    return response.data
  },

  // Delete table
  deleteTable: async (id: string): Promise<void> => {
    await api.delete(`/v1/tables/${id}/`)
  },

  // Get table statistics
  getTableStats: async (): Promise<{
    total_tables: number
    available_tables: number
    occupied_tables: number
    reserved_tables: number
    cleaning_tables: number
    out_of_order_tables: number
    occupancy_rate: number
  }> => {
    const response = await api.get('/v1/tables/stats/')
    return response.data
  },

  // Get table status summary
  getTableStatusSummary: async (): Promise<Record<string, number>> => {
    const response = await api.get('/v1/tables/status-summary/')
    return response.data
  },

  // Batch update table statuses
  batchUpdateTableStatus: async (updates: Array<{ id: string; status: string }>): Promise<Table[]> => {
    const response = await api.patch('/v1/tables/batch-update-status/', { updates })
    return response.data
  },
}
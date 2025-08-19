import { api } from '@/lib/api'

// Types based on backend models
export interface Customer {
  id: string
  phone_number: string
  name: string
  email?: string
  created_at: string
  loyalty_points: number
  last_visit_date?: string
  total_visits: number
  dietary_preferences?: string
  notes?: string
}

export interface CustomerListItem {
  id: string
  phone_number: string
  name: string
  total_visits: number
  loyalty_points: number
  last_visit_date?: string
}

export interface CustomerCreateData {
  phone_number: string
  name?: string
  email?: string
  dietary_preferences?: string
  notes?: string
}

export interface CustomerUpdateData {
  name?: string
  email?: string
  loyalty_points?: number
  dietary_preferences?: string
  notes?: string
}

export interface CustomerFilters {
  search?: string
  phone?: string
  name?: string
  ordering?: string
  page?: number
  page_size?: number
}

export interface PaginatedCustomerResponse {
  count: number
  next?: string
  previous?: string
  results: CustomerListItem[]
}

export const customersService = {
  // List customers with filtering and pagination
  getCustomers: async (filters: CustomerFilters = {}): Promise<PaginatedCustomerResponse> => {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.phone) params.append('phone', filters.phone)
    if (filters.name) params.append('name', filters.name)
    if (filters.ordering) params.append('ordering', filters.ordering)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.page_size) params.append('page_size', filters.page_size.toString())
    
    const response = await api.get(`/v1/customers/?${params.toString()}`)
    return response.data
  },

  // Get single customer by ID
  getCustomer: async (id: string): Promise<Customer> => {
    const response = await api.get(`/v1/customers/${id}/`)
    return response.data
  },

  // Create new customer
  createCustomer: async (data: CustomerCreateData): Promise<Customer> => {
    const response = await api.post('/v1/customers/', data)
    return response.data
  },

  // Update customer
  updateCustomer: async (id: string, data: CustomerUpdateData): Promise<Customer> => {
    const response = await api.patch(`/v1/customers/${id}/`, data)
    return response.data
  },

  // Delete customer
  deleteCustomer: async (id: string): Promise<void> => {
    await api.delete(`/v1/customers/${id}/`)
  },

  // Search customers by phone or name
  searchCustomers: async (query: { phone?: string; name?: string }): Promise<CustomerListItem[]> => {
    const params = new URLSearchParams()
    
    if (query.phone) params.append('phone', query.phone)
    if (query.name) params.append('name', query.name)
    
    const response = await api.get(`/v1/customers/search/?${params.toString()}`)
    return response.data.results || response.data
  },

  // Get customer statistics
  getCustomerStats: async (): Promise<{
    total_customers: number
    new_customers_this_month: number
    vip_customers: number
    average_visits: number
  }> => {
    const response = await api.get('/v1/customers/stats/')
    return response.data
  },
}
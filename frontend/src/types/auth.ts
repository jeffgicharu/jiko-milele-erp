export interface UserProfile {
  id: number
  staff_profile: number | null
  staff_name: string | null
  current_role: string | null
  staff_role_display: string | null
  permissions: string[]
  last_login_ip: string | null
  failed_login_attempts: number
  is_account_locked: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  last_login: string | null
  date_joined: string
  profile: UserProfile
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
  permissions: string[]
  message: string
}

export interface TokenRefreshRequest {
  refresh: string
}

export interface TokenRefreshResponse {
  access_token: string
  refresh_token?: string
}

export interface LogoutRequest {
  refresh: string
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
  confirm_password: string
}

export interface AuthContextType {
  user: User | undefined
  isLoading: boolean
  error: Error | null
  login: (credentials: LoginRequest) => void
  loginError: Error | null
  loginLoading: boolean
  logout: () => void
  logoutLoading: boolean
  isAuthenticated: boolean
  permissions: string[]
  role: string | null
  staffName: string | null
  
  // Role-based helpers
  isManager: boolean
  isKitchenStaff: boolean
  isFOHStaff: boolean
  
  // Permission helpers
  hasPermission: (permission: string) => boolean
  hasRole: (requiredRole: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Role types
export type StaffRole = 
  | 'general_manager'
  | 'shift_supervisor' 
  | 'head_chef'
  | 'sous_chef'
  | 'line_cook'
  | 'server'
  | 'host'
  | 'bartender'
  | 'busser'

// Permission types
export type Permission = 
  | 'admin'
  | 'reports'
  | 'staff_management'
  | 'financial_data'
  | 'operational_oversight'
  | 'staff_scheduling'
  | 'discount_approval'
  | 'kitchen_management'
  | 'menu_management'
  | 'inventory_management'
  | 'kitchen_operations'
  | 'recipe_management'
  | 'inventory_receiving'
  | 'kitchen_display'
  | 'order_preparation'
  | 'inventory_usage'
  | 'pos_system'
  | 'table_management'
  | 'customer_profiles'
  | 'payment_processing'
  | 'reservations'
  | 'table_assignment'
  | 'customer_checkin'
  | 'bar_inventory'
  | 'bar_reporting'
  | 'table_status'
  | 'cleaning_completion'
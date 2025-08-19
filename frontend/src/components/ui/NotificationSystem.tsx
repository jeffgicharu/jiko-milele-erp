'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast, ToastContainer } from './Alert'

interface Notification {
  id: string
  variant: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  // Convenience methods
  success: (message: string, options?: Partial<Notification>) => string
  error: (message: string, options?: Partial<Notification>) => string
  warning: (message: string, options?: Partial<Notification>) => string
  info: (message: string, options?: Partial<Notification>) => string
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxNotifications?: number
}

export function NotificationProvider({ 
  children, 
  position = 'top-right',
  maxNotifications = 5
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    setNotifications(prev => {
      const newNotifications = [{ ...notification, id }, ...prev]
      // Keep only the latest notifications if we exceed the limit
      return newNotifications.slice(0, maxNotifications)
    })
    
    return id
  }, [maxNotifications])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Convenience methods
  const success = useCallback((message: string, options?: Partial<Notification>) => {
    return addNotification({
      variant: 'success',
      message,
      duration: 4000,
      ...options,
    })
  }, [addNotification])

  const error = useCallback((message: string, options?: Partial<Notification>) => {
    return addNotification({
      variant: 'error',
      message,
      duration: 6000, // Keep error messages longer
      ...options,
    })
  }, [addNotification])

  const warning = useCallback((message: string, options?: Partial<Notification>) => {
    return addNotification({
      variant: 'warning',
      message,
      duration: 5000,
      ...options,
    })
  }, [addNotification])

  const info = useCallback((message: string, options?: Partial<Notification>) => {
    return addNotification({
      variant: 'info',
      message,
      duration: 4000,
      ...options,
    })
  }, [addNotification])

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <ToastContainer 
        toasts={notifications}
        position={position}
        onDismiss={removeNotification}
      />
    </NotificationContext.Provider>
  )
}

// Hook for API error handling with notifications
export function useApiErrorHandler() {
  const { error } = useNotifications()
  
  return useCallback((apiError: any, customMessage?: string) => {
    let message = customMessage || 'An error occurred'
    let title = 'Error'
    
    if (apiError?.response?.data) {
      const errorData = apiError.response.data
      
      // Handle different error response formats
      if (errorData.message) {
        message = errorData.message
      } else if (errorData.detail) {
        message = errorData.detail
      } else if (errorData.error) {
        message = errorData.error
      }
      
      // Set appropriate title based on status code
      const status = apiError.response.status
      switch (status) {
        case 400:
          title = 'Bad Request'
          break
        case 401:
          title = 'Unauthorized'
          message = 'Please log in to continue'
          break
        case 403:
          title = 'Access Denied'
          message = 'You do not have permission to perform this action'
          break
        case 404:
          title = 'Not Found'
          message = 'The requested resource was not found'
          break
        case 422:
          title = 'Validation Error'
          // Handle validation errors specially
          if (errorData.errors && typeof errorData.errors === 'object') {
            const fieldErrors = Object.values(errorData.errors).flat()
            message = fieldErrors.join(', ')
          }
          break
        case 429:
          title = 'Too Many Requests'
          message = 'Please wait a moment before trying again'
          break
        case 500:
          title = 'Server Error'
          message = 'Internal server error. Please try again later.'
          break
        default:
          title = 'Error'
      }
    } else if (apiError?.message) {
      message = apiError.message
    }
    
    return error(message, { title, duration: 6000 })
  }, [error])
}

// Hook for success notifications with common patterns
export function useSuccessHandler() {
  const { success } = useNotifications()
  
  return {
    created: (item: string) => success(`${item} created successfully`),
    updated: (item: string) => success(`${item} updated successfully`),
    deleted: (item: string) => success(`${item} deleted successfully`),
    saved: (item?: string) => success(`${item || 'Changes'} saved successfully`),
    generic: (message: string) => success(message),
  }
}

// Global notification helpers (for use outside components)
let notificationHandlers: NotificationContextType | null = null

export function setGlobalNotificationHandlers(handlers: NotificationContextType) {
  notificationHandlers = handlers
}

export const globalNotifications = {
  success: (message: string, options?: Partial<Notification>) => {
    notificationHandlers?.success(message, options)
  },
  error: (message: string, options?: Partial<Notification>) => {
    notificationHandlers?.error(message, options)
  },
  warning: (message: string, options?: Partial<Notification>) => {
    notificationHandlers?.warning(message, options)
  },
  info: (message: string, options?: Partial<Notification>) => {
    notificationHandlers?.info(message, options)
  },
}

// Initialize global handlers
export function NotificationInitializer() {
  const handlers = useNotifications()
  
  React.useEffect(() => {
    setGlobalNotificationHandlers(handlers)
  }, [handlers])
  
  return null
}
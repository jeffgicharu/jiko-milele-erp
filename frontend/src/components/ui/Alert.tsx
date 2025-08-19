'use client'

import React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message?: string
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode | boolean
}

const alertVariants = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'text-blue-400',
    iconComponent: Info
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: 'text-green-400',
    iconComponent: CheckCircle
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: 'text-yellow-400',
    iconComponent: AlertTriangle
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-400',
    iconComponent: AlertCircle
  }
}

export function Alert({
  variant = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  icon = true,
  className = '',
  children,
  ...props
}: AlertProps) {
  const config = alertVariants[variant]
  const IconComponent = config.iconComponent
  
  const baseClasses = 'border rounded-md p-4'
  const variantClasses = config.container
  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`.trim()
  
  const showIcon = icon !== false
  const customIcon = typeof icon === 'object' ? icon : null
  
  return (
    <div className={combinedClasses} {...props}>
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            {customIcon || (
              <IconComponent className={`h-5 w-5 ${config.icon}`} />
            )}
          </div>
        )}
        <div className={`${showIcon ? 'ml-3' : ''} flex-1`}>
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          {message && (
            <div className="text-sm">
              {message}
            </div>
          )}
          {children && (
            <div className="text-sm">
              {children}
            </div>
          )}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.icon} hover:bg-black hover:bg-opacity-10`}
                onClick={onDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface ToastProps {
  id?: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  duration?: number
  onDismiss?: (id?: string) => void
  action?: {
    label: string
    onClick: () => void
  }
}

export function Toast({
  id,
  variant = 'info',
  title,
  message,
  duration = 5000,
  onDismiss,
  action
}: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const [isExiting, setIsExiting] = React.useState(false)
  
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => {
          setIsVisible(false)
          onDismiss?.(id)
        }, 300) // Animation duration
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, id, onDismiss])
  
  if (!isVisible) return null
  
  const config = alertVariants[variant]
  const IconComponent = config.iconComponent
  
  return (
    <div
      className={`
        max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 transform
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent className={`h-5 w-5 ${config.icon}`} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {title && (
              <p className="text-sm font-medium text-gray-900">
                {title}
              </p>
            )}
            <p className={`text-sm ${title ? 'mt-1' : ''} text-gray-500`}>
              {message}
            </p>
            {action && (
              <div className="mt-3">
                <button
                  type="button"
                  className="bg-white rounded-md text-sm font-medium text-orange-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={() => {
                setIsExiting(true)
                setTimeout(() => {
                  setIsVisible(false)
                  onDismiss?.(id)
                }, 300)
              }}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastProps[]
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  onDismiss: (id?: string) => void
}

const positionClasses = {
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2'
}

export function ToastContainer({
  toasts,
  position = 'top-right',
  onDismiss
}: ToastContainerProps) {
  return (
    <div
      className={`fixed z-50 p-4 space-y-4 ${positionClasses[position]}`}
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}
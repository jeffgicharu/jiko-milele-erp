'use client'

import React from 'react'
import { Loader2, Wifi, WifiOff } from 'lucide-react'
import { Button } from './Button'
import { Skeleton, SkeletonCard, SkeletonList, SkeletonTable } from './Skeleton'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`animate-spin text-orange-600 ${sizeClasses[size]}`} />
      {text && (
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>
          {text}
        </span>
      )}
    </div>
  )
}

interface PageLoadingProps {
  title?: string
  description?: string
}

export function PageLoading({ 
  title = 'Loading...',
  description = 'Please wait while we fetch your data.'
}: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </div>
  )
}

interface SectionLoadingProps {
  className?: string
  height?: string
  showText?: boolean
}

export function SectionLoading({ 
  className = '',
  height = '12rem',
  showText = true 
}: SectionLoadingProps) {
  return (
    <div className={`flex items-center justify-center bg-white rounded-lg shadow-sm border ${className}`} style={{ height }}>
      <div className="text-center">
        <LoadingSpinner />
        {showText && (
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  )
}

interface TableLoadingProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableLoading({ 
  rows = 5, 
  columns = 4,
  className = '' 
}: TableLoadingProps) {
  return <SkeletonTable rows={rows} columns={columns} className={className} />
}

interface CardLoadingProps {
  count?: number
  showAvatar?: boolean
  showImage?: boolean
  className?: string
}

export function CardLoading({ 
  count = 1,
  showAvatar = false,
  showImage = false,
  className = ''
}: CardLoadingProps) {
  if (count === 1) {
    return <SkeletonCard className={className} showAvatar={showAvatar} showImage={showImage} />
  }
  
  return (
    <div className={`grid gap-6 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard 
          key={index}
          showAvatar={showAvatar}
          showImage={showImage}
        />
      ))}
    </div>
  )
}

interface ListLoadingProps {
  items?: number
  showAvatar?: boolean
  className?: string
}

export function ListLoading({ 
  items = 5,
  showAvatar = true,
  className = ''
}: ListLoadingProps) {
  return <SkeletonList items={items} showAvatar={showAvatar} className={className} />
}

// Network status indicator
export function NetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(true)
  
  React.useEffect(() => {
    const updateNetworkStatus = () => setIsOnline(navigator.onLine)
    
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)
    
    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [])
  
  if (isOnline) return null
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 text-center text-sm font-medium z-50">
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="w-4 h-4" />
        <span>No internet connection. Some features may be limited.</span>
      </div>
    </div>
  )
}

// Retry component for failed states
interface RetryProps {
  onRetry: () => void
  error?: string
  className?: string
}

export function Retry({ onRetry, error, className = '' }: RetryProps) {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
        <WifiOff className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-4">
        {error || 'Unable to load data. Please check your connection and try again.'}
      </p>
      
      <Button
        onClick={onRetry}
        leftIcon={<Loader2 className="w-4 h-4" />}
        variant="outline"
      >
        Try Again
      </Button>
    </div>
  )
}

// Empty state component
interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({ 
  title,
  description,
  action,
  icon,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      
      {action && (
        <Button
          onClick={action.onClick}
          leftIcon={action.icon}
          variant="primary"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Component that shows different states based on query status
interface QueryStateHandlerProps {
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  error?: any
  onRetry?: () => void
  loadingComponent?: React.ReactNode
  emptyComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  children: React.ReactNode
}

export function QueryStateHandler({
  isLoading,
  isError,
  isEmpty,
  error,
  onRetry,
  loadingComponent,
  emptyComponent,
  errorComponent,
  children
}: QueryStateHandlerProps) {
  if (isLoading) {
    return <>{loadingComponent || <SectionLoading />}</>
  }
  
  if (isError) {
    return (
      <>
        {errorComponent || (
          <Retry
            onRetry={onRetry || (() => window.location.reload())}
            error={error?.message}
          />
        )}
      </>
    )
  }
  
  if (isEmpty) {
    return <>{emptyComponent || <EmptyState title="No data found" />}</>
  }
  
  return <>{children}</>
}
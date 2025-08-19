'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './Button'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorFallbackProps {
  error: Error | null
  resetError: () => void
  errorInfo: React.ErrorInfo | null
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isNetworkError = error?.message?.toLowerCase().includes('network') || 
                        error?.message?.toLowerCase().includes('fetch')
  
  const isAuthError = error?.message?.toLowerCase().includes('unauthorized') ||
                     error?.message?.toLowerCase().includes('forbidden')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isNetworkError ? 'Connection Problem' : isAuthError ? 'Access Denied' : 'Something went wrong'}
          </h1>
          
          <p className="text-gray-600 mb-8">
            {isNetworkError 
              ? 'Please check your internet connection and try again.'
              : isAuthError 
              ? 'You do not have permission to access this resource.'
              : 'An unexpected error occurred. Our team has been notified.'}
          </p>
          
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-left">
              <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details:</h3>
              <pre className="text-xs text-red-700 overflow-auto max-h-40">
                {error.message}
                {error.stack && '\n\n' + error.stack}
              </pre>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={resetError}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              variant="primary"
            >
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.href = '/dashboard'}
              leftIcon={<Home className="w-4 h-4" />}
              variant="outline"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }
  
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error)
    console.error('Error info:', errorInfo)
    
    this.setState({
      error,
      errorInfo
    })
    
    // Report to error monitoring service
    this.props.onError?.(error, errorInfo)
    
    // Report to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Here you would send to Sentry, LogRocket, etc.
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      })
    }
  }
  
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }
  
  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          errorInfo={this.state.errorInfo}
        />
      )
    }
    
    return this.props.children
  }
}

// Hook for handling errors in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error('Error caught by useErrorHandler:', error)
    
    if (process.env.NODE_ENV === 'development') {
      console.error('Additional error info:', errorInfo)
    }
    
    // In a real app, you'd report this to your error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Report to Sentry, LogRocket, etc.
      console.error('Production error from hook:', {
        error: error.message,
        stack: error.stack,
        additionalInfo: errorInfo,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      })
    }
  }
}

// Component-specific error boundary for smaller sections
interface SectionErrorBoundaryProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function SectionErrorBoundary({ 
  children, 
  title = 'Section',
  className = ''
}: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className={`bg-white rounded-lg shadow-sm border border-red-200 p-6 ${className}`}>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title} Error
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Something went wrong loading this section.
              </p>
              {process.env.NODE_ENV === 'development' && error && (
                <details className="mb-4 text-left">
                  <summary className="cursor-pointer text-xs text-red-600 hover:text-red-800">
                    Show Error Details
                  </summary>
                  <pre className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded overflow-auto max-h-32">
                    {error.message}
                  </pre>
                </details>
              )}
              <Button
                onClick={resetError}
                size="sm"
                variant="outline"
                leftIcon={<RefreshCw className="w-3 h-3" />}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
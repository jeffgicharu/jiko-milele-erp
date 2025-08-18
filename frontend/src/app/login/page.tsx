'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, LogIn, AlertCircle, Lock } from 'lucide-react'

interface FormData {
  username: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  username?: string
  password?: string
  general?: string
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, loginLoading, loginError, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    rememberMe: false
  })
  
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check for account locked parameter
  const isLocked = searchParams.get('locked') === 'true'

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, searchParams])

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!formData.username.trim()) {
      errors.username = 'Username is required'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setFormErrors({})

    try {
      login({
        username: formData.username.trim(),
        password: formData.password
      })
    } catch {
      // Error handling is done through loginError from useAuth
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field-specific errors when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Parse login error messages
  const getErrorMessage = () => {
    if (loginError) {
      if (loginError.message.includes('credentials')) {
        return 'Invalid username or password'
      } else if (loginError.message.includes('locked')) {
        return 'Account is locked. Please contact an administrator.'
      } else if (loginError.message.includes('disabled')) {
        return 'This account has been disabled.'
      }
      return 'Login failed. Please try again.'
    }
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-md w-full mx-4">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Jiko Milele</h1>
          <p className="text-gray-600">Restaurant Management System</p>
        </div>

        {/* Account Locked Alert */}
        {isLocked && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <Lock className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Account Locked</h3>
              <p className="text-sm text-red-700 mt-1">
                Your account has been locked due to too many failed login attempts. 
                Please contact an administrator for assistance.
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error Message */}
            {getErrorMessage() && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-700">{getErrorMessage()}</p>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                  formErrors.username ? 'border-red-500' : ''
                }`}
                placeholder="Enter your username"
                disabled={isSubmitting || loginLoading}
                autoComplete="username"
                autoFocus
              />
              {formErrors.username && (
                <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    formErrors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your password"
                  disabled={isSubmitting || loginLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                disabled={isSubmitting || loginLoading}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Remember me for 7 days
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting || loginLoading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting || loginLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </div>
              )}
            </button>
          </form>

          {/* Test Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Test Accounts</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Manager:</strong> admin / admin123</p>
              <p><strong>Chef:</strong> chef / SecurePass123</p>
              <p><strong>Server:</strong> server1 / SecurePass123</p>
              <p><strong>Host:</strong> host / SecurePass123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>&copy; 2024 Jiko Milele Restaurant. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
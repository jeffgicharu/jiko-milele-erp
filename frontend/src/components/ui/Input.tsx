'use client'

import React from 'react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export function Input({
  label,
  error,
  helpText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  const baseClasses = 'block px-3 py-2 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors'
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
  const widthClasses = fullWidth ? 'w-full' : ''
  const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : ''
  
  const combinedClasses = `${baseClasses} ${errorClasses} ${widthClasses} ${iconPadding} ${className}`.trim()
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{leftIcon}</span>
          </div>
        )}
        <input
          id={inputId}
          className={combinedClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{rightIcon}</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}

interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showPasswordToggle?: boolean
}

export function PasswordInput({
  showPasswordToggle = true,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  
  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? 'text' : 'password'}
        rightIcon={
          showPasswordToggle ? (
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          ) : undefined
        }
      />
    </div>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helpText?: string
  fullWidth?: boolean
}

export function TextArea({
  label,
  error,
  helpText,
  fullWidth = true,
  className = '',
  id,
  ...props
}: TextAreaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
  
  const baseClasses = 'block px-3 py-2 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors resize-vertical'
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const combinedClasses = `${baseClasses} ${errorClasses} ${widthClasses} ${className}`.trim()
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          id={textareaId}
          className={combinedClasses}
          {...props}
        />
        {error && (
          <div className="absolute top-2 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}
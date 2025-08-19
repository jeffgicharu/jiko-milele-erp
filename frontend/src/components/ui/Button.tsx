'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const buttonVariants = {
  primary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-sm',
  ghost: 'hover:bg-gray-100 text-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
}

const buttonSizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = buttonVariants[variant]
  const sizeClasses = buttonSizes[size]
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`.trim()
  
  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  )
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon: React.ReactNode
  'aria-label': string
}

const iconButtonSizes = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3'
}

export function IconButton({
  variant = 'ghost',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = buttonVariants[variant]
  const sizeClasses = iconButtonSizes[size]
  
  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()
  
  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
    </button>
  )
}
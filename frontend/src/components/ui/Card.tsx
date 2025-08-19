'use client'

import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const cardVariants = {
  default: 'bg-white shadow-sm',
  bordered: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

export function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const baseClasses = 'rounded-lg'
  const variantClasses = cardVariants[variant]
  const paddingClass = paddingClasses[padding]
  const hoverClasses = hover ? 'transition-shadow hover:shadow-md' : ''
  
  const combinedClasses = `${baseClasses} ${variantClasses} ${paddingClass} ${hoverClasses} ${className}`.trim()
  
  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = '',
  children,
  ...props
}: CardHeaderProps) {
  const baseClasses = 'flex items-center justify-between pb-4 border-b border-gray-200'
  
  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-600 mt-1 truncate">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && (
        <div className="ml-4 flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function CardContent({
  padding = 'none',
  className = '',
  children,
  ...props
}: CardContentProps) {
  const paddingClass = paddingClasses[padding]
  
  return (
    <div className={`${paddingClass} ${className}`} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between'
}

export function CardFooter({
  align = 'right',
  className = '',
  children,
  ...props
}: CardFooterProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  }
  
  const baseClasses = 'flex items-center pt-4 border-t border-gray-200'
  const alignClass = alignClasses[align]
  
  return (
    <div className={`${baseClasses} ${alignClass} ${className}`} {...props}>
      {children}
    </div>
  )
}
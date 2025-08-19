'use client'

import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full'
      case 'rounded':
        return 'rounded-md'
      case 'rectangular':
        return 'rounded-none'
      case 'text':
      default:
        return 'rounded-sm'
    }
  }
  
  const getAnimationClasses = () => {
    switch (animation) {
      case 'wave':
        return 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]'
      case 'pulse':
        return 'animate-pulse bg-gray-200'
      case 'none':
      default:
        return 'bg-gray-200'
    }
  }
  
  const combinedStyle = {
    width,
    height,
    ...style,
  }
  
  const combinedClasses = `
    ${getVariantClasses()}
    ${getAnimationClasses()}
    ${className}
  `.trim()
  
  return (
    <div
      className={combinedClasses}
      style={combinedStyle}
      {...props}
    />
  )
}

// Specific skeleton components for common use cases
export function SkeletonText({ 
  lines = 1, 
  className = '',
  lineHeight = '1.2rem',
  spacing = '0.5rem' 
}: { 
  lines?: number
  className?: string
  lineHeight?: string
  spacing?: string
}) {
  return (
    <div className={className}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height={lineHeight}
          width={index === lines - 1 ? '80%' : '100%'}
          style={{ marginBottom: index < lines - 1 ? spacing : 0 }}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ 
  size = 40,
  className = '' 
}: { 
  size?: number
  className?: string 
}) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  )
}

export function SkeletonCard({ 
  className = '',
  showAvatar = false,
  showImage = false,
  textLines = 3 
}: { 
  className?: string
  showAvatar?: boolean
  showImage?: boolean
  textLines?: number
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {showImage && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="12rem"
          className="mb-4"
        />
      )}
      
      <div className="space-y-4">
        {showAvatar && (
          <div className="flex items-center space-x-3">
            <SkeletonAvatar size={48} />
            <div className="flex-1 space-y-2">
              <Skeleton height="1.25rem" width="40%" />
              <Skeleton height="1rem" width="60%" />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Skeleton height="1.5rem" width="80%" />
          <SkeletonText lines={textLines} />
        </div>
        
        <div className="flex space-x-2">
          <Skeleton height="2rem" width="5rem" variant="rounded" />
          <Skeleton height="2rem" width="4rem" variant="rounded" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonTable({ 
  rows = 5,
  columns = 4,
  className = '' 
}: { 
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton key={index} height="1rem" width="80%" />
          ))}
        </div>
      </div>
      
      {/* Table Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <Skeleton key={colIndex} height="1rem" width="90%" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonList({ 
  items = 5,
  className = '',
  showAvatar = true 
}: { 
  items?: number
  className?: string
  showAvatar?: boolean
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
          {showAvatar && <SkeletonAvatar size={40} />}
          <div className="flex-1 space-y-2">
            <Skeleton height="1.25rem" width="60%" />
            <Skeleton height="1rem" width="40%" />
          </div>
          <Skeleton height="2rem" width="4rem" variant="rounded" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonDashboard({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton height="0.875rem" width="60%" />
                <Skeleton height="2rem" width="40%" />
              </div>
              <SkeletonAvatar size={32} />
            </div>
            <div className="mt-4">
              <Skeleton height="0.875rem" width="80%" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard showImage textLines={4} />
        <SkeletonCard showAvatar textLines={3} />
      </div>
      
      {/* Table */}
      <SkeletonTable rows={6} columns={5} />
    </div>
  )
}
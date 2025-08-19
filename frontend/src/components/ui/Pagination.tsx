'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showPrevNext?: boolean
  maxVisiblePages?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 7,
  size = 'md',
  className = ''
}: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = []
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      const start = Math.max(2, currentPage - Math.floor((maxVisiblePages - 3) / 2))
      const end = Math.min(totalPages - 1, currentPage + Math.floor((maxVisiblePages - 3) / 2))
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('ellipsis')
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis')
      }
      
      // Always show last page (if more than 1 page)
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }
  
  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  
  const baseButtonClasses = `inline-flex items-center justify-center font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]}`
  
  const pageButtonClasses = (isActive: boolean) => `
    ${baseButtonClasses} 
    ${isActive 
      ? 'bg-orange-50 border-orange-500 text-orange-600 z-10' 
      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
    }
  `
  
  const navButtonClasses = `${baseButtonClasses} bg-white border-gray-300 text-gray-500 hover:bg-gray-50`
  
  const visiblePages = getVisiblePages()
  
  if (totalPages <= 1) {
    return null
  }
  
  return (
    <nav className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center -space-x-px rounded-md shadow-sm">
        {/* First Page Button */}
        {showFirstLast && currentPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`${navButtonClasses} rounded-l-md`}
              aria-label="Go to first page"
            >
              First
            </button>
          </>
        )}
        
        {/* Previous Button */}
        {showPrevNext && (
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`${navButtonClasses} ${!showFirstLast && currentPage === 1 ? 'rounded-l-md' : ''}`}
            aria-label="Go to previous page"
          >
            <ChevronLeft className={iconSizeClasses[size]} />
            <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
          </button>
        )}
        
        {/* Page Numbers */}
        {visiblePages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className={`${baseButtonClasses} bg-white border-gray-300 text-gray-400 cursor-default`}
              >
                <MoreHorizontal className={iconSizeClasses[size]} />
              </span>
            )
          }
          
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={pageButtonClasses(page === currentPage)}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}
        
        {/* Next Button */}
        {showPrevNext && (
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`${navButtonClasses} ${!showFirstLast && currentPage === totalPages ? 'rounded-r-md' : ''}`}
            aria-label="Go to next page"
          >
            <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
            <ChevronRight className={iconSizeClasses[size]} />
          </button>
        )}
        
        {/* Last Page Button */}
        {showFirstLast && currentPage < totalPages && (
          <button
            onClick={() => onPageChange(totalPages)}
            className={`${navButtonClasses} rounded-r-md`}
            aria-label="Go to last page"
          >
            Last
          </button>
        )}
      </div>
    </nav>
  )
}

interface PaginationInfoProps {
  currentPage: number
  pageSize: number
  totalItems: number
  className?: string
}

export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
  className = ''
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)
  
  return (
    <div className={`text-sm text-gray-700 ${className}`}>
      Showing <span className="font-medium">{startItem}</span> to{' '}
      <span className="font-medium">{endItem}</span> of{' '}
      <span className="font-medium">{totalItems}</span> results
    </div>
  )
}

interface PaginationWrapperProps {
  children: React.ReactNode
  info?: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'between'
}

export function PaginationWrapper({
  children,
  info,
  className = '',
  align = 'between'
}: PaginationWrapperProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  }
  
  return (
    <div className={`flex items-center ${alignClasses[align]} ${className}`}>
      {info && align === 'between' && <div>{info}</div>}
      <div>{children}</div>
      {info && align !== 'between' && <div>{info}</div>}
    </div>
  )
}
'use client'

import React from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdropClick?: boolean
  showCloseButton?: boolean
}

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  showCloseButton = true
}: ModalProps) {
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose()
    }
  }
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg shadow-xl w-full ${modalSizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
}

export function ModalHeader({
  title,
  subtitle,
  className = '',
  children,
  ...props
}: ModalHeaderProps) {
  return (
    <div className={`p-6 border-b border-gray-200 ${className}`} {...props}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-900">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-sm text-gray-600 mt-1">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  )
}

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function ModalContent({
  padding = 'md',
  className = '',
  children,
  ...props
}: ModalContentProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return (
    <div className={`${paddingClasses[padding]} ${className}`} {...props}>
      {children}
    </div>
  )
}

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between'
}

export function ModalFooter({
  align = 'right',
  className = '',
  children,
  ...props
}: ModalFooterProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  }
  
  return (
    <div className={`flex items-center space-x-3 p-6 border-t border-gray-200 ${alignClasses[align]} ${className}`} {...props}>
      {children}
    </div>
  )
}
'use client'

import React from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'

interface Option {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  error?: string
  helpText?: string
  options: Option[]
  placeholder?: string
  fullWidth?: boolean
}

export function Select({
  label,
  error,
  helpText,
  options,
  placeholder,
  fullWidth = true,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
  
  const baseClasses = 'block px-3 py-2 pr-10 border rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors appearance-none'
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const combinedClasses = `${baseClasses} ${errorClasses} ${widthClasses} ${className}`.trim()
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={combinedClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {error ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
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

interface MultiSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'multiple'> {
  label?: string
  error?: string
  helpText?: string
  options: Option[]
  selectedValues?: string[]
  onSelectionChange?: (values: string[]) => void
  fullWidth?: boolean
}

export function MultiSelect({
  label,
  error,
  helpText,
  options,
  selectedValues = [],
  onSelectionChange,
  fullWidth = true,
  className = '',
  id,
  ...props
}: MultiSelectProps) {
  const selectId = id || `multiselect-${Math.random().toString(36).substr(2, 9)}`
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value)
    onSelectionChange?.(values)
  }
  
  const baseClasses = 'block px-3 py-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors'
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const combinedClasses = `${baseClasses} ${errorClasses} ${widthClasses} ${className}`.trim()
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={combinedClasses}
          multiple
          value={selectedValues}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
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
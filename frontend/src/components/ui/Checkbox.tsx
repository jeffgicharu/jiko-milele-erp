'use client'

import React from 'react'
import { Check, Minus } from 'lucide-react'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  error?: string
  indeterminate?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Checkbox({
  label,
  description,
  error,
  indeterminate = false,
  size = 'md',
  className = '',
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
  const checkboxRef = React.useRef<HTMLInputElement>(null)
  
  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }
  
  const baseClasses = 'rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-2 focus:ring-offset-2 transition-colors'
  const errorClasses = error ? 'border-red-500' : ''
  const combinedClasses = `${baseClasses} ${errorClasses} ${sizeClasses[size]} ${className}`.trim()
  
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          ref={checkboxRef}
          id={checkboxId}
          type="checkbox"
          className={combinedClasses}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="ml-3 text-sm">
          {label && (
            <label htmlFor={checkboxId} className="font-medium text-gray-700 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-gray-500">{description}</p>
          )}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

interface CheckboxGroupProps {
  label?: string
  error?: string
  helpText?: string
  options: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
  }>
  selectedValues?: string[]
  onChange?: (values: string[]) => void
  direction?: 'vertical' | 'horizontal'
}

export function CheckboxGroup({
  label,
  error,
  helpText,
  options,
  selectedValues = [],
  onChange,
  direction = 'vertical'
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter(value => value !== optionValue)
    
    onChange?.(newValues)
  }
  
  const containerClasses = direction === 'vertical' ? 'space-y-3' : 'flex flex-wrap gap-6'
  
  return (
    <div>
      {label && (
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {helpText && !error && (
            <p className="mt-1 text-sm text-gray-500">{helpText}</p>
          )}
        </div>
      )}
      <div className={containerClasses}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            description={option.description}
            checked={selectedValues.includes(option.value)}
            disabled={option.disabled}
            onChange={(e) => handleChange(option.value, e.target.checked)}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Radio({
  label,
  description,
  error,
  size = 'md',
  className = '',
  id,
  ...props
}: RadioProps) {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }
  
  const baseClasses = 'border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-2 focus:ring-offset-2 transition-colors'
  const errorClasses = error ? 'border-red-500' : ''
  const combinedClasses = `${baseClasses} ${errorClasses} ${sizeClasses[size]} ${className}`.trim()
  
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={radioId}
          type="radio"
          className={combinedClasses}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="ml-3 text-sm">
          {label && (
            <label htmlFor={radioId} className="font-medium text-gray-700 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-gray-500">{description}</p>
          )}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

interface RadioGroupProps {
  label?: string
  error?: string
  helpText?: string
  options: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
  }>
  selectedValue?: string
  onChange?: (value: string) => void
  direction?: 'vertical' | 'horizontal'
  name: string
}

export function RadioGroup({
  label,
  error,
  helpText,
  options,
  selectedValue,
  onChange,
  direction = 'vertical',
  name
}: RadioGroupProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }
  
  const containerClasses = direction === 'vertical' ? 'space-y-3' : 'flex flex-wrap gap-6'
  
  return (
    <div>
      {label && (
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {helpText && !error && (
            <p className="mt-1 text-sm text-gray-500">{helpText}</p>
          )}
        </div>
      )}
      <div className={containerClasses}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            checked={selectedValue === option.value}
            disabled={option.disabled}
            onChange={handleChange}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
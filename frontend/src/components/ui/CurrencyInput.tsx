'use client'

import React from 'react'
import { DollarSign } from 'lucide-react'
import { Input } from './Input'

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  error?: string
  helpText?: string
  value?: number
  onChange?: (value: number) => void
  currency?: 'KES' | 'USD' | 'EUR' | 'GBP'
  allowNegative?: boolean
  maxValue?: number
  minValue?: number
  decimalPlaces?: number
  fullWidth?: boolean
}

const currencyConfigs = {
  KES: {
    symbol: 'KES',
    code: 'KES',
    flag: '🇰🇪',
    position: 'before' as const,
    separator: ',',
    decimal: '.'
  },
  USD: {
    symbol: '$',
    code: 'USD',
    flag: '🇺🇸',
    position: 'before' as const,
    separator: ',',
    decimal: '.'
  },
  EUR: {
    symbol: '€',
    code: 'EUR',
    flag: '🇪🇺',
    position: 'after' as const,
    separator: ',',
    decimal: '.'
  },
  GBP: {
    symbol: '£',
    code: 'GBP',
    flag: '🇬🇧',
    position: 'before' as const,
    separator: ',',
    decimal: '.'
  }
}

export function CurrencyInput({
  label,
  error,
  helpText,
  value = 0,
  onChange,
  currency = 'KES',
  allowNegative = false,
  maxValue,
  minValue = 0,
  decimalPlaces = 2,
  fullWidth = true,
  className = '',
  ...props
}: CurrencyInputProps) {
  const config = currencyConfigs[currency]
  const [displayValue, setDisplayValue] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)
  
  // Format number for display
  const formatNumber = (num: number) => {
    if (isNaN(num)) return ''
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: isFocused ? 0 : decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(num)
  }
  
  // Parse display value back to number
  const parseNumber = (str: string) => {
    const cleaned = str.replace(/[^\d.-]/g, '')
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
  }
  
  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumber(value))
    }
  }, [value, isFocused, decimalPlaces])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Allow typing during focus
    if (isFocused) {
      setDisplayValue(inputValue)
      return
    }
    
    const numericValue = parseNumber(inputValue)
    
    // Apply constraints
    let constrainedValue = numericValue
    
    if (!allowNegative && constrainedValue < 0) {
      constrainedValue = 0
    }
    
    if (minValue !== undefined && constrainedValue < minValue) {
      constrainedValue = minValue
    }
    
    if (maxValue !== undefined && constrainedValue > maxValue) {
      constrainedValue = maxValue
    }
    
    onChange?.(constrainedValue)
  }
  
  const handleFocus = () => {
    setIsFocused(true)
    setDisplayValue(value.toString())
  }
  
  const handleBlur = () => {
    setIsFocused(false)
    const numericValue = parseNumber(displayValue)
    
    // Apply constraints on blur
    let constrainedValue = numericValue
    
    if (!allowNegative && constrainedValue < 0) {
      constrainedValue = 0
    }
    
    if (minValue !== undefined && constrainedValue < minValue) {
      constrainedValue = minValue
    }
    
    if (maxValue !== undefined && constrainedValue > maxValue) {
      constrainedValue = maxValue
    }
    
    onChange?.(constrainedValue)
  }
  
  const inputValue = isFocused ? displayValue : formatNumber(value)
  const leftAddon = config.position === 'before' ? config.symbol : undefined
  const rightAddon = config.position === 'after' ? config.symbol : undefined
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="w-4 h-4 inline mr-1" />
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftAddon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm font-medium">
              {config.flag && <span className="mr-1">{config.flag}</span>}
              {leftAddon}
            </span>
          </div>
        )}
        
        <input
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors text-right
            ${leftAddon ? 'pl-16' : ''}
            ${rightAddon ? 'pr-16' : ''}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        
        {rightAddon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm font-medium">
              {rightAddon}
              {config.flag && <span className="ml-1">{config.flag}</span>}
            </span>
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

interface CurrencyDisplayProps {
  amount: number
  currency?: 'KES' | 'USD' | 'EUR' | 'GBP'
  showFlag?: boolean
  showCode?: boolean
  decimalPlaces?: number
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function CurrencyDisplay({
  amount,
  currency = 'KES',
  showFlag = false,
  showCode = false,
  decimalPlaces = 2,
  className = '',
  size = 'md'
}: CurrencyDisplayProps) {
  const config = currencyConfigs[currency]
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  
  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Math.abs(num))
  }
  
  const isNegative = amount < 0
  const formattedAmount = formatAmount(amount)
  
  const displayText = config.position === 'before' 
    ? `${config.symbol} ${formattedAmount}`
    : `${formattedAmount} ${config.symbol}`
    
  return (
    <span className={`inline-flex items-center space-x-1 font-mono ${sizeClasses[size]} ${isNegative ? 'text-red-600' : 'text-gray-900'} ${className}`}>
      {showFlag && <span>{config.flag}</span>}
      <span>
        {isNegative && '-'}
        {displayText}
      </span>
      {showCode && <span className="text-xs text-gray-500">({config.code})</span>}
    </span>
  )
}

// Utility functions for currency formatting
export const formatCurrency = (amount: number, currency: 'KES' | 'USD' | 'EUR' | 'GBP' = 'KES') => {
  const config = currencyConfigs[currency]
  
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))
  
  const displayText = config.position === 'before' 
    ? `${config.symbol} ${formatted}`
    : `${formatted} ${config.symbol}`
    
  return amount < 0 ? `-${displayText}` : displayText
}

export const parseCurrency = (str: string): number => {
  const cleaned = str.replace(/[^\d.-]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}
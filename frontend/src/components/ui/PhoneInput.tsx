'use client'

import React from 'react'
import { Phone, AlertCircle } from 'lucide-react'
import { Input } from './Input'

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  error?: string
  helpText?: string
  value?: string
  onChange?: (value: string) => void
  country?: 'KE' | 'UG' | 'TZ' // East African countries
  autoFormat?: boolean
  fullWidth?: boolean
}

const countryConfigs = {
  KE: {
    code: '+254',
    flag: '🇰🇪',
    placeholder: '+254701234567',
    pattern: /^(\+254|0)?([7][0-9]{8})$/,
    format: (number: string) => {
      const digits = number.replace(/\D/g, '')
      
      // If starts with 0, replace with 254
      if (digits.startsWith('0')) {
        return '+254' + digits.slice(1)
      }
      
      // If starts with 254, add +
      if (digits.startsWith('254')) {
        return '+' + digits
      }
      
      // If starts with 7 and is 9 digits, add +254
      if (digits.startsWith('7') && digits.length === 9) {
        return '+254' + digits
      }
      
      // If already formatted correctly
      if (digits.startsWith('254') && digits.length === 12) {
        return '+' + digits
      }
      
      return number.startsWith('+') ? number : '+' + number
    }
  },
  UG: {
    code: '+256',
    flag: '🇺🇬',
    placeholder: '+256701234567',
    pattern: /^(\+256|0)?([7][0-9]{8})$/,
    format: (number: string) => {
      const digits = number.replace(/\D/g, '')
      
      if (digits.startsWith('0')) {
        return '+256' + digits.slice(1)
      }
      
      if (digits.startsWith('256')) {
        return '+' + digits
      }
      
      if (digits.startsWith('7') && digits.length === 9) {
        return '+256' + digits
      }
      
      return number.startsWith('+') ? number : '+' + number
    }
  },
  TZ: {
    code: '+255',
    flag: '🇹🇿',
    placeholder: '+255701234567',
    pattern: /^(\+255|0)?([67][0-9]{8})$/,
    format: (number: string) => {
      const digits = number.replace(/\D/g, '')
      
      if (digits.startsWith('0')) {
        return '+255' + digits.slice(1)
      }
      
      if (digits.startsWith('255')) {
        return '+' + digits
      }
      
      if ((digits.startsWith('6') || digits.startsWith('7')) && digits.length === 9) {
        return '+255' + digits
      }
      
      return number.startsWith('+') ? number : '+' + number
    }
  }
}

export function PhoneInput({
  label,
  error,
  helpText,
  value = '',
  onChange,
  country = 'KE',
  autoFormat = true,
  fullWidth = true,
  className = '',
  ...props
}: PhoneInputProps) {
  const config = countryConfigs[country]
  const [internalValue, setInternalValue] = React.useState(value)
  
  React.useEffect(() => {
    setInternalValue(value)
  }, [value])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    
    if (autoFormat) {
      newValue = config.format(newValue)
    }
    
    setInternalValue(newValue)
    onChange?.(newValue)
  }
  
  const isValid = (phoneNumber: string) => {
    if (!phoneNumber) return true // Empty is valid (unless required)
    return config.pattern.test(phoneNumber)
  }
  
  const formatDisplayValue = (phoneNumber: string) => {
    if (!phoneNumber) return ''
    
    // Remove country code for display formatting
    const withoutCode = phoneNumber.replace(config.code, '').replace('+', '')
    
    // Format as XXX XXX XXX for readability
    if (withoutCode.length >= 6) {
      return `${config.code} ${withoutCode.slice(0, 3)} ${withoutCode.slice(3, 6)} ${withoutCode.slice(6)}`
    } else if (withoutCode.length >= 3) {
      return `${config.code} ${withoutCode.slice(0, 3)} ${withoutCode.slice(3)}`
    } else {
      return `${config.code} ${withoutCode}`
    }
  }
  
  const validationError = error || (!isValid(internalValue) && internalValue ? `Invalid ${country} phone number` : undefined)
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-1" />
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-sm text-gray-500">
            {config.flag}
          </span>
        </div>
        
        <input
          type="tel"
          value={internalValue}
          onChange={handleInputChange}
          placeholder={config.placeholder}
          className={`
            block w-full pl-12 pr-3 py-2 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors
            ${validationError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        
        {validationError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>
      
      {validationError && (
        <p className="mt-1 text-sm text-red-600">{validationError}</p>
      )}
      
      {helpText && !validationError && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      
      {/* Show formatted version below for reference */}
      {internalValue && isValid(internalValue) && (
        <p className="mt-1 text-xs text-gray-400">
          Formatted: {formatDisplayValue(internalValue)}
        </p>
      )}
    </div>
  )
}

interface PhoneDisplayProps {
  phone: string
  country?: 'KE' | 'UG' | 'TZ'
  showFlag?: boolean
  showCountryCode?: boolean
  className?: string
}

export function PhoneDisplay({
  phone,
  country = 'KE',
  showFlag = true,
  showCountryCode = true,
  className = ''
}: PhoneDisplayProps) {
  const config = countryConfigs[country]
  
  if (!phone) return null
  
  const formatForDisplay = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '')
    
    let formattedNumber = phoneNumber
    
    // If it's a full international number, format it nicely
    if (cleanNumber.startsWith('254') || cleanNumber.startsWith('256') || cleanNumber.startsWith('255')) {
      const countryCode = cleanNumber.slice(0, 3)
      const number = cleanNumber.slice(3)
      
      if (number.length >= 6) {
        formattedNumber = `+${countryCode} ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
      } else if (number.length >= 3) {
        formattedNumber = `+${countryCode} ${number.slice(0, 3)} ${number.slice(3)}`
      } else {
        formattedNumber = `+${countryCode} ${number}`
      }
    }
    
    return formattedNumber.trim()
  }
  
  const displayNumber = showCountryCode ? formatForDisplay(phone) : phone.replace(/^\+254|^\+256|^\+255/, '')
  
  return (
    <span className={`inline-flex items-center space-x-1 ${className}`}>
      {showFlag && <span className="text-sm">{config.flag}</span>}
      <span className="font-mono text-sm">{displayNumber}</span>
    </span>
  )
}
'use client'

import { useState } from 'react'
import { 
  X,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Shield,
  Save,
  UserPlus
} from 'lucide-react'

interface Staff {
  id: string
  employeeNumber: string
  name: string
  role: string
  email: string
  phone: string
  isActive: boolean
  hireDate: string
  hourlyRate?: number
}

interface StaffModalProps {
  staff: Staff | null
  isOpen: boolean
  isCreating: boolean
  onClose: () => void
}

export function StaffModal({ staff, isOpen, isCreating, onClose }: StaffModalProps) {
  const [formData, setFormData] = useState({
    employeeNumber: staff?.employeeNumber || '',
    name: staff?.name || '',
    role: staff?.role || 'server',
    email: staff?.email || '',
    phone: staff?.phone || '',
    isActive: staff?.isActive ?? true,
    hireDate: staff?.hireDate || new Date().toISOString().split('T')[0],
    hourlyRate: staff?.hourlyRate || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const roleOptions = [
    { value: 'general_manager', label: 'General Manager' },
    { value: 'shift_supervisor', label: 'Shift Supervisor' },
    { value: 'head_chef', label: 'Head Chef' },
    { value: 'sous_chef', label: 'Sous Chef' },
    { value: 'line_cook', label: 'Line Cook' },
    { value: 'server', label: 'Server' },
    { value: 'host', label: 'Host' },
    { value: 'bartender', label: 'Bartender' },
    { value: 'busser', label: 'Busser' }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.employeeNumber.trim()) {
      newErrors.employeeNumber = 'Employee number is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+254[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be in format +254XXXXXXXXX'
    }

    if (!formData.hireDate) {
      newErrors.hireDate = 'Hire date is required'
    }

    if (formData.hourlyRate && (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0)) {
      newErrors.hourlyRate = 'Hourly rate must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      onClose()
    } catch (error) {
      console.error('Error saving staff:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {isCreating ? (
                <UserPlus className="w-6 h-6 text-orange-600" />
              ) : (
                <User className="w-6 h-6 text-orange-600" />
              )}
              <h3 className="text-lg font-medium text-gray-900">
                {isCreating ? 'Add New Staff Member' : `Edit ${staff?.name}`}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Employee Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Number *
              </label>
              <input
                type="text"
                value={formData.employeeNumber}
                onChange={(e) => handleInputChange('employeeNumber', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${
                  errors.employeeNumber 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
                placeholder="EMP001"
              />
              {errors.employeeNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.employeeNumber}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${
                  errors.name 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${
                  errors.email 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
                placeholder="john@jikomilele.co.ke"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${
                  errors.phone 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
                placeholder="+254701234567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Hire Date and Hourly Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hire Date *
                </label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => handleInputChange('hireDate', e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                    errors.hireDate 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                />
                {errors.hireDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.hireDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate (KES)
                </label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${
                    errors.hourlyRate 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                  placeholder="800"
                  min="0"
                  step="50"
                />
                {errors.hourlyRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>
                )}
              </div>
            </div>

            {/* Active Status */}
            {!isCreating && (
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active Employee</span>
                </label>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isCreating ? 'Creating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isCreating ? 'Create Staff Member' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
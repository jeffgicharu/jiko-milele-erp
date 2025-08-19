'use client'

import { useState } from 'react'
import { 
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  Heart,
  Save,
  UserPlus,
  Award,
  ShoppingBag,
  StickyNote,
  Plus,
  Minus
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  visitCount: number
  totalSpent: number
  loyaltyPoints: number
  lastVisit: string
  dateJoined: string
  dietaryPreferences?: string[]
  notes?: string
  favoriteItems?: string[]
  isVip: boolean
}

interface CustomerModalProps {
  customer: Customer | null
  isOpen: boolean
  isCreating: boolean
  onClose: () => void
}

export function CustomerModal({ customer, isOpen, isCreating, onClose }: CustomerModalProps) {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    visitCount: customer?.visitCount || 0,
    totalSpent: customer?.totalSpent || 0,
    loyaltyPoints: customer?.loyaltyPoints || 0,
    lastVisit: customer?.lastVisit || new Date().toISOString().split('T')[0],
    dateJoined: customer?.dateJoined || new Date().toISOString().split('T')[0],
    dietaryPreferences: customer?.dietaryPreferences || [],
    notes: customer?.notes || '',
    favoriteItems: customer?.favoriteItems || [],
    isVip: customer?.isVip || false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newDietaryPreference, setNewDietaryPreference] = useState('')
  const [newFavoriteItem, setNewFavoriteItem] = useState('')

  if (!isOpen) return null

  const commonDietaryPreferences = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut Allergy',
    'Halal',
    'Kosher',
    'Low Sodium',
    'Diabetic Friendly'
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+254[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be in format +254XXXXXXXXX'
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.dateJoined) {
      newErrors.dateJoined = 'Join date is required'
    }

    if (formData.visitCount < 0) {
      newErrors.visitCount = 'Visit count cannot be negative'
    }

    if (formData.totalSpent < 0) {
      newErrors.totalSpent = 'Total spent cannot be negative'
    }

    if (formData.loyaltyPoints < 0) {
      newErrors.loyaltyPoints = 'Loyalty points cannot be negative'
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Customer data:', formData)
      onClose()
    } catch (error) {
      console.error('Error saving customer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '')
    
    // If starts with 0, replace with 254
    if (digits.startsWith('0')) {
      return '+254' + digits.slice(1)
    }
    
    // If starts with 254, add +
    if (digits.startsWith('254')) {
      return '+' + digits
    }
    
    // If starts with 7, add +254
    if (digits.startsWith('7') && digits.length === 9) {
      return '+254' + digits
    }
    
    return phone
  }

  const addDietaryPreference = (preference: string) => {
    if (preference && !formData.dietaryPreferences.includes(preference)) {
      handleInputChange('dietaryPreferences', [...formData.dietaryPreferences, preference])
      setNewDietaryPreference('')
    }
  }

  const removeDietaryPreference = (preference: string) => {
    handleInputChange('dietaryPreferences', formData.dietaryPreferences.filter(p => p !== preference))
  }

  const addFavoriteItem = () => {
    if (newFavoriteItem && !formData.favoriteItems.includes(newFavoriteItem)) {
      handleInputChange('favoriteItems', [...formData.favoriteItems, newFavoriteItem])
      setNewFavoriteItem('')
    }
  }

  const removeFavoriteItem = (item: string) => {
    handleInputChange('favoriteItems', formData.favoriteItems.filter(i => i !== item))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {isCreating ? <UserPlus className="w-6 h-6 text-orange-600" /> : <User className="w-6 h-6 text-orange-600" />}
            <h2 className="text-xl font-semibold text-gray-900">
              {isCreating ? 'Add New Customer' : 'Edit Customer'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Customer Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter customer name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+254701234567"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="customer@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date Joined *
              </label>
              <input
                type="date"
                value={formData.dateJoined}
                onChange={(e) => handleInputChange('dateJoined', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.dateJoined ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateJoined && <p className="text-red-500 text-sm mt-1">{errors.dateJoined}</p>}
            </div>
          </div>

          {/* Customer Status */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isVip}
                onChange={(e) => handleInputChange('isVip', e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">VIP Customer</span>
            </label>
          </div>

          {/* Visit Statistics */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visit Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ShoppingBag className="w-4 h-4 inline mr-1" />
                  Visit Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.visitCount}
                  onChange={(e) => handleInputChange('visitCount', Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.visitCount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.visitCount && <p className="text-red-500 text-sm mt-1">{errors.visitCount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Spent (KES)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.totalSpent}
                  onChange={(e) => handleInputChange('totalSpent', Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.totalSpent ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.totalSpent && <p className="text-red-500 text-sm mt-1">{errors.totalSpent}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award className="w-4 h-4 inline mr-1" />
                  Loyalty Points
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.loyaltyPoints}
                  onChange={(e) => handleInputChange('loyaltyPoints', Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.loyaltyPoints ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.loyaltyPoints && <p className="text-red-500 text-sm mt-1">{errors.loyaltyPoints}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Last Visit
              </label>
              <input
                type="date"
                value={formData.lastVisit}
                onChange={(e) => handleInputChange('lastVisit', e.target.value)}
                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Dietary Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Heart className="w-4 h-4 inline mr-1" />
              Dietary Preferences
            </label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {commonDietaryPreferences.map(pref => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => addDietaryPreference(pref)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      formData.dietaryPreferences.includes(pref)
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newDietaryPreference}
                  onChange={(e) => setNewDietaryPreference(e.target.value)}
                  placeholder="Add custom preference"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => addDietaryPreference(newDietaryPreference)}
                  className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.dietaryPreferences.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.dietaryPreferences.map(pref => (
                    <span key={pref} className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                      {pref}
                      <button
                        type="button"
                        onClick={() => removeDietaryPreference(pref)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Favorite Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Favorite Menu Items
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newFavoriteItem}
                  onChange={(e) => setNewFavoriteItem(e.target.value)}
                  placeholder="Add favorite menu item"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={addFavoriteItem}
                  className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.favoriteItems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.favoriteItems.map(item => (
                    <span key={item} className="inline-flex items-center px-3 py-1 text-sm bg-orange-50 text-orange-700 rounded-full">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeFavoriteItem(item)}
                        className="ml-2 text-orange-600 hover:text-orange-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <StickyNote className="w-4 h-4 inline mr-1" />
              Service Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Add any special notes about this customer (preferences, special occasions, etc.)"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isCreating ? 'Add Customer' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
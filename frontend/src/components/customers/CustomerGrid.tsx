'use client'

import { 
  Star,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  Award,
  Heart,
  Edit
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

interface CustomerGridProps {
  customers: Customer[]
  onEditCustomer: (customer: Customer) => void
}

export function CustomerGrid({ customers, onEditCustomer }: CustomerGridProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const getCustomerBadgeColor = (customer: Customer) => {
    if (customer.isVip) return 'bg-yellow-100 text-yellow-800'
    if (customer.visitCount >= 20) return 'bg-blue-100 text-blue-800'
    if (customer.visitCount >= 10) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getCustomerBadgeText = (customer: Customer) => {
    if (customer.isVip) return 'VIP'
    if (customer.visitCount >= 20) return 'Frequent'
    if (customer.visitCount >= 10) return 'Regular'
    return 'New'
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
        <p className="text-gray-500 mb-6">Try adjusting your search terms or filters to find customers.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map((customer) => (
        <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          {/* Customer Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(customer.name)}`}>
                  {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                    {customer.isVip && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCustomerBadgeColor(customer)}`}>
                    {getCustomerBadgeText(customer)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onEditCustomer(customer)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Edit Customer"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 font-medium">{customer.phone}</span>
            </div>
            {customer.email && (
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 truncate">{customer.email}</span>
              </div>
            )}
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600">Last visit {formatDate(customer.lastVisit)}</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="px-6 pb-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                  <ShoppingBag className="w-3 h-3" />
                  <span>Visits</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{customer.visitCount}</p>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                  <span className="text-xs">KES</span>
                  <span>Spent</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{Math.round(customer.totalSpent / 1000)}K</p>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                  <Award className="w-3 h-3" />
                  <span>Points</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{customer.loyaltyPoints}</p>
              </div>
            </div>
          </div>

          {/* Dietary Preferences */}
          {customer.dietaryPreferences && customer.dietaryPreferences.length > 0 && (
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                {customer.dietaryPreferences.map((pref, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    <Heart className="w-3 h-3 mr-1" />
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Items */}
          {customer.favoriteItems && customer.favoriteItems.length > 0 && (
            <div className="px-6 pb-6">
              <p className="text-xs font-medium text-gray-500 mb-2">Favorite Items</p>
              <div className="flex flex-wrap gap-1">
                {customer.favoriteItems.slice(0, 3).map((item, index) => (
                  <span key={index} className="inline-block px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded">
                    {item}
                  </span>
                ))}
                {customer.favoriteItems.length > 3 && (
                  <span className="inline-block px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded">
                    +{customer.favoriteItems.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Notes Preview */}
          {customer.notes && (
            <div className="px-6 pb-6 pt-0">
              <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-600 line-clamp-2">{customer.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
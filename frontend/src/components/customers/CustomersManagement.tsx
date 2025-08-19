'use client'

import { useState } from 'react'
import { CustomerGrid } from './CustomerGrid'
import { CustomerModal } from './CustomerModal'
import { 
  Plus,
  Search,
  Filter,
  Users,
  Star,
  Phone,
  Calendar
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

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Grace Wanjiru',
    phone: '+254701234567',
    email: 'grace.wanjiru@email.com',
    visitCount: 28,
    totalSpent: 85000,
    loyaltyPoints: 425,
    lastVisit: '2024-01-15',
    dateJoined: '2023-06-10',
    dietaryPreferences: ['Vegetarian'],
    notes: 'Prefers window seats. Loves our ugali and sukuma wiki.',
    favoriteItems: ['Nyama Choma', 'Ugali', 'Sukuma Wiki'],
    isVip: true
  },
  {
    id: '2',
    name: 'David Kiprotich',
    phone: '+254722345678',
    email: 'david.kiprotich@gmail.com',
    visitCount: 15,
    totalSpent: 42000,
    loyaltyPoints: 210,
    lastVisit: '2024-01-12',
    dateJoined: '2023-09-22',
    dietaryPreferences: [],
    notes: 'Business lunch regular. Usually orders for 3-4 people.',
    favoriteItems: ['Fish Fillet', 'Pilau', 'Mango Juice'],
    isVip: false
  },
  {
    id: '3',
    name: 'Mary Njoki',
    phone: '+254733456789',
    visitCount: 45,
    totalSpent: 120000,
    loyaltyPoints: 600,
    lastVisit: '2024-01-14',
    dateJoined: '2023-03-15',
    dietaryPreferences: ['Gluten-Free'],
    notes: 'Loyal customer. Celebrates family birthdays here.',
    favoriteItems: ['Grilled Chicken', 'Rice', 'Fresh Fruit Juice'],
    isVip: true
  },
  {
    id: '4',
    name: 'Peter Mwangi',
    phone: '+254744567890',
    visitCount: 8,
    totalSpent: 15000,
    loyaltyPoints: 75,
    lastVisit: '2024-01-10',
    dateJoined: '2023-11-05',
    dietaryPreferences: [],
    notes: 'New customer. Works nearby, comes for lunch.',
    favoriteItems: ['Beef Stew', 'Chapati'],
    isVip: false
  },
  {
    id: '5',
    name: 'Sarah Akinyi',
    phone: '+254755678901',
    email: 'sarah.akinyi@yahoo.com',
    visitCount: 22,
    totalSpent: 68000,
    loyaltyPoints: 340,
    lastVisit: '2024-01-13',
    dateJoined: '2023-07-20',
    dietaryPreferences: ['Dairy-Free'],
    notes: 'Brings friends regularly. Loves our fish dishes.',
    favoriteItems: ['Tilapia', 'Coconut Rice', 'Passion Fruit Juice'],
    isVip: false
  },
  {
    id: '6',
    name: 'James Otieno',
    phone: '+254766789012',
    visitCount: 35,
    totalSpent: 95000,
    loyaltyPoints: 475,
    lastVisit: '2024-01-16',
    dateJoined: '2023-04-12',
    dietaryPreferences: [],
    notes: 'Weekend regular. Always orders takeaway for family.',
    favoriteItems: ['Nyama Choma', 'Mukimo', 'Soda'],
    isVip: true
  }
]

export function CustomersManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>('all')
  const [visitFrequencyFilter, setVisitFrequencyFilter] = useState<string>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = customerTypeFilter === 'all' || 
                       (customerTypeFilter === 'vip' && customer.isVip) ||
                       (customerTypeFilter === 'regular' && !customer.isVip)
    
    const matchesFrequency = visitFrequencyFilter === 'all' ||
                           (visitFrequencyFilter === 'frequent' && customer.visitCount >= 20) ||
                           (visitFrequencyFilter === 'occasional' && customer.visitCount >= 5 && customer.visitCount < 20) ||
                           (visitFrequencyFilter === 'new' && customer.visitCount < 5)
    
    return matchesSearch && matchesType && matchesFrequency
  })

  const handleAddCustomer = () => {
    setSelectedCustomer(null)
    setIsCreating(true)
    setIsModalOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsCreating(false)
    setIsModalOpen(true)
  }

  const handleQuickSearch = (phone: string) => {
    setSearchTerm(phone)
  }

  // Statistics
  const totalCustomers = mockCustomers.length
  const vipCustomers = mockCustomers.filter(c => c.isVip).length
  const frequentCustomers = mockCustomers.filter(c => c.visitCount >= 20).length
  const recentCustomers = mockCustomers.filter(c => {
    const lastVisitDate = new Date(c.lastVisit)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    return lastVisitDate >= threeDaysAgo
  }).length

  // Recent customers (last 7 days)
  const recentVisitors = mockCustomers
    .filter(c => {
      const lastVisitDate = new Date(c.lastVisit)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return lastVisitDate >= sevenDaysAgo
    })
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
    .slice(0, 5)

  // Top customers by spending
  const topSpenders = mockCustomers
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage guest profiles and relationships</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button 
            onClick={handleAddCustomer}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">VIP Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{vipCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Frequent Visitors</p>
              <p className="text-2xl font-semibold text-gray-900">{frequentCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Phone className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Visits</p>
              <p className="text-2xl font-semibold text-gray-900">{recentCustomers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Visitors</h3>
          <div className="space-y-3">
            {recentVisitors.map(customer => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                    customer.isVip ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}>
                    {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleQuickSearch(customer.phone)}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Customers</h3>
          <div className="space-y-3">
            {topSpenders.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">KES {customer.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{customer.visitCount} visits</p>
                  <p className="text-xs text-gray-500">{customer.loyaltyPoints} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={customerTypeFilter}
                onChange={(e) => setCustomerTypeFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              >
                <option value="all">All Types</option>
                <option value="vip">VIP Customers</option>
                <option value="regular">Regular Customers</option>
              </select>
            </div>

            <select
              value={visitFrequencyFilter}
              onChange={(e) => setVisitFrequencyFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              <option value="all">All Frequencies</option>
              <option value="frequent">Frequent (20+ visits)</option>
              <option value="occasional">Occasional (5-19 visits)</option>
              <option value="new">New (Under 5 visits)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Grid */}
      <CustomerGrid 
        customers={filteredCustomers}
        onEditCustomer={handleEditCustomer}
      />

      {/* Customer Modal */}
      {isModalOpen && (
        <CustomerModal
          customer={selectedCustomer}
          isOpen={isModalOpen}
          isCreating={isCreating}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCustomer(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}
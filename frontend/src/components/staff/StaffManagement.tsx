'use client'

import { useState } from 'react'
import { StaffGrid } from './StaffGrid'
import { StaffModal } from './StaffModal'
import { 
  Plus,
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  Shield
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

const mockStaff: Staff[] = [
  {
    id: '1',
    employeeNumber: 'EMP001',
    name: 'Grace Wanjiku',
    role: 'general_manager',
    email: 'grace@jikomilele.co.ke',
    phone: '+254701234567',
    isActive: true,
    hireDate: '2023-01-15',
    hourlyRate: 2500
  },
  {
    id: '2',
    employeeNumber: 'EMP002',
    name: 'Peter Kiprotich',
    role: 'head_chef',
    email: 'peter@jikomilele.co.ke',
    phone: '+254722345678',
    isActive: true,
    hireDate: '2023-02-01',
    hourlyRate: 1800
  },
  {
    id: '3',
    employeeNumber: 'EMP003',
    name: 'Sarah Njeri',
    role: 'server',
    email: 'sarah@jikomilele.co.ke',
    phone: '+254733456789',
    isActive: true,
    hireDate: '2023-03-10',
    hourlyRate: 800
  },
  {
    id: '4',
    employeeNumber: 'EMP004',
    name: 'John Mwangi',
    role: 'bartender',
    email: 'john@jikomilele.co.ke',
    phone: '+254744567890',
    isActive: true,
    hireDate: '2023-04-05',
    hourlyRate: 900
  },
  {
    id: '5',
    employeeNumber: 'EMP005',
    name: 'Mary Kamau',
    role: 'host',
    email: 'mary@jikomilele.co.ke',
    phone: '+254755678901',
    isActive: false,
    hireDate: '2023-05-20'
  }
]

export function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const filteredStaff = mockStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.phone.includes(searchTerm)
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && staff.isActive) ||
                         (statusFilter === 'inactive' && !staff.isActive)
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddStaff = () => {
    setSelectedStaff(null)
    setIsCreating(true)
    setIsModalOpen(true)
  }

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff)
    setIsCreating(false)
    setIsModalOpen(true)
  }

  const activeStaff = mockStaff.filter(s => s.isActive).length
  const inactiveStaff = mockStaff.filter(s => s.isActive === false).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage restaurant employees and roles</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button 
            onClick={handleAddStaff}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-semibold text-gray-900">{mockStaff.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{activeStaff}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserX className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-semibold text-gray-900">{inactiveStaff}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Managers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockStaff.filter(s => ['general_manager', 'shift_supervisor'].includes(s.role)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search staff by name, ID, email, or phone..."
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              >
                <option value="all">All Roles</option>
                <option value="general_manager">General Manager</option>
                <option value="shift_supervisor">Shift Supervisor</option>
                <option value="head_chef">Head Chef</option>
                <option value="sous_chef">Sous Chef</option>
                <option value="line_cook">Line Cook</option>
                <option value="server">Server</option>
                <option value="host">Host</option>
                <option value="bartender">Bartender</option>
                <option value="busser">Busser</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <StaffGrid 
        staff={filteredStaff}
        onEditStaff={handleEditStaff}
      />

      {/* Staff Modal */}
      {isModalOpen && (
        <StaffModal
          staff={selectedStaff}
          isOpen={isModalOpen}
          isCreating={isCreating}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedStaff(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}
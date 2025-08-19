'use client'

import { useState } from 'react'
import { 
  X,
  Users,
  Clock,
  User,
  MapPin,
  Edit,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react'

interface Table {
  id: string
  tableNumber: string
  capacity: number
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'out_of_order'
  section: string
  x: number
  y: number
  partySize?: number
  timeOccupied?: string
  server?: string
  customerName?: string
}

interface TableModalProps {
  table: Table
  isOpen: boolean
  onClose: () => void
}

export function TableModal({ table, isOpen, onClose }: TableModalProps) {
  const [newStatus, setNewStatus] = useState(table.status)
  const [isUpdating, setIsUpdating] = useState(false)

  if (!isOpen) return null

  const statusOptions = [
    { value: 'available', label: 'Available', color: 'text-green-600' },
    { value: 'occupied', label: 'Occupied', color: 'text-red-600' },
    { value: 'reserved', label: 'Reserved', color: 'text-blue-600' },
    { value: 'cleaning', label: 'Needs Cleaning', color: 'text-yellow-600' },
    { value: 'out_of_order', label: 'Out of Order', color: 'text-gray-600' }
  ]

  const handleStatusUpdate = async () => {
    setIsUpdating(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsUpdating(false)
    onClose()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'occupied':
        return <Users className="w-5 h-5 text-red-600" />
      case 'reserved':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'cleaning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'out_of_order':
        return <Settings className="w-5 h-5 text-gray-600" />
      default:
        return <Settings className="w-5 h-5 text-gray-600" />
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(table.status)}
              <h3 className="text-lg font-medium text-gray-900">
                Table {table.tableNumber}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <div className="flex items-center text-sm text-gray-900">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  {table.capacity} seats
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section
                </label>
                <div className="flex items-center text-sm text-gray-900">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {table.section}
                </div>
              </div>
            </div>

            {/* Current Occupancy Info */}
            {table.status === 'occupied' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Current Party</h4>
                <div className="space-y-2 text-sm">
                  {table.customerName && (
                    <div className="flex items-center text-red-800">
                      <User className="w-4 h-4 mr-2" />
                      {table.customerName}
                    </div>
                  )}
                  {table.partySize && (
                    <div className="flex items-center text-red-800">
                      <Users className="w-4 h-4 mr-2" />
                      Party of {table.partySize}
                    </div>
                  )}
                  {table.timeOccupied && (
                    <div className="flex items-center text-red-800">
                      <Clock className="w-4 h-4 mr-2" />
                      Occupied for {table.timeOccupied}
                    </div>
                  )}
                  {table.server && (
                    <div className="flex items-center text-red-800">
                      <User className="w-4 h-4 mr-2" />
                      Server: {table.server}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reserved Info */}
            {table.status === 'reserved' && table.customerName && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Reservation</h4>
                <div className="flex items-center text-sm text-blue-800">
                  <Clock className="w-4 h-4 mr-2" />
                  {table.customerName}
                </div>
              </div>
            )}

            {/* Status Update Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as Table['status'])}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" />
                Edit Details
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Users className="w-4 h-4 mr-2" />
                Seat Guest
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={isUpdating || newStatus === table.status}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { TableModal } from './TableModal'
import { 
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
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

interface FloorPlanViewProps {
  searchTerm: string
  statusFilter: string
}

const mockTables: Table[] = [
  { id: '1', tableNumber: 'T1', capacity: 4, status: 'occupied', section: 'Main Dining', x: 20, y: 20, partySize: 4, timeOccupied: '45 min', server: 'Grace Wanjiku', customerName: 'John Mwangi' },
  { id: '2', tableNumber: 'T2', capacity: 2, status: 'available', section: 'Main Dining', x: 60, y: 20 },
  { id: '3', tableNumber: 'T3', capacity: 6, status: 'occupied', section: 'Main Dining', x: 20, y: 60, partySize: 5, timeOccupied: '20 min', server: 'Peter Kiprotich' },
  { id: '4', tableNumber: 'T4', capacity: 4, status: 'available', section: 'Main Dining', x: 60, y: 60 },
  { id: '5', tableNumber: 'T5', capacity: 8, status: 'reserved', section: 'Main Dining', x: 40, y: 40, customerName: 'Mary Kamau - 8:30 PM' },
  { id: '6', tableNumber: 'BAR1', capacity: 3, status: 'occupied', section: 'Bar Area', x: 80, y: 20, partySize: 2, timeOccupied: '30 min', server: 'Sarah Njeri' },
  { id: '7', tableNumber: 'BAR2', capacity: 3, status: 'available', section: 'Bar Area', x: 80, y: 40 },
  { id: '8', tableNumber: 'T6', capacity: 2, status: 'cleaning', section: 'Main Dining', x: 20, y: 80 },
  { id: '9', tableNumber: 'T7', capacity: 4, status: 'available', section: 'Window Side', x: 80, y: 60 },
  { id: '10', tableNumber: 'T8', capacity: 2, status: 'available', section: 'Window Side', x: 80, y: 80 }
]

export function FloorPlanView({ searchTerm, statusFilter }: FloorPlanViewProps) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredTables = mockTables.filter(table => {
    const matchesSearch = table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         table.section.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getTableColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-500 text-green-900'
      case 'occupied':
        return 'bg-red-100 border-red-500 text-red-900'
      case 'reserved':
        return 'bg-blue-100 border-blue-500 text-blue-900'
      case 'cleaning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900'
      case 'out_of_order':
        return 'bg-gray-100 border-gray-500 text-gray-900'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />
      case 'occupied':
        return <Users className="w-4 h-4" />
      case 'reserved':
        return <Clock className="w-4 h-4" />
      case 'cleaning':
        return <AlertTriangle className="w-4 h-4" />
      case 'out_of_order':
        return <XCircle className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  const handleTableClick = (table: Table) => {
    setSelectedTable(table)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="p-6">
        {/* Floor Plan Area */}
        <div className="relative bg-gray-50 rounded-lg min-h-96 border-2 border-dashed border-gray-200">
          {/* Legend */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-sm p-4 z-10">
            <h4 className="font-medium text-gray-900 mb-2">Table Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Occupied</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Reserved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Cleaning</span>
              </div>
            </div>
          </div>

          {/* Section Labels */}
          <div className="absolute top-4 right-4 space-y-2">
            <div className="bg-white rounded px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
              Main Dining Room
            </div>
          </div>
          
          <div className="absolute top-20 right-4">
            <div className="bg-white rounded px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
              Bar Area
            </div>
          </div>

          <div className="absolute bottom-20 right-4">
            <div className="bg-white rounded px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
              Window Side
            </div>
          </div>

          {/* Tables */}
          {filteredTables.map((table) => (
            <div
              key={table.id}
              className={`absolute cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${getTableColor(table.status)} border-2 rounded-lg p-3 min-w-20 min-h-20`}
              style={{
                left: `${table.x}%`,
                top: `${table.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleTableClick(table)}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  {getStatusIcon(table.status)}
                </div>
                <div className="font-bold text-sm">{table.tableNumber}</div>
                <div className="text-xs opacity-75">
                  {table.capacity} seats
                </div>
                {table.status === 'occupied' && table.partySize && (
                  <div className="text-xs mt-1 font-medium">
                    {table.partySize}/{table.capacity}
                  </div>
                )}
                {table.status === 'occupied' && table.timeOccupied && (
                  <div className="text-xs opacity-75">
                    {table.timeOccupied}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Empty state when no tables match filter */}
          {filteredTables.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No tables match your search criteria</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-gray-900">
              {filteredTables.filter(t => t.status === 'occupied').length}/
              {filteredTables.length}
            </div>
            <div className="text-sm text-gray-600">Tables Occupied</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-gray-900">
              {filteredTables.filter(t => t.status === 'occupied').reduce((sum, t) => sum + (t.partySize || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Current Guests</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-gray-900">
              {Math.round((filteredTables.filter(t => t.status === 'occupied').length / filteredTables.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Occupancy Rate</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-gray-900">
              {filteredTables.filter(t => t.status === 'available').length}
            </div>
            <div className="text-sm text-gray-600">Available Now</div>
          </div>
        </div>
      </div>

      {/* Table Modal */}
      {selectedTable && (
        <TableModal
          table={selectedTable}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTable(null)
          }}
        />
      )}
    </>
  )
}
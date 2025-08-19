'use client'

import { useState } from 'react'
import { TableModal } from './TableModal'
import { 
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2
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

interface TableListViewProps {
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

export function TableListView({ searchTerm, statusFilter }: TableListViewProps) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortField, setSortField] = useState<keyof Table>('tableNumber')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredTables = mockTables.filter(table => {
    const matchesSearch = table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         table.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (table.customerName && table.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (table.server && table.server.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedTables = [...filteredTables].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    return 0
  })

  const handleSort = (field: keyof Table) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Available', icon: CheckCircle },
      occupied: { bg: 'bg-red-100', text: 'text-red-800', label: 'Occupied', icon: Users },
      reserved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Reserved', icon: Clock },
      cleaning: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Cleaning', icon: AlertTriangle },
      out_of_order: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Out of Order', icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null

    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const handleTableClick = (table: Table) => {
    setSelectedTable(table)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="p-6">
        {/* Table */}
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('tableNumber')}
                >
                  Table
                  {sortField === 'tableNumber' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('capacity')}
                >
                  Capacity
                  {sortField === 'capacity' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('section')}
                >
                  Section
                  {sortField === 'section' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {sortField === 'status' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Party
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Server
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTables.map((table) => (
                <tr 
                  key={table.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleTableClick(table)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="font-medium text-gray-900">{table.tableNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {table.partySize ? `${table.partySize}/${table.capacity}` : table.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {table.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(table.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {table.customerName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {table.server || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {table.timeOccupied || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle menu click
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {sortedTables.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tables found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No tables have been set up yet.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {sortedTables.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedTables.length}</span> of{' '}
                  <span className="font-medium">{sortedTables.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-orange-50 text-sm font-medium text-orange-600">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
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
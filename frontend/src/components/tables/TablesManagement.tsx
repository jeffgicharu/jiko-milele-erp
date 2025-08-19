'use client'

import { useState } from 'react'
import { FloorPlanView } from './FloorPlanView'
import { TableListView } from './TableListView'
import { 
  LayoutGrid,
  List,
  Plus,
  Filter,
  Search
} from 'lucide-react'

export function TablesManagement() {
  const [viewMode, setViewMode] = useState<'floor' | 'list'>('floor')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage restaurant tables</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('floor')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'floor'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Floor Plan
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              List View
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="cleaning">Cleaning</option>
                <option value="out_of_order">Out of Order</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-green-600">4</div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-red-600">7</div>
          <div className="text-sm text-gray-600">Occupied</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">1</div>
          <div className="text-sm text-gray-600">Reserved</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">0</div>
          <div className="text-sm text-gray-600">Cleaning</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">0</div>
          <div className="text-sm text-gray-600">Out of Order</div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm">
        {viewMode === 'floor' ? (
          <FloorPlanView searchTerm={searchTerm} statusFilter={statusFilter} />
        ) : (
          <TableListView searchTerm={searchTerm} statusFilter={statusFilter} />
        )}
      </div>
    </div>
  )
}
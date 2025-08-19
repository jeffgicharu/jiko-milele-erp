'use client'

import Link from 'next/link'
import { 
  Utensils,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react'

interface TableCardProps {
  tableNumber: string
  status: 'occupied' | 'available' | 'needs_cleaning'
  partySize?: number
  timeOccupied?: string
  server?: string
}

function TableCard({ tableNumber, status, partySize, timeOccupied, server }: TableCardProps) {
  const statusConfig = {
    occupied: {
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
      label: 'Occupied',
      icon: Users
    },
    available: {
      bgColor: 'bg-green-50 border-green-200', 
      textColor: 'text-green-700',
      label: 'Available',
      icon: CheckCircle
    },
    needs_cleaning: {
      bgColor: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700', 
      label: 'Needs Cleaning',
      icon: AlertCircle
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={`rounded-lg border p-4 ${config.bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900">Table {tableNumber}</span>
        <Icon className={`w-4 h-4 ${config.textColor}`} />
      </div>
      <div className={`text-sm font-medium ${config.textColor} mb-2`}>
        {config.label}
      </div>
      {status === 'occupied' && (
        <div className="text-sm text-gray-600 space-y-1">
          <div>Party of {partySize}</div>
          <div>Occupied: {timeOccupied}</div>
          {server && <div>Server: {server}</div>}
        </div>
      )}
    </div>
  )
}

export function ServerDashboard() {
  const myTables = [
    { tableNumber: "T1", status: "occupied" as const, partySize: 4, timeOccupied: "45 min", server: "Current User" },
    { tableNumber: "T3", status: "available" as const },
    { tableNumber: "T5", status: "occupied" as const, partySize: 2, timeOccupied: "20 min", server: "Current User" },
    { tableNumber: "T7", status: "needs_cleaning" as const }
  ]

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Performance Today</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tables Served</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <Utensils className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600">↑ 2</span> vs yesterday
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">KES 18,750</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600">↑ 15%</span> vs yesterday
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Ticket</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">KES 1,563</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600">↑ KES 120</span> improvement
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">4.8</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600">↑ 0.2</span> rating increase
            </div>
          </div>
        </div>
      </div>

      {/* My Current Tables */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">My Current Tables</h3>
          <Link 
            href="/my-tables" 
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            View All Tables →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {myTables.map((table) => (
            <TableCard key={table.tableNumber} {...table} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/customers">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">Find Customer</h4>
              <p className="text-sm text-gray-600">Search customer profiles and preferences</p>
            </div>
          </Link>

          <Link href="/tables">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <Utensils className="w-8 h-8 text-green-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">Seat Guests</h4>
              <p className="text-sm text-gray-600">Assign tables and manage seating</p>
            </div>
          </Link>

          <Link href="/sales">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <DollarSign className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">Process Payment</h4>
              <p className="text-sm text-gray-600">Handle bills and payment processing</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Current Orders */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Orders</h3>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">Table T1 - Order #K-001</p>
                    <p className="text-sm text-orange-700">Nyama Choma (2), Ugali (2) - Kitchen: 8 min</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-orange-600">In Progress</span>
              </div>

              <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Table T5 - Order #K-002</p>
                    <p className="text-sm text-green-700">Fish Curry, Rice, Chapati (3) - Ready for pickup</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Ready</span>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Table T7</p>
                    <p className="text-sm text-gray-600">Waiting for order - Party of 4 seated 5 min ago</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">Pending Order</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shift Summary */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shift Summary</h3>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">6.5 hrs</div>
              <div className="text-sm text-gray-600">Hours Worked</div>
              <div className="text-xs text-green-600 mt-1">1.5 hrs remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">28</div>
              <div className="text-sm text-gray-600">Guests Served</div>
              <div className="text-xs text-blue-600 mt-1">Above average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Order Accuracy</div>
              <div className="text-xs text-green-600 mt-1">Excellent performance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
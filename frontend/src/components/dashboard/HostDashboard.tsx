'use client'

import Link from 'next/link'
import { 
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Phone,
  MapPin
} from 'lucide-react'

interface ReservationCardProps {
  time: string
  name: string
  partySize: number
  phone: string
  status: 'confirmed' | 'waiting' | 'seated' | 'cancelled'
  table?: string
}

function ReservationCard({ time, name, partySize, phone, status, table }: ReservationCardProps) {
  const statusConfig = {
    confirmed: {
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      label: 'Confirmed',
      icon: CheckCircle
    },
    waiting: {
      bgColor: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700',
      label: 'Waiting',
      icon: Clock
    },
    seated: {
      bgColor: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
      label: 'Seated',
      icon: CheckCircle
    },
    cancelled: {
      bgColor: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-700',
      label: 'Cancelled',
      icon: AlertCircle
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={`rounded-lg border p-4 ${config.bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900">{time}</span>
        <Icon className={`w-4 h-4 ${config.textColor}`} />
      </div>
      <div className="space-y-1 text-sm">
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-gray-600">Party of {partySize}</div>
        <div className="text-gray-600 flex items-center">
          <Phone className="w-3 h-3 mr-1" />
          {phone}
        </div>
        {table && (
          <div className="text-gray-600 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            Table {table}
          </div>
        )}
        <div className={`text-sm font-medium ${config.textColor}`}>
          {config.label}
        </div>
      </div>
    </div>
  )
}

interface WaitlistItemProps {
  name: string
  partySize: number
  waitTime: string
  priority: 'normal' | 'priority'
}

function WaitlistItem({ name, partySize, waitTime, priority }: WaitlistItemProps) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${
      priority === 'priority' ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'
    }`}>
      <div>
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-sm text-gray-600">Party of {partySize}</div>
        {priority === 'priority' && (
          <div className="text-xs text-orange-600 font-medium">PRIORITY GUEST</div>
        )}
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">{waitTime}</div>
        <div className="text-xs text-gray-500">waiting</div>
      </div>
    </div>
  )
}

export function HostDashboard() {
  const todayReservations = [
    { time: "7:30 PM", name: "Grace Wanjiku", partySize: 4, phone: "+254701234567", status: "confirmed" as const },
    { time: "8:00 PM", name: "John Mwangi", partySize: 2, phone: "+254722345678", status: "seated" as const, table: "T3" },
    { time: "8:30 PM", name: "Mary Kamau", partySize: 6, phone: "+254733456789", status: "waiting" as const },
    { time: "9:00 PM", name: "Peter Kiprotich", partySize: 3, phone: "+254744567890", status: "confirmed" as const }
  ]

  const waitlist = [
    { name: "Sarah Njeri", partySize: 2, waitTime: "15 min", priority: "normal" as const },
    { name: "David Ochieng", partySize: 4, waitTime: "25 min", priority: "priority" as const },
    { name: "Faith Mutindi", partySize: 3, waitTime: "8 min", priority: "normal" as const }
  ]

  return (
    <div className="space-y-6">
      {/* Host Performance Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">18</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600">↑ 3</span> vs yesterday
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Walk-ins Seated</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600">↑ 4</span> vs yesterday
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12 min</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-red-600">↑ 2 min</span> vs target
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tables Available</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">4/12</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-gray-600">67%</span> occupancy
            </div>
          </div>
        </div>
      </div>

      {/* Current Waitlist and Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Waitlist */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Waitlist</h3>
            <span className="text-sm text-gray-600">{waitlist.length} parties waiting</span>
          </div>
          <div className="space-y-3">
            {waitlist.map((item, index) => (
              <WaitlistItem key={index} {...item} />
            ))}
            {waitlist.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No guests currently waiting</p>
              </div>
            )}
          </div>
        </div>

        {/* Tonight's Reservations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tonight&apos;s Reservations</h3>
            <Link 
              href="/reservations" 
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Manage All →
            </Link>
          </div>
          <div className="space-y-3">
            {todayReservations.map((reservation, index) => (
              <ReservationCard key={index} {...reservation} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/tables">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">Seat Guests</h4>
              <p className="text-sm text-gray-600">Assign tables to waiting parties</p>
            </div>
          </Link>

          <Link href="/reservations">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <Calendar className="w-8 h-8 text-green-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">New Reservation</h4>
              <p className="text-sm text-gray-600">Book table for future date</p>
            </div>
          </Link>

          <Link href="/customers">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <UserPlus className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">Add Guest</h4>
              <p className="text-sm text-gray-600">Register new customer profile</p>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <AlertCircle className="w-8 h-8 text-orange-600 mb-3" />
            <h4 className="font-medium text-gray-900 mb-2">Check Status</h4>
            <p className="text-sm text-gray-600">View table and kitchen status</p>
          </div>
        </div>
      </div>

      {/* Table Status Overview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Table Status Overview</h3>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-green-700">Available</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">7</div>
              <div className="text-sm text-red-700">Occupied</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-yellow-700">Cleaning</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-blue-700">Reserved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
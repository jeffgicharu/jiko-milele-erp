'use client'

import { 
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Shield,
  ChefHat,
  Utensils,
  Users,
  Coffee,
  Clock,
  MoreVertical,
  Edit,
  UserX,
  UserCheck
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

interface StaffGridProps {
  staff: Staff[]
  onEditStaff: (staff: Staff) => void
}

export function StaffGrid({ staff, onEditStaff }: StaffGridProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'general_manager':
      case 'shift_supervisor':
        return <Shield className="w-5 h-5 text-red-600" />
      case 'head_chef':
      case 'sous_chef':
      case 'line_cook':
        return <ChefHat className="w-5 h-5 text-purple-600" />
      case 'server':
        return <Utensils className="w-5 h-5 text-blue-600" />
      case 'host':
        return <Users className="w-5 h-5 text-green-600" />
      case 'bartender':
        return <Coffee className="w-5 h-5 text-amber-600" />
      case 'busser':
        return <Clock className="w-5 h-5 text-gray-600" />
      default:
        return <User className="w-5 h-5 text-gray-600" />
    }
  }

  const getRoleDisplayName = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'general_manager':
      case 'shift_supervisor':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'head_chef':
      case 'sous_chef':
      case 'line_cook':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'server':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'host':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'bartender':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'busser':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (staff.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
        <p className="text-gray-500">
          Try adjusting your search or filter criteria, or add a new staff member.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {staff.map((member) => (
          <div
            key={member.id}
            className={`relative bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
              !member.isActive ? 'opacity-60' : ''
            }`}
          >
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {member.isActive ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <UserCheck className="w-4 h-4" />
                  <span className="text-xs font-medium">Active</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-600">
                  <UserX className="w-4 h-4" />
                  <span className="text-xs font-medium">Inactive</span>
                </div>
              )}
            </div>

            {/* Staff Photo Placeholder */}
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-gray-600" />
            </div>

            {/* Staff Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.employeeNumber}</p>
              </div>

              {/* Role Badge */}
              <div className="flex items-center space-x-2">
                {getRoleIcon(member.role)}
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(member.role)}`}>
                  {getRoleDisplayName(member.role)}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{member.phone}</span>
                </div>
              </div>

              {/* Employment Details */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Hired: {new Date(member.hireDate).toLocaleDateString('en-GB')}</span>
                </div>
                {member.hourlyRate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span>KES {member.hourlyRate}/hour</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onEditStaff(member)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </button>
                
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
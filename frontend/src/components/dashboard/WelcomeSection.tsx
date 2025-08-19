'use client'

import { useAuthContext } from '@/components/providers/AuthProvider'
import { 
  Calendar,
  Clock,
  MapPin
} from 'lucide-react'

export function WelcomeSection() {
  const { user, staffName, role } = useAuthContext()

  const currentTime = new Date()
  const timeString = currentTime.toLocaleString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Nairobi'
  })

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getShiftInfo = () => {
    const hour = currentTime.getHours()
    if (hour >= 6 && hour < 14) return 'Morning Shift'
    if (hour >= 14 && hour < 22) return 'Evening Shift'
    return 'Night Shift'
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            {getGreeting()}, {staffName || user?.first_name || user?.username}!
          </h1>
          <p className="text-orange-100 text-lg">
            Ready to serve excellence at Jiko Milele
          </p>
          {role && (
            <p className="text-orange-200 text-sm mt-1 capitalize">
              {role.replace('_', ' ')} • {getShiftInfo()}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-200" />
            <div className="text-sm">
              <p className="font-medium">{currentTime.toLocaleDateString('en-GB', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-200" />
            <div className="text-sm">
              <p className="font-medium">
                {currentTime.toLocaleTimeString('en-GB', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Africa/Nairobi'
                })} EAT
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-200" />
            <div className="text-sm">
              <p className="font-medium">Nairobi, Kenya</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useAuthContext } from '@/components/providers/AuthProvider'
import { ManagerDashboard } from './ManagerDashboard'
import { KitchenDashboard } from './KitchenDashboard'
import { ServerDashboard } from './ServerDashboard'
import { HostDashboard } from './HostDashboard'
import { WelcomeSection } from './WelcomeSection'

export function DashboardContent() {
  const { role, isManager, isKitchenStaff, isFOHStaff } = useAuthContext()

  const renderRoleSpecificDashboard = () => {
    // Manager Dashboard (General Manager, Shift Supervisor)
    if (isManager) {
      return <ManagerDashboard />
    }
    
    // Kitchen Dashboard (Head Chef, Sous Chef, Line Cook)
    if (isKitchenStaff) {
      return <KitchenDashboard />
    }
    
    // Host Dashboard
    if (role === 'host') {
      return <HostDashboard />
    }
    
    // Server Dashboard (Server, Bartender, Busser)
    if (isFOHStaff) {
      return <ServerDashboard />
    }
    
    // Default dashboard for unrecognized roles
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Welcome to Jiko Milele
          </h3>
          <p className="text-gray-600">
            Your dashboard is being prepared. Please contact your manager for access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeSection />
      
      {/* Role-specific Dashboard */}
      {renderRoleSpecificDashboard()}
    </div>
  )
}
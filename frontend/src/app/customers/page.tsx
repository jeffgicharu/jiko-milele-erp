'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { CustomersManagement } from '@/components/customers/CustomersManagement'

function CustomersWrapper() {
  return (
    <AppLayout>
      <CustomersManagement />
    </AppLayout>
  )
}

export default function CustomersPage() {
  return (
    <ProtectedRoute requiredRoles={['general_manager', 'shift_supervisor', 'server', 'host']}>
      <CustomersWrapper />
    </ProtectedRoute>
  )
}
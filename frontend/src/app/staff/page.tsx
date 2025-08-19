'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { StaffManagement } from '@/components/staff/StaffManagement'

function StaffWrapper() {
  return (
    <AppLayout>
      <StaffManagement />
    </AppLayout>
  )
}

export default function StaffPage() {
  return (
    <ProtectedRoute requiredRoles={['general_manager', 'shift_supervisor']}>
      <StaffWrapper />
    </ProtectedRoute>
  )
}
'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

function DashboardWrapper() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardWrapper />
    </ProtectedRoute>
  )
}
'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { TablesManagement } from '@/components/tables/TablesManagement'

function TablesWrapper() {
  return (
    <AppLayout>
      <TablesManagement />
    </AppLayout>
  )
}

export default function TablesPage() {
  return (
    <ProtectedRoute requiredRoles={['general_manager', 'shift_supervisor', 'server', 'host', 'busser']}>
      <TablesWrapper />
    </ProtectedRoute>
  )
}
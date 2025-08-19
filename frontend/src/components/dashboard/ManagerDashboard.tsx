'use client'

import Link from 'next/link'
import { 
  BarChart3,
  Users,
  Utensils,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Settings,
  FileText
} from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ComponentType<{ className?: string }>
  href?: string
}

function MetricCard({ title, value, change, trend, icon: Icon, href }: MetricCardProps) {
  const content = (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-orange-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-1">vs yesterday</span>
      </div>
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}

interface QuickActionProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
}

function QuickAction({ title, description, icon: Icon, href, color }: QuickActionProps) {
  const colorClasses = {
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    amber: 'bg-amber-50 text-amber-600'
  }

  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  )
}

export function ManagerDashboard() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Today's Revenue"
            value="KES 45,230"
            change="+12.5%"
            trend="up"
            icon={DollarSign}
            href="/reports/revenue"
          />
          <MetricCard
            title="Active Tables"
            value="8/12"
            change="+2"
            trend="up"
            icon={Utensils}
            href="/tables"
          />
          <MetricCard
            title="Staff on Duty"
            value="14"
            change="+1"
            trend="up"
            icon={Users}
            href="/staff"
          />
          <MetricCard
            title="Inventory Alerts"
            value="3"
            change="-2"
            trend="down"
            icon={Package}
            href="/inventory"
          />
        </div>
      </div>

      {/* Quick Actions and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <QuickAction
              title="View Reports"
              description="Sales, costs, and performance analytics"
              icon={BarChart3}
              href="/reports"
              color="red"
            />
            <QuickAction
              title="Manage Staff"
              description="Schedules, roles, and performance"
              icon={Users}
              href="/staff"
              color="blue"
            />
            <QuickAction
              title="Check Inventory"
              description="Stock levels and supplier orders"
              icon={Package}
              href="/inventory"
              color="green"
            />
            <QuickAction
              title="System Settings"
              description="Configuration and preferences"
              icon={Settings}
              href="/settings"
              color="purple"
            />
          </div>
        </div>

        {/* Revenue Chart Area */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 7 Days)</h3>
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Placeholder for chart */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue chart will be displayed here</p>
                <p className="text-sm text-gray-400">Integration with charting library coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Low Stock Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-amber-800">Low Stock Items</h4>
                <p className="text-sm text-amber-700 mt-1">
                  3 ingredients below minimum stock level
                </p>
                <Link 
                  href="/inventory" 
                  className="text-sm font-medium text-amber-800 hover:text-amber-900 mt-2 inline-block"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>

          {/* Service Alert */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-green-800">All Systems Running</h4>
                <p className="text-sm text-green-700 mt-1">
                  No critical issues detected today
                </p>
                <span className="text-sm text-green-600 mt-2 inline-block">
                  Last checked: 2 minutes ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4.2 min</div>
              <div className="text-sm text-gray-600">Avg Table Turnover</div>
              <div className="text-xs text-green-600 mt-1">↑ 0.3 min faster</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">94%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
              <div className="text-xs text-green-600 mt-1">↑ 2% improvement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">32%</div>
              <div className="text-sm text-gray-600">Food Cost Percentage</div>
              <div className="text-xs text-red-600 mt-1">↑ 1% above target</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
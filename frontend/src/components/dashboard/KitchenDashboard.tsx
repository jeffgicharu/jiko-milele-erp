'use client'

import Link from 'next/link'
import { 
  ChefHat,
  Clock,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Timer,
  DollarSign,
  Truck
} from 'lucide-react'

interface OrderCardProps {
  orderNumber: string
  items: string[]
  timeElapsed: string
  priority: 'normal' | 'urgent' | 'rush'
}

function OrderCard({ orderNumber, items, timeElapsed, priority }: OrderCardProps) {
  const priorityColors = {
    normal: 'border-gray-200 bg-white',
    urgent: 'border-yellow-300 bg-yellow-50',
    rush: 'border-red-300 bg-red-50'
  }

  return (
    <div className={`rounded-lg border p-4 ${priorityColors[priority]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900">Order #{orderNumber}</span>
        <span className="text-sm text-gray-600">{timeElapsed}</span>
      </div>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="text-sm text-gray-700">{item}</div>
        ))}
      </div>
      {priority === 'rush' && (
        <div className="mt-2 text-xs text-red-600 font-medium">RUSH ORDER</div>
      )}
    </div>
  )
}

interface InventoryAlertProps {
  item: string
  currentStock: string
  minimumStock: string
  urgency: 'low' | 'medium' | 'high'
}

function InventoryAlert({ item, currentStock, minimumStock, urgency }: InventoryAlertProps) {
  const urgencyColors = {
    low: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    medium: 'text-orange-700 bg-orange-50 border-orange-200',
    high: 'text-red-700 bg-red-50 border-red-200'
  }

  return (
    <div className={`rounded-lg border p-3 ${urgencyColors[urgency]}`}>
      <div className="flex items-center justify-between">
        <span className="font-medium">{item}</span>
        <AlertTriangle className="w-4 h-4" />
      </div>
      <div className="text-sm mt-1">
        Current: {currentStock} | Min: {minimumStock}
      </div>
    </div>
  )
}

export function KitchenDashboard() {
  const activeOrders = [
    {
      orderNumber: "K-001",
      items: ["Nyama Choma (2)", "Ugali (2)", "Sukuma Wiki"],
      timeElapsed: "8 min",
      priority: "normal" as const
    },
    {
      orderNumber: "K-002", 
      items: ["Fish Curry", "Rice", "Chapati (3)"],
      timeElapsed: "15 min",
      priority: "urgent" as const
    },
    {
      orderNumber: "K-003",
      items: ["Chicken Stir-fry", "Pilau", "Salad"],
      timeElapsed: "3 min",
      priority: "rush" as const
    }
  ]

  const inventoryAlerts = [
    { item: "Tomatoes", currentStock: "2.5 kg", minimumStock: "5 kg", urgency: "high" as const },
    { item: "Cooking Oil", currentStock: "3 L", minimumStock: "5 L", urgency: "medium" as const },
    { item: "Rice", currentStock: "8 kg", minimumStock: "10 kg", urgency: "low" as const }
  ]

  return (
    <div className="space-y-6">
      {/* Kitchen Performance Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Kitchen Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orders in Queue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600">↓ 2</span> from lunch rush
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Prep Time</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12 min</p>
              </div>
              <Timer className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600">↓ 2 min</span> improvement
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Food Cost Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">KES 14,500</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-red-600">↑ 5%</span> vs target
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waste Tracking</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">KES 320</p>
              </div>
              <Package className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600">↓ KES 180</span> vs yesterday
            </div>
          </div>
        </div>
      </div>

      {/* Active Orders and Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
            <Link 
              href="/kitchen" 
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              View Kitchen Display →
            </Link>
          </div>
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <OrderCard key={order.orderNumber} {...order} />
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
            <Link 
              href="/inventory" 
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              View Full Inventory →
            </Link>
          </div>
          <div className="space-y-3">
            {inventoryAlerts.map((alert, index) => (
              <InventoryAlert key={index} {...alert} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/inventory">
            <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <Package className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-medium text-gray-900">Check Inventory</h4>
              <p className="text-sm text-gray-600">Stock levels and supplies</p>
            </div>
          </Link>

          <Link href="/suppliers">
            <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <Truck className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">Order Supplies</h4>
              <p className="text-sm text-gray-600">Supplier orders and deliveries</p>
            </div>
          </Link>

          <Link href="/recipes">
            <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <ChefHat className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-medium text-gray-900">View Recipes</h4>
              <p className="text-sm text-gray-600">Menu items and procedures</p>
            </div>
          </Link>

          <Link href="/reports">
            <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
              <h4 className="font-medium text-gray-900">Kitchen Reports</h4>
              <p className="text-sm text-gray-600">Cost analysis and efficiency</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Today's Deliveries */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Deliveries</h3>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Thika Fresh Market</p>
                    <p className="text-sm text-green-700">Vegetables and fruits - 8:30 AM</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Delivered</span>
              </div>

              <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Kikuyu Meat Suppliers</p>
                    <p className="text-sm text-gray-600">Goat meat and chicken - Expected 2:00 PM</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-600">Pending</span>
              </div>

              <div className="flex items-center justify-between p-4 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Nakumatt Wholesale</p>
                    <p className="text-sm text-gray-600">Dry goods and spices - Expected 4:00 PM</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-orange-600">Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
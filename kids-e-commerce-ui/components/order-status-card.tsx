'use client'

import { Order } from '@/lib/api-client'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Clock, XCircle, Package } from 'lucide-react'

interface OrderStatusCardProps {
  order: Order
}

export function OrderStatusCard({ order }: OrderStatusCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />
      case 'Pending':
        return <Clock className="w-6 h-6 text-yellow-500 animate-spin" />
      case 'Rejected':
        return <XCircle className="w-6 h-6 text-red-500" />
      default:
        return <Package className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-50 border-green-200'
      case 'Pending':
        return 'bg-yellow-50 border-yellow-200'
      case 'Rejected':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'Qəbul edildi'
      case 'Pending':
        return 'Gözləmədə'
      case 'Rejected':
        return 'Rədd edildi'
      default:
        return status
    }
  }

  const getStatusBgClass = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className={`border-2 p-6 ${getStatusColor(order.orderStatus)} hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon(order.orderStatus)}
            <h3 className="text-lg font-bold text-gray-900">Sifariş #{order.id}</h3>
          </div>
          <p className="text-sm text-gray-600">
            {new Date(order.createdAt).toLocaleDateString('az-AZ', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusBgClass(order.orderStatus)}`}>
          {getStatusText(order.orderStatus)}
        </span>
      </div>

      {/* Customer Info */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Müştəri</p>
        <p className="font-semibold text-gray-900">{order.fullName}</p>
      </div>

      {/* Order Items Preview */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Məhsullar ({order.orderItems?.length || 0})</p>
        <div className="space-y-1">
          {order.orderItems?.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700 truncate">{item.productName}</span>
              <span className="text-gray-600">x{item.quantity}</span>
            </div>
          ))}
          {order.orderItems && order.orderItems.length > 3 && (
            <p className="text-sm text-gray-500 italic">+{order.orderItems.length - 3} daha çox...</p>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="flex justify-between items-center">
        <span className="text-gray-700 font-semibold">Cəmi Məbləğ:</span>
        <span className="text-xl font-bold text-primary">{order.totalAmount.toFixed(2)}₼</span>
      </div>

      {/* Rejection Reason */}
      {order.orderStatus === 'Rejected' && order.rejectedReason && (
        <div className="mt-4 pt-4 border-t border-red-200 bg-red-100 p-3 rounded-lg">
          <p className="text-sm font-semibold text-red-800 mb-1">Rədd Səbəbi:</p>
          <p className="text-sm text-red-700">{order.rejectedReason}</p>
        </div>
      )}
    </Card>
  )
}

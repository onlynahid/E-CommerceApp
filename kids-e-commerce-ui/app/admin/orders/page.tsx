'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { adminOrdersApi } from '@/lib/api-client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertCircle, Loader2, Check, X, Search, ChevronDown } from 'lucide-react'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isActing, setIsActing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Accepted' | 'Rejected'>('all')

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    let filtered = orders.filter(
      (o) =>
        o.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toString().includes(searchTerm)
    )

    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.orderStatus === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, orders, statusFilter])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await adminOrdersApi.getAll()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sifarişlər yüklənə bilmədi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptOrder = async (id: number) => {
    try {
      setIsActing(true)
      await adminOrdersApi.accept(id)
      setOrders(orders.map((o) => (o.id === id ? { ...o, orderStatus: 'Accepted' } : o)))
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sifariş qəbul edilə bilmədi')
    } finally {
      setIsActing(false)
    }
  }

  const handleRejectOrder = async (id: number) => {
    if (!rejectReason.trim()) {
      setError('Rədd səbəbini daxil edin')
      return
    }

    try {
      setIsActing(true)
      await adminOrdersApi.reject(id, rejectReason)
      setOrders(orders.map((o) => (o.id === id ? { ...o, orderStatus: 'Rejected' } : o)))
      setIsDialogOpen(false)
      setRejectReason('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sifariş rədd edilə bilmədi')
    } finally {
      setIsActing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Accepted':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Gözləmədə'
      case 'Accepted':
        return 'Qəbul edildi'
      case 'Rejected':
        return 'Rədd edildi'
      default:
        return status
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">🛒 Sifarişlər</h1>
          <p className="text-muted-foreground">Cəmi {orders.length} sifariş</p>
        </div>

        {/* Filters */}
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Ad, e-mail və ya sifariş ID axtarın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 rounded-lg border-2 border-gray-200 font-semibold outline-none cursor-pointer"
            >
              <option value="all">Bütün Statuslar</option>
              <option value="Pending">Gözləmədə</option>
              <option value="Accepted">Qəbul edildi</option>
              <option value="Rejected">Rədd edildi</option>
            </select>
          </div>
        </Card>

        {/* Error Alert */}
        {error && (
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Sifarişlər yüklənir...</p>
          </Card>
        )}

        {/* Orders Table */}
        {!isLoading && (
          <Card className="border-2 border-gray-200 overflow-hidden">
            {filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">#ID</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Müştəri</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">E-mail</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Qiymət</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Tarix</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-700">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-primary">#{order.id}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800">{order.fullName}</td>
                        <td className="px-6 py-4 text-gray-600">{order.email}</td>
                        <td className="px-6 py-4 font-bold text-green-600">
                          {order.totalAmount.toFixed(2)}₼
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.orderStatus)}`}>
                            {getStatusText(order.orderStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(order.createdAt).toLocaleDateString('az-AZ')}
                        </td>
                        <td className="px-6 py-4 flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedOrder(order)
                              setRejectReason('')
                              setIsDialogOpen(true)
                            }}
                          >
                            Detallar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchTerm ? 'Axtarış nəticəsi tapılmadı' : 'Sifariş yoxdur'}
                </p>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sifariş Detalları - #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-bold text-lg mb-3">👤 Müştəri Məlumatı</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Ad</p>
                    <p className="font-semibold">{selectedOrder.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-semibold">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefon</p>
                    <p className="font-semibold">{selectedOrder.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Adres</p>
                    <p className="font-semibold">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-lg mb-3">📦 Məhsullar</h3>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                  {selectedOrder.orderItems?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center pb-2 border-b border-gray-200 last:border-0">
                      <div>
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Miqdar: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-green-600">{(item.unitPrice * item.quantity).toFixed(2)}₼</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3 pb-3 border-b-2 border-primary/20">
                  <span className="font-bold text-lg">Ümumi Qiymət:</span>
                  <span className="text-2xl font-bold text-primary">{selectedOrder.totalAmount.toFixed(2)}₼</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold inline-block mt-1 ${getStatusBadge(selectedOrder.orderStatus)}`}>
                    {getStatusText(selectedOrder.orderStatus)}
                  </span>
                </div>
              </div>

              {/* Reject Reason (if rejected) */}
              {selectedOrder.orderStatus === 'Rejected' && selectedOrder.rejectedReason && (
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <p className="text-sm font-semibold text-red-800 mb-2">Rədd Səbəbi:</p>
                  <p className="text-red-700">{selectedOrder.rejectedReason}</p>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Qeydlər:</p>
                  <p className="text-blue-700">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Actions */}
              {selectedOrder.orderStatus === 'Pending' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Rədd Səbəbi (Rədd etmə halında)</label>
                    <Input
                      placeholder="Rədd səbəbini daxil edin..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleAcceptOrder(selectedOrder.id)}
                      disabled={isActing}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-5 h-5" />
                      Qəbul Et
                    </Button>
                    <Button
                      onClick={() => handleRejectOrder(selectedOrder.id)}
                      disabled={isActing}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
                    >
                      <X className="w-5 h-5" />
                      Rədd Et
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

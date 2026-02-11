'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { adminOrdersApi, adminProductsApi, adminCategoriesApi } from '@/lib/api-client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, ShoppingCart, Package, Layers, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load statistics
        const [products, orders, categories] = await Promise.all([
          adminProductsApi.getAll(),
          adminOrdersApi.getAll(),
          adminCategoriesApi.getAll(),
        ])

        const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalCategories: categories.length,
          totalRevenue: revenue,
        })

        // Load recent orders
        const recent = await adminOrdersApi.getRecent(5)
        setRecentOrders(recent)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Statistikalar yüklənə bilmədi')
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">📊 Admin Paneli</h1>
          <p className="text-muted-foreground text-lg">
            Sizin e-ticarət platformunuzun istatistikalarını görmə
          </p>
        </div>

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
            <p className="text-muted-foreground">Statistikalar yüklənir...</p>
          </Card>
        )}

        {/* Statistics Grid */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Products */}
              <Link href="/admin/products">
                <Card className="p-6 border-2 border-blue-200 hover:shadow-lg transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-semibold">Ümumi Məhsullar</p>
                      <p className="text-4xl font-bold text-primary mt-2">{stats.totalProducts}</p>
                    </div>
                    <Package className="w-12 h-12 text-blue-500 opacity-20" />
                  </div>
                </Card>
              </Link>

              {/* Total Orders */}
              <Link href="/admin/orders">
                <Card className="p-6 border-2 border-green-200 hover:shadow-lg transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-semibold">Ümumi Sifarişlər</p>
                      <p className="text-4xl font-bold text-green-600 mt-2">{stats.totalOrders}</p>
                    </div>
                    <ShoppingCart className="w-12 h-12 text-green-500 opacity-20" />
                  </div>
                </Card>
              </Link>

              {/* Total Categories */}
              <Link href="/admin/categories">
                <Card className="p-6 border-2 border-purple-200 hover:shadow-lg transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-semibold">Ümumi Kategoriyalar</p>
                      <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalCategories}</p>
                    </div>
                    <Layers className="w-12 h-12 text-purple-500 opacity-20" />
                  </div>
                </Card>
              </Link>

              {/* Total Revenue */}
              <Card className="p-6 border-2 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-semibold">Ümumi Qiymət</p>
                    <p className="text-4xl font-bold text-orange-600 mt-2">
                      {stats.totalRevenue.toFixed(2)}₼
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-orange-500 opacity-20" />
                </div>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">📋 Son Sifarişlər</h2>
                <Link href="/admin/orders">
                  <Button variant="outline">Hamısını Gör</Button>
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700">#ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Müştəri</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Qiymət</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Tarix</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order: any) => (
                        <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-4 font-semibold text-primary">#{order.id}</td>
                          <td className="px-4 py-4 text-gray-700">{order.fullName}</td>
                          <td className="px-4 py-4 font-bold text-green-600">
                            {order.totalAmount.toFixed(2)}₼
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                order.orderStatus === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.orderStatus === 'Accepted'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {order.orderStatus === 'Pending'
                                ? 'Gözləmədə'
                                : order.orderStatus === 'Accepted'
                                ? 'Qəbul edildi'
                                : 'Rədd edildi'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-600 text-sm">
                            {new Date(order.createdAt).toLocaleDateString('az-AZ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  Henüz sifariş yoxdur
                </p>
              )}
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

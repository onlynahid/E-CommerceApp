'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { adminProductsApi } from '@/lib/api-client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader2, RefreshCw, TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react'

export default function AdminProductsStatistics() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await adminProductsApi.getStatistics()
      setStats(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Statistika yüklənə bilmədi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">📊 Məhsul Statistikası</h1>
            <p className="text-muted-foreground">Məhsullar haqqında detaylı analitika</p>
          </div>
          <Button onClick={loadStatistics} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Yenilə
          </Button>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Son yeniləmə: {lastUpdated.toLocaleString('az-AZ')}
          </p>
        )}

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
            <p className="text-muted-foreground">Statistika yüklənir...</p>
          </Card>
        )}

        {/* Statistics Grid */}
        {!isLoading && stats && (
          <>
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Products */}
              <Card className="p-6 border-2 border-primary/20 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Cəmi Məhsullar</p>
                    <p className="text-4xl font-bold text-primary">{stats.totalProducts}</p>
                  </div>
                  <Package className="w-10 h-10 text-primary/20" />
                </div>
                <p className="text-xs text-muted-foreground">Bütün məhsulları göstərir</p>
              </Card>

              {/* Available Products */}
              <Card className="p-6 border-2 border-green-200 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Mövcud Məhsullar</p>
                    <p className="text-4xl font-bold text-green-600">{stats.availableProducts}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-200" />
                </div>
                <p className="text-xs text-muted-foreground">Stokda olan məhsullar</p>
              </Card>

              {/* Out of Stock */}
              <Card className="p-6 border-2 border-red-200 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Stokda Olmayan</p>
                    <p className="text-4xl font-bold text-red-600">{stats.outOfStockProducts}</p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-red-200" />
                </div>
                <p className="text-xs text-muted-foreground">Səhm tükənmiş məhsullar</p>
              </Card>

              {/* Low Stock */}
              <Card className="p-6 border-2 border-yellow-200 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Aşağı Stok</p>
                    <p className="text-4xl font-bold text-yellow-600">{stats.lowStockProducts}</p>
                  </div>
                  <TrendingDown className="w-10 h-10 text-yellow-200" />
                </div>
                <p className="text-xs text-muted-foreground">5 və ya daha az stok</p>
              </Card>
            </div>

            {/* Price Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Average Price */}
              <Card className="p-6 border-2 border-blue-200 hover:shadow-lg transition">
                <p className="text-sm font-semibold text-muted-foreground mb-3">Orta Qiymət</p>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-blue-600">
                    {(stats.averagePrice || 0).toFixed(2)}₼
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-700">
                      Bütün məhsulların ortalama qiymətinin hesablanması
                    </p>
                  </div>
                </div>
              </Card>

              {/* Highest Price */}
              <Card className="p-6 border-2 border-green-200 hover:shadow-lg transition">
                <p className="text-sm font-semibold text-muted-foreground mb-3">Ən Yüksək Qiymət</p>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-green-600">
                    {(stats.highestPrice || 0).toFixed(2)}₼
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-700">
                      Kataloqdakı ən bahalı məhsul
                    </p>
                  </div>
                </div>
              </Card>

              {/* Lowest Price */}
              <Card className="p-6 border-2 border-purple-200 hover:shadow-lg transition">
                <p className="text-sm font-semibold text-muted-foreground mb-3">Ən Aşağı Qiymət</p>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-purple-600">
                    {(stats.lowestPrice || 0).toFixed(2)}₼
                  </p>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-700">
                      Kataloqdakı ən ucuz məhsul
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Availability Summary */}
              <Card className="p-6 border-2 border-gray-200">
                <h3 className="text-lg font-bold mb-4">📈 Mövcudluq Xülasəsi</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Mövcud:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              stats.totalProducts > 0
                                ? (stats.availableProducts / stats.totalProducts) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        {(
                          (stats.availableProducts / (stats.totalProducts || 1)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Stokda Olmayan:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              stats.totalProducts > 0
                                ? (stats.outOfStockProducts / stats.totalProducts) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-red-600">
                        {(
                          (stats.outOfStockProducts / (stats.totalProducts || 1)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Aşağı Stok:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              stats.totalProducts > 0
                                ? (stats.lowStockProducts / stats.totalProducts) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-yellow-600">
                        {(
                          (stats.lowStockProducts / (stats.totalProducts || 1)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Price Range Summary */}
              <Card className="p-6 border-2 border-gray-200">
                <h3 className="text-lg font-bold mb-4">💰 Qiymət Xülasəsi</h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                    <p className="text-xs font-semibold text-purple-800 mb-1">Qiymət Diapazonu</p>
                    <p className="text-sm font-bold text-purple-900">
                      {(stats.lowestPrice || 0).toFixed(2)}₼ - {(stats.highestPrice || 0).toFixed(2)}₼
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-blue-800 mb-1">Orta Qiymət</p>
                    <p className="text-sm font-bold text-blue-900">
                      {(stats.averagePrice || 0).toFixed(2)}₼
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                    <p className="text-xs font-semibold text-green-800 mb-1">Fərq (Ən yüksək - Ən aşağı)</p>
                    <p className="text-sm font-bold text-green-900">
                      {((stats.highestPrice || 0) - (stats.lowestPrice || 0)).toFixed(2)}₼
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Info Box */}
            <Card className="p-6 bg-blue-50 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3">ℹ️ Məlumat</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• <strong>Mövcud Məhsullar:</strong> Stoku 0-dan çox olan məhsullar</li>
                <li>• <strong>Stokda Olmayan:</strong> Stoku 0 olan məhsullar</li>
                <li>• <strong>Aşağı Stok:</strong> Stoku 5 və ya daha az olan məhsullar</li>
                <li>• <strong>Orta Qiymət:</strong> Bütün məhsulların qiymətinin ortalaması</li>
              </ul>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

'use client'

import { useProducts } from '@/hooks/use-products'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { ProductImage } from './product-image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export function ProductsSection() {
  const { products, isLoading } = useProducts()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const discountedProducts = products
    .filter((p) => p.discountPercantage && p.discountPercantage > 0)
    .sort((a, b) => (b.discountPercantage || 0) - (a.discountPercantage || 0))
    .slice(0, 8)

  // Calculate average discount and max discount
  const avgDiscount = discountedProducts.length > 0 
    ? Math.round(discountedProducts.reduce((sum, p) => sum + (p.discountPercantage || 0), 0) / discountedProducts.length)
    : 0
  const maxDiscount = discountedProducts.length > 0 
    ? Math.round(Math.max(...discountedProducts.map(p => p.discountPercantage || 0)))
    : 0

  // Get product attributes for display
  const getProductAttributes = (product: any) => {
    const attrs = []
    if (product.ageGroups?.length > 0) attrs.push({ icon: '👶', value: product.ageGroups[0], label: 'Yaş' })
    if (product.materials?.length > 0) attrs.push({ icon: '🧵', value: product.materials[0], label: 'Material' })
    if (product.size?.length > 0) attrs.push({ icon: '📏', value: product.size[0], label: 'Beden' })
    if (product.colors?.length > 0) attrs.push({ icon: '🎨', value: product.colors[0], label: 'Rəng' })
    return attrs.slice(0, 2) // Max 2 attributes for carousel
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount)

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      })

      setTimeout(updateScrollButtons, 300)
    }
  }

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0)
      setCanScrollRight(
        scrollContainerRef.current.scrollLeft <
          scrollContainerRef.current.scrollWidth -
            scrollContainerRef.current.clientWidth -
          10
      )
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
        </div>
      </div>
    )
  }

  if (discountedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with Filter Mention */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Sərfəli qiymətlər</h2>
            <p className="text-gray-600">Seçilmiş məhsullar endirimlə</p>
          </div>
          
          {/* Filter Mention UI */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-2">
              {/* Discount Filter Badge */}
              <div className="bg-gradient-to-r from-orange-100 to-orange-50 px-4 py-2.5 rounded-full border-2 border-orange-300 shadow-md flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-orange-700">🏷️ ENDİRİM</span>
                  <span className="text-xs font-bold text-orange-600 bg-white px-2 py-0.5 rounded-full border border-orange-200">
                    {discountedProducts.length} məhsul
                  </span>
                </div>
              </div>
              
              {/* Discount Stats */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-2 rounded-lg border-2 border-teal-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-700">📊 Ortalama:</span>
                    <span className="text-sm font-bold text-teal-600 bg-white px-2 py-0.5 rounded border border-teal-200">
                      -{avgDiscount}%
                    </span>
                  </div>
                  <div className="w-px h-6 bg-teal-200"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-700">🎯 Maksimum:</span>
                    <span className="text-sm font-bold text-teal-600 bg-white px-2 py-0.5 rounded border border-teal-200">
                      -{maxDiscount}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <Link href="/?discount=true">
              <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50 h-fit">
                Hamısını Gör
              </Button>
            </Link>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={updateScrollButtons}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
            style={{
              scrollBehavior: 'smooth',
            }}
          >
            {discountedProducts.map((product) => {
              const discount = Math.round(product.discountPercantage || 0)
              const productAttributes = getProductAttributes(product)

              return (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="flex-shrink-0 w-64 overflow-hidden hover:shadow-xl transition-all hover:scale-105 border-2 border-teal-100 bg-white rounded-2xl cursor-pointer flex flex-row">
                    {/* Left Side - Product Attributes */}
                    {productAttributes.length > 0 && (
                      <div className="flex flex-col justify-between p-2 bg-gradient-to-b from-teal-50 to-cyan-50 border-r-2 border-teal-200 min-w-fit">
                        {productAttributes.map((attr, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center justify-center gap-0.5 p-1.5 rounded hover:bg-white transition"
                          >
                            <span className="text-base">{attr.icon}</span>
                            <span className="text-xs font-bold text-teal-700 text-center leading-tight">
                              {attr.value.length > 6 ? attr.value.substring(0, 6) + '.' : attr.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Main Content */}
                    <div className="flex flex-col flex-1">
                      {/* Image Area */}
                      <div className="relative bg-gradient-to-br from-cyan-100 to-teal-50 p-4 h-48 flex items-center justify-center overflow-hidden">
                        {/* Discount Badge */}
                        {discount > 0 && (
                          <div className="absolute top-3 right-3 bg-gradient-to-br from-orange-400 to-orange-500 text-white font-black rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-lg z-10 border-4 border-white">
                            <span className="text-xs">-{discount}%</span>
                            <span className="text-xs font-bold">ENDİRİM</span>
                          </div>
                        )}

                        {/* Product Image */}
                        <div className="w-full h-full">
                          <ProductImage
                            imageUrl={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            fill={false}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 space-y-2 flex-grow flex flex-col justify-between">
                        <h3 className="font-bold text-sm text-gray-800 line-clamp-2 hover:text-teal-600 transition">
                          {product.name}
                        </h3>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-teal-600">
                            {formatPrice(product.finalPrice)}
                          </span>
                          {discount > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < Math.floor(product.rating || 0)
                                    ? '⭐'
                                    : '☆'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({product.reviews || 0})
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:shadow-lg text-white font-bold rounded-full py-4 text-sm">
                          🛒 Sepete Ekle
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Scroll Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full transition-all ${
                canScrollLeft
                  ? 'bg-teal-100 text-teal-600 hover:bg-teal-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-2">
              {discountedProducts.slice(0, 4).map((_, index) => (
                <div
                  key={index}
                  className="h-2 w-2 rounded-full bg-teal-300"
                />
              ))}
            </div>

            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full transition-all ${
                canScrollRight
                  ? 'bg-teal-100 text-teal-600 hover:bg-teal-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

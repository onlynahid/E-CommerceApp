'use client'

import { useProducts } from '@/hooks/use-products'
import { ProductCard } from './product-card'
import { Loader2 } from 'lucide-react'

export function CategoriesSection() {
  const { products, isLoading } = useProducts()

  // Get featured products (top rated and latest)
  const featuredProducts = products
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8)

  if (isLoading) {
    return (
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
        </div>
      </div>
    )
  }

  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4"> Populyar Məhsullar</h2>
          <p className="text-gray-600 text-lg"></p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              finalPrice={product.finalPrice}
              imageUrl={product.imageUrl}
              discountPercantage={product.discountPercantage}
              rating={product.rating || 0}
              reviews={product.reviews || 0}
              stock={product.stock}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

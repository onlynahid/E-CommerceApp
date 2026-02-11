'use client'

import { useProducts } from '@/hooks/use-products'
import { ProductCard } from './product-card'
// import { FilterMentionUI } from './filter-mention-ui'
import { QuickFilter } from './quick-filter'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { ProductFilter } from '@/lib/api-client'

export function AllProductsSection() {
  const { products, isLoading } = useProducts()
  const [showAll, setShowAll] = useState(false)
  const [displayedProducts, setDisplayedProducts] = useState(products)
  const [activeFilters, setActiveFilters] = useState<ProductFilter>({
    ageGroups: [],
    materials: [],
    size: [],
    colors: [],
    minPrice: undefined,
    maxPrice: undefined,
  })

  // Show 12 products initially, all if showAll is true
  const productsToDisplay = showAll ? displayedProducts : displayedProducts.slice(0, 12)

  // Extract available filters from all products
  const getAvailableFilters = () => {
    const validProducts = Array.isArray(products) ? products : []
    
    return {
      ageGroups: Array.from(
        new Set(
          validProducts
            .flatMap((p) => p.ageGroups || [])
            .filter((ag: string) => ag && ag !== 'string')
        )
      ),
      materials: Array.from(
        new Set(
          validProducts
            .flatMap((p) => p.materials || [])
            .filter((m: string) => m && m !== 'string')
        )
      ),
      sizes: Array.from(
        new Set(
          validProducts
            .flatMap((p) => p.size || [])
            .filter((s: string) => s && s !== 'string')
        )
      ),
      colors: Array.from(
        new Set(
          validProducts
            .flatMap((p) => p.colors || [])
            .filter((c: string) => c && c !== 'string')
        )
      ),
      priceRange: {
        min: validProducts.length > 0 ? Math.min(...validProducts.map((p) => p.price)) : 0,
        max: validProducts.length > 0 ? Math.max(...validProducts.map((p) => p.price)) : 100,
      },
    }
  }

  const availableFilters = getAvailableFilters()

  const handleFilterChange = (filters: ProductFilter, filteredProducts: any[]) => {
    setActiveFilters(filters)
    setDisplayedProducts(filteredProducts)
    setShowAll(false)
  }

  const handleReset = () => {
    setActiveFilters({
      ageGroups: [],
      materials: [],
      size: [],
      colors: [],
      minPrice: undefined,
      maxPrice: undefined,
    })
    setDisplayedProducts(products)
    setShowAll(false)
  }

  if (isLoading) {
    return (
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with Filter Mention and Quick Filter Button */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2"></h2>
            <p className="text-gray-600"></p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* Filter Mention UI */}
            {/* <div className="w-full md:w-auto">
              <FilterMentionUI 
                activeFilters={activeFilters}
              />
            </div> */}

            {/* Quick Filter Button */}
            <QuickFilter
              onFilterChange={handleFilterChange}
              availableFilters={availableFilters}
              allProducts={products}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {productsToDisplay.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              finalPrice={product.finalPrice}
              imageUrl={product.imageUrl}
              discountPercantage={product.discountPercantage}
              rating={product.rating || 4.5}
              reviews={product.reviews || 0}
              stock={product.stock}
              ageGroups={product.ageGroups}
              materials={product.materials}
              size={product.size}
              colors={product.colors}
            />
          ))}
        </div>

        {/* Load More Button */}
        {!showAll && displayedProducts.length > 12 && (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAll(true)}
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-full px-12 py-7 text-lg gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Daha Çox Məhsul Gör
              <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Show Less Button */}
        {showAll && displayedProducts.length > 12 && (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAll(false)}
              size="lg"
              variant="outline"
              className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-bold rounded-full px-12 py-7 text-lg gap-2"
            >
              Az Gör
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

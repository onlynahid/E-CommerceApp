'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useProducts } from '@/hooks/use-products'
import { Product, ProductFilter } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X, Filter } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

const PRODUCTS_PER_PAGE = 12

export default function ProductsPage() {
  const { products, isLoading, error } = useProducts()
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'new'>('popular')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [activeFilters, setActiveFilters] = useState<ProductFilter>({
    ageGroups: [],
    materials: [],
    size: [],
    colors: [],
    minPrice: undefined,
    maxPrice: undefined,
  })
  const [priceRange, setPriceRange] = useState([0, 200])
  const [isFilterLoading, setIsFilterLoading] = useState(false)

  // Initialize all products on first load
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      setAllProducts(products)
      setDisplayedProducts(products)
      setCurrentPage(1)
      
      // Set initial price range
      const minPrice = Math.min(...products.map(p => p.price))
      const maxPrice = Math.max(...products.map(p => p.price))
      setPriceRange([minPrice, maxPrice])
    }
  }, [products])

  // Extract available filters from all products
  const getAvailableFilters = () => {
    const validProducts = Array.isArray(allProducts) ? allProducts : []
    
    return {
      ageGroups: Array.from(
        new Set(
          validProducts
            .flatMap((p: Product) => p.ageGroups || [])
            .filter((ag: string) => ag && ag !== 'string')
        )
      ),
      materials: Array.from(
        new Set(
          validProducts
            .flatMap((p: Product) => p.materials || [])
            .filter((m: string) => m && m !== 'string')
        )
      ),
      sizes: Array.from(
        new Set(
          validProducts
            .flatMap((p: Product) => p.size || [])
            .filter((s: string) => s && s !== 'string')
        )
      ),
      colors: Array.from(
        new Set(
          validProducts
            .flatMap((p: Product) => p.colors || [])
            .filter((c: string) => c && c !== 'string')
        )
      ),
      priceRange: {
        min: validProducts.length > 0 ? Math.min(...validProducts.map((p: Product) => p.price)) : 0,
        max: validProducts.length > 0 ? Math.max(...validProducts.map((p: Product) => p.price)) : 100,
      },
    }
  }

  const availableFilters = getAvailableFilters()

  // Handle sorting
  useEffect(() => {
    if (Array.isArray(displayedProducts)) {
      let sorted = [...displayedProducts]

      if (sortBy === 'price-low') {
        sorted.sort((a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price))
      } else if (sortBy === 'price-high') {
        sorted.sort((a, b) => (b.finalPrice || b.price) - (a.finalPrice || a.price))
      } else if (sortBy === 'new') {
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      setDisplayedProducts(sorted)
      setCurrentPage(1)
    }
  }, [sortBy])

  const handleFilterChange = async () => {
    setIsFilterLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newFilters: ProductFilter = {
        ageGroups: activeFilters.ageGroups?.length ? activeFilters.ageGroups : undefined,
        materials: activeFilters.materials?.length ? activeFilters.materials : undefined,
        size: activeFilters.size?.length ? activeFilters.size : undefined,
        colors: activeFilters.colors?.length ? activeFilters.colors : undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      }

      // Filter products locally
      let filtered = allProducts.filter(product => {
        const priceMatch = (product.price >= priceRange[0] && product.price <= priceRange[1])
        const ageMatch = !newFilters.ageGroups?.length || 
          (product.ageGroups || []).some(ag => newFilters.ageGroups!.includes(ag))
        const materialMatch = !newFilters.materials?.length || 
          (product.materials || []).some(m => newFilters.materials!.includes(m))
        const sizeMatch = !newFilters.size?.length || 
          (product.size || []).some(s => newFilters.size!.includes(s))
        const colorMatch = !newFilters.colors?.length || 
          (product.colors || []).some(c => newFilters.colors!.includes(c))
        
        return priceMatch && ageMatch && materialMatch && sizeMatch && colorMatch
      })

      setActiveFilters(newFilters)
      setDisplayedProducts(filtered)
      setCurrentPage(1)
    } finally {
      setIsFilterLoading(false)
    }
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
    setPriceRange([availableFilters.priceRange.min, availableFilters.priceRange.max])
    setDisplayedProducts(allProducts)
    setCurrentPage(1)
  }

  // Pagination calculation
  const totalPages = Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const productsToDisplay = Array.isArray(displayedProducts) 
    ? displayedProducts.slice(startIndex, endIndex)
    : []

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-12 md:py-20 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                🛍️ Məhsullar
              </h1>
              <p className="text-lg text-muted-foreground">
                Bütün məhsulları kəşf edin və uygun filtrlərlə aradığınızı tapın
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Error Notice */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4 mt-6">
          <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-800">
            <p className="font-semibold">❌ Xəta: {error}</p>
            <p className="text-sm mt-2">Lütfən səhifəni yenidən yükləyəsiniz və ya sonra cəhd edin.</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Filter Sidebar - Mobile Responsive */}
          <div className={`lg:col-span-1 ${showFilterPanel ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gradient-to-b from-white to-cyan-50 rounded-2xl border-2 border-cyan-300 p-6 shadow-lg sticky top-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-teal-600" />
                  Filtrelə
                </h2>
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="lg:hidden text-gray-600 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Price Range */}
                <div className="border-b-2 border-cyan-200 pb-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    💰 Qiymət Aralığı
                  </h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={availableFilters.priceRange.min}
                    max={availableFilters.priceRange.max}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-3 text-sm font-bold text-teal-600">
                    <span>{priceRange[0]}₼</span>
                    <span>{priceRange[1]}₼</span>
                  </div>
                </div>

                {/* Age Groups */}
                {availableFilters.ageGroups.length > 0 && (
                  <div className="border-b-2 border-cyan-200 pb-5">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      👶 Yaş Qrupu
                    </h3>
                    <div className="space-y-2">
                      {availableFilters.ageGroups.map(ageGroup => (
                        <div key={ageGroup} className="flex items-center space-x-3">
                          <Checkbox
                            id={`age-${ageGroup}`}
                            checked={(activeFilters.ageGroups || []).includes(ageGroup)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  ageGroups: [...(prev.ageGroups || []), ageGroup]
                                }))
                              } else {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  ageGroups: (prev.ageGroups || []).filter(a => a !== ageGroup)
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={`age-${ageGroup}`} className="text-sm cursor-pointer font-medium text-gray-700">
                            {ageGroup}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials */}
                {availableFilters.materials.length > 0 && (
                  <div className="border-b-2 border-cyan-200 pb-5">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      🧵 Material
                    </h3>
                    <div className="space-y-2">
                      {availableFilters.materials.map(material => (
                        <div key={material} className="flex items-center space-x-3">
                          <Checkbox
                            id={`material-${material}`}
                            checked={(activeFilters.materials || []).includes(material)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  materials: [...(prev.materials || []), material]
                                }))
                              } else {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  materials: (prev.materials || []).filter(m => m !== material)
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={`material-${material}`} className="text-sm cursor-pointer font-medium text-gray-700">
                            {material}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {availableFilters.sizes.length > 0 && (
                  <div className="border-b-2 border-cyan-200 pb-5">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      📏 Beden
                    </h3>
                    <div className="space-y-2">
                      {availableFilters.sizes.map(size => (
                        <div key={size} className="flex items-center space-x-3">
                          <Checkbox
                            id={`size-${size}`}
                            checked={(activeFilters.size || []).includes(size)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  size: [...(prev.size || []), size]
                                }))
                              } else {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  size: (prev.size || []).filter(s => s !== size)
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer font-medium text-gray-700">
                            {size}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {availableFilters.colors.length > 0 && (
                  <div className="border-b-2 border-cyan-200 pb-5">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      🎨 Rəng
                    </h3>
                    <div className="space-y-2">
                      {availableFilters.colors.map(color => (
                        <div key={color} className="flex items-center space-x-3">
                          <Checkbox
                            id={`color-${color}`}
                            checked={(activeFilters.colors || []).includes(color)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  colors: [...(prev.colors || []), color]
                                }))
                              } else {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  colors: (prev.colors || []).filter(c => c !== color)
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={`color-${color}`} className="text-sm cursor-pointer font-medium text-gray-700">
                            {color}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleFilterChange}
                    disabled={isFilterLoading}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-lg py-2"
                  >
                    ✨ Filtreləri Tətbiq Et
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-bold rounded-lg"
                  >
                    🔄 Sıfırla
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-4 space-y-6">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilterPanel(true)}
              className="lg:hidden w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-lg py-2 flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filtreləri Aç
            </button>

            {/* Top Bar with Sort */}
            <div className="flex justify-between items-center flex-wrap gap-4 bg-white p-4 rounded-lg border-2 border-gray-200 mb-6">
              <div className="text-lg font-semibold text-gray-800">
                📊 {displayedProducts.length} məhsul tapıldı
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <label className="font-semibold text-gray-700">Sırala:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary outline-none font-medium cursor-pointer bg-white"
                >
                  <option value="popular">Populyar</option>
                  <option value="new">Yeni Məhsullar</option>
                  <option value="price-low">Aşağı Qiymətdən</option>
                  <option value="price-high">Yüksək Qiymətdən</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                  <div className="text-xl text-muted-foreground">Məhsullar yüklənir...</div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && Array.isArray(displayedProducts) && displayedProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {productsToDisplay.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      description={product.description}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
                    {/* Previous Button */}
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Əvvəlki
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          variant={currentPage === page ? 'default' : 'outline'}
                          className={`w-10 h-10 p-0 rounded-lg font-bold ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-0'
                              : 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50'
                          }`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    {/* Next Button */}
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sonrakı
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Pagination Info */}
                <div className="text-center text-sm text-gray-600 mb-4">
                  Səhifə {currentPage} / {totalPages} | Cəmi {displayedProducts.length} məhsul
                </div>
              </>
            )}

            {/* Empty State */}
            {!isLoading && (!Array.isArray(displayedProducts) || displayedProducts.length === 0) && !error && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl font-semibold text-gray-800 mb-2">Məhsul bulunamadı</p>
                <p className="text-muted-foreground mb-6">
                  Zəhmət olmasa, filterləri dəyişdirərək yenidən cəhd edin
                </p>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="mt-6"
                >
                  Filterləri Temizlə
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

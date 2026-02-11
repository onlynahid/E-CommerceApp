'use client'

import { useState, useEffect } from 'react'
import { ProductFilter, Product, productsApi } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ChevronDown, X, Filter, Loader2 } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface ProductFilterProps {
  onFilterChange: (filters: ProductFilter, filteredProducts: Product[]) => void
  onReset: () => void
  availableFilters: {
    ageGroups: string[]
    materials: string[]
    sizes: string[]
    colors: string[]
    priceRange: {
      min: number
      max: number
    }
  }
  allProducts: Product[]
}

export function ProductFilterComponent({ 
  onFilterChange, 
  onReset, 
  availableFilters,
  allProducts
}: ProductFilterProps) {
  const [filters, setFilters] = useState<ProductFilter>({
    ageGroups: [],
    materials: [],
    size: [],
    colors: [],
    minPrice: availableFilters.priceRange.min,
    maxPrice: availableFilters.priceRange.max,
  })

  const [priceRange, setPriceRange] = useState([
    availableFilters.priceRange.min,
    availableFilters.priceRange.max,
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFilterChange = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const newFilters: ProductFilter = {
        ageGroups: filters.ageGroups?.length ? filters.ageGroups : undefined,
        materials: filters.materials?.length ? filters.materials : undefined,
        size: filters.size?.length ? filters.size : undefined,
        colors: filters.colors?.length ? filters.colors : undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      }

      // Call backend API
      const filteredProducts = await productsApi.filter(newFilters)
      
      setFilters(prev => ({
        ...prev,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      }))
      
      onFilterChange(newFilters, filteredProducts)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Filtrləmə xətası baş verdi'
      setError(errorMessage)
      console.error('Filter error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAgeGroupChange = (ageGroup: string, checked: boolean) => {
    const newAgeGroups = checked
      ? [...(filters.ageGroups || []), ageGroup]
      : (filters.ageGroups || []).filter(ag => ag !== ageGroup)
    
    setFilters(prev => ({
      ...prev,
      ageGroups: newAgeGroups,
    }))
  }

  const handleMaterialChange = (material: string, checked: boolean) => {
    const newMaterials = checked
      ? [...(filters.materials || []), material]
      : (filters.materials || []).filter(m => m !== material)
    
    setFilters(prev => ({
      ...prev,
      materials: newMaterials,
    }))
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...(filters.size || []), size]
      : (filters.size || []).filter(s => s !== size)
    
    setFilters(prev => ({
      ...prev,
      size: newSizes,
    }))
  }

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...(filters.colors || []), color]
      : (filters.colors || []).filter(c => c !== color)
    
    setFilters(prev => ({
      ...prev,
      colors: newColors,
    }))
  }

  const handleReset = async () => {
    setIsLoading(true)
    setError(null)

    try {
      setFilters({
        ageGroups: [],
        materials: [],
        size: [],
        colors: [],
        minPrice: availableFilters.priceRange.min,
        maxPrice: availableFilters.priceRange.max,
      })
      setPriceRange([availableFilters.priceRange.min, availableFilters.priceRange.max])
      
      // Fetch all products when resetting
      const allFilteredProducts = await productsApi.getAll()
      onReset()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sıfırlamada xəta baş verdi'
      setError(errorMessage)
      console.error('Reset error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const activeFiltersCount =
    (filters.ageGroups?.length || 0) +
    (filters.materials?.length || 0) +
    (filters.size?.length || 0) +
    (filters.colors?.length || 0)

  return (
    <Card className="p-6 bg-gradient-to-b from-white to-cyan-50 border-3 border-teal-200 h-fit sticky top-4 shadow-xl rounded-3xl hover:shadow-2xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-teal-100">
        <div className="flex items-center gap-2">
          <Filter className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-900">Filtrelə</h2>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-full transition flex items-center gap-1 font-semibold disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            <span className="text-xs">Sıfırla</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-100 border-2 border-red-300 rounded-2xl">
          <p className="text-sm font-bold text-red-700">❌ {error}</p>
        </div>
      )}

      {/* Active Filters Badge */}
      {activeFiltersCount > 0 && (
        <div className="mb-6 p-3 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl border-2 border-teal-200">
          <p className="text-sm font-bold text-teal-700">
            ✨ {activeFiltersCount} aktif filtre
          </p>
        </div>
      )}

      {/* Price Range Filter */}
      <Collapsible defaultOpen={true} className="mb-6">
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-3 font-bold text-gray-900 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition">
          <span className="flex items-center gap-2">💰 Qiymət Aralığı</span>
          <ChevronDown className="w-5 h-5" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-3 px-3">
          <div className="space-y-3">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={availableFilters.priceRange.min}
              max={availableFilters.priceRange.max}
              step={5}
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-between items-center bg-white p-3 rounded-xl border-2 border-teal-100">
            <span className="text-sm font-bold text-teal-700">{priceRange[0]}₼</span>
            <span className="text-xs text-gray-500">-</span>
            <span className="text-sm font-bold text-teal-700">{priceRange[1]}₼</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Age Groups Filter */}
      {availableFilters.ageGroups.length > 0 && (
        <Collapsible defaultOpen={true} className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-3 font-bold text-gray-900 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition">
            <span className="flex items-center gap-2">👶 Yaş Qrupu</span>
            <ChevronDown className="w-5 h-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-3 px-3">
            {availableFilters.ageGroups.map(ageGroup => (
              <div key={ageGroup} className="flex items-center space-x-3 p-2 hover:bg-teal-50 rounded-lg transition cursor-pointer group">
                <Checkbox
                  id={`age-${ageGroup}`}
                  checked={(filters.ageGroups || []).includes(ageGroup)}
                  onCheckedChange={(checked) =>
                    handleAgeGroupChange(ageGroup, checked as boolean)
                  }
                  className="w-5 h-5 border-2 border-teal-300 cursor-pointer"
                  disabled={isLoading}
                />
                <Label
                  htmlFor={`age-${ageGroup}`}
                  className="text-sm cursor-pointer font-medium text-gray-700 group-hover:text-teal-600 transition"
                >
                  {ageGroup}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Materials Filter */}
      {availableFilters.materials.length > 0 && (
        <Collapsible defaultOpen={true} className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-3 font-bold text-gray-900 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition">
            <span className="flex items-center gap-2">🧵 Material</span>
            <ChevronDown className="w-5 h-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-3 px-3">
            {availableFilters.materials.map(material => (
              <div key={material} className="flex items-center space-x-3 p-2 hover:bg-teal-50 rounded-lg transition cursor-pointer group">
                <Checkbox
                  id={`material-${material}`}
                  checked={(filters.materials || []).includes(material)}
                  onCheckedChange={(checked) =>
                    handleMaterialChange(material, checked as boolean)
                  }
                  className="w-5 h-5 border-2 border-teal-300 cursor-pointer"
                  disabled={isLoading}
                />
                <Label
                  htmlFor={`material-${material}`}
                  className="text-sm cursor-pointer font-medium text-gray-700 group-hover:text-teal-600 transition"
                >
                  {material}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Size Filter */}
      {availableFilters.sizes.length > 0 && (
        <Collapsible defaultOpen={true} className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-3 font-bold text-gray-900 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition">
            <span className="flex items-center gap-2">📏 Beden</span>
            <ChevronDown className="w-5 h-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-3 px-3">
            {availableFilters.sizes.map(size => (
              <div key={size} className="flex items-center space-x-3 p-2 hover:bg-teal-50 rounded-lg transition cursor-pointer group">
                <Checkbox
                  id={`size-${size}`}
                  checked={(filters.size || []).includes(size)}
                  onCheckedChange={(checked) =>
                    handleSizeChange(size, checked as boolean)
                  }
                  className="w-5 h-5 border-2 border-teal-300 cursor-pointer"
                  disabled={isLoading}
                />
                <Label
                  htmlFor={`size-${size}`}
                  className="text-sm cursor-pointer font-medium text-gray-700 group-hover:text-teal-600 transition"
                >
                  {size}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Colors Filter */}
      {availableFilters.colors.length > 0 && (
        <Collapsible defaultOpen={true} className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-3 font-bold text-gray-900 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition">
            <span className="flex items-center gap-2">🎨 Rəng</span>
            <ChevronDown className="w-5 h-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-3 px-3">
            {availableFilters.colors.map(color => (
              <div key={color} className="flex items-center space-x-3 p-2 hover:bg-teal-50 rounded-lg transition cursor-pointer group">
                <Checkbox
                  id={`color-${color}`}
                  checked={(filters.colors || []).includes(color)}
                  onCheckedChange={(checked) =>
                    handleColorChange(color, checked as boolean)
                  }
                  className="w-5 h-5 border-2 border-teal-300 cursor-pointer"
                  disabled={isLoading}
                />
                <Label
                  htmlFor={`color-${color}`}
                  className="text-sm cursor-pointer font-medium text-gray-700 group-hover:text-teal-600 transition"
                >
                  {color}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Apply Button */}
      <Button
        onClick={handleFilterChange}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-full py-6 mt-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Yüklənir...
          </>
        ) : (
          '✨ Filtreləri Tətbiq Et'
        )}
      </Button>
    </Card>
  )
}

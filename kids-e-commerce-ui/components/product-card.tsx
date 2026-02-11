'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { Product } from '@/lib/api-client'
import { ProductImage } from './product-image'
import { ProductDetailModal } from './product-detail-modal'

interface ProductCardProps {
  id: number
  name: string
  description?: string
  price: number
  finalPrice: number
  imageUrl: string
  discountPercantage?: number
  rating: number
  reviews: number
  stock: number
  ageGroups?: string[]
  materials?: string[]
  size?: string[]
  colors?: string[]
}

export function ProductCard({
  id,
  name,
  description = '',
  price,
  finalPrice,
  imageUrl,
  discountPercantage = 0,
  rating,
  reviews,
  stock,
  ageGroups = [],
  materials = [],
  size = [],
  colors = [],
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const { addItem } = useCart()
  const inStock = stock > 0
  const discount = discountPercantage ? Math.round(discountPercantage) : 0

  // Get product attributes for left side display
  const getProductAttributes = () => {
    const attrs = []
    if (ageGroups?.length > 0) attrs.push({ icon: '👶', value: ageGroups[0], label: 'Yaş' })
    if (materials?.length > 0) attrs.push({ icon: '🧵', value: materials[0], label: 'Material' })
    if (size?.length > 0) attrs.push({ icon: '📏', value: size[0], label: 'Beden' })
    if (colors?.length > 0) attrs.push({ icon: '🎨', value: colors[0], label: 'Rəng' })
    return attrs.slice(0, 3) // Max 3 attributes
  }

  const productAttributes = getProductAttributes()

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowDetailModal(true)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    const product: Product = {
      id,
      name,
      description,
      price,
      finalPrice,
      stock,
      categoryId: 0,
      imageUrl,
      createdAt: new Date().toISOString(),
      ageGroups,
      materials,
      size,
      colors,
      discountPercantage,
      rating,
      reviews,
    }
    addItem(product, 1)
  }

  const product: Product = {
    id,
    name,
    description,
    price,
    finalPrice,
    stock,
    categoryId: 0,
    imageUrl,
    createdAt: new Date().toISOString(),
    ageGroups,
    materials,
    size,
    colors,
    discountPercantage,
    rating,
    reviews,
  }

  return (
    <>
      <Card
        onClick={handleCardClick}
        className="overflow-hidden hover:shadow-xl transition-all hover:scale-105 border-2 border-teal-100 bg-white cursor-pointer h-full rounded-2xl flex flex-col lg:flex-row"
      >
        {/* Left Side - Product Attributes */}
        {productAttributes.length > 0 && (
          <div className="hidden lg:flex flex-col justify-between p-3 bg-gradient-to-b from-teal-50 to-cyan-50 border-r-2 border-teal-200 min-w-fit">
            {productAttributes.map((attr, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-white transition"
              >
                <span className="text-lg">{attr.icon}</span>
                <span className="text-xs font-bold text-teal-700 text-center leading-tight">
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col w-full">
          {/* Image Area */}
          <div className="relative bg-gradient-to-br from-cyan-100 to-teal-50 p-4 h-56 flex items-center justify-center overflow-hidden">
            {/* Discount Badge - Orange */}
            {discount > 0 && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full w-14 h-14 flex items-center justify-center text-sm shadow-lg z-10 flex-col">
                <span className="text-xs">-{discount}%</span>
                <span className="text-xs font-bold">ENDİRİM</span>
              </div>
            )}

            {/* Stock Status */}
            {!inStock && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                <span className="bg-gray-700 text-white px-4 py-2 rounded-full font-bold">
                  Stokta Yok
                </span>
              </div>
            )}

            {/* Product Image */}
            <div className="w-full h-full">
              <ProductImage
                imageUrl={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
                fill={false}
              />
            </div>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsFavorite(!isFavorite)
              }}
              className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition z-10"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </button>
          </div>

          {/* Content Area */}
          <div className="p-4 space-y-3 flex-grow flex flex-col">
            <h3 className="font-bold text-base text-gray-800 line-clamp-2 hover:text-teal-600 transition">
              {name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-teal-600">{finalPrice.toFixed(2)}₼</span>
              {discount > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  {price.toFixed(2)}₼
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:shadow-lg text-white font-bold rounded-full py-5 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Sepete Ekle
            </Button>
          </div>
        </div>
      </Card>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={product}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onAddToCart={(prod, qty) => {
          addItem(prod, qty)
        }}
      />
    </>
  )
}

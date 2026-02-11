'use client'

import { Product } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { X, ShoppingCart, Heart, Share2, Star, Truck, RotateCcw } from 'lucide-react'
import { ProductImage } from './product-image'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'

interface ProductDetailModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onAddToCart?: (product: Product, quantity: number) => void
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  if (!isOpen) return null

  const discount = Math.round(product.discountPercantage || 0)
  const savings = product.price - product.finalPrice

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity)
    }
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 py-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🛍️ Məhsullar
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="flex flex-col gap-4">
                  <div className="relative bg-gradient-to-br from-cyan-100 to-teal-50 rounded-2xl p-6 aspect-square flex items-center justify-center overflow-hidden">
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-4 right-4 bg-gradient-to-br from-orange-400 to-orange-500 text-white font-black rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg z-10 border-4 border-white">
                        <span className="text-xs">-{discount}%</span>
                        <span className="text-xs">ENDİRİM</span>
                      </div>
                    )}

                    <ProductImage
                      imageUrl={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl"
                      fill={false}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-2 border-teal-600 text-teal-600 hover:bg-teal-50"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Seç
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-2 border-teal-600 text-teal-600 hover:bg-teal-50"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Paylaş
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-6">
                  {/* Title */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h1>
                    <p className="text-gray-600">{product.description}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i < Math.floor(product.rating || 4.5)
                              ? '⭐'
                              : '☆'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviews || 0} rəy)
                    </span>
                  </div>

                  {/* Price Section */}
                  <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-4 border-2 border-cyan-200">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl font-bold text-teal-600">
                        {formatPrice(product.finalPrice)}
                      </span>
                      {discount > 0 && (
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    {savings > 0 && (
                      <p className="text-sm text-green-600 font-semibold">
                        ✨ {formatPrice(savings)} qənaət edin
                      </p>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className={`p-3 rounded-lg font-semibold text-center ${
                    product.stock > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {product.stock > 0 ? (
                      <>✅ Stokda var ({product.stock} ədəd)</>
                    ) : (
                      <>❌ Stokda yoxdur</>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-800">Miqdar:</span>
                    <div className="flex items-center border-2 border-teal-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-teal-600 hover:bg-teal-50 font-bold"
                      >
                        −
                      </button>
                      <span className="px-6 py-2 font-bold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-4 py-2 text-teal-600 hover:bg-teal-50 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAdded}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-6 text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isAdded ? (
                      <>✅ Sepetin əlavə edildi!</>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Sepetin əlavə et
                      </>
                    )}
                  </Button>

                  {/* Product Attributes */}
                  <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                    {product.ageGroups && product.ageGroups.length > 0 && (
                      <div>
                        <span className="font-semibold text-gray-800">👶 Yaş:</span>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {product.ageGroups.map(age => (
                            <span
                              key={age}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold"
                            >
                              {age}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.materials && product.materials.length > 0 && (
                      <div>
                        <span className="font-semibold text-gray-800">🧵 Material:</span>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {product.materials.map(material => (
                            <span
                              key={material}
                              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold"
                            >
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.size && product.size.length > 0 && (
                      <div>
                        <span className="font-semibold text-gray-800">📏 Beden:</span>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {product.size.map(size => (
                            <span
                              key={size}
                              className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.colors && product.colors.length > 0 && (
                      <div>
                        <span className="font-semibold text-gray-800">🎨 Rəng:</span>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {product.colors.map(color => (
                            <span
                              key={color}
                              className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold"
                            >
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shipping & Returns */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-gray-200">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-700">Pulsuz çatdırılma</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <RotateCcw className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">30 gün geri</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

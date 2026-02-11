'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProduct } from '@/hooks/use-products'
import { useCart } from '@/lib/cart-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Share2, 
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  AlertCircle
} from 'lucide-react'
import Image from 'next/image'
import { ProductImage } from '@/components/product-image'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = parseInt(params.id as string)
  const { product, isLoading, error } = useProduct(productId)
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ürün yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Ürün Bulunamadı</h2>
            <p className="text-muted-foreground mb-6">
              {error || 'İstediğiniz ürün bulunamadı'}
            </p>
            <Button
              onClick={() => router.push('/')}
              className="w-full bg-primary text-white"
            >
              Ana Sayfaya Dön
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const discount = product.discountPercantage || 0
  const inStock = product.stock > 0
  const images = product.imageUrl ? [product.imageUrl] : []

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  const handleQuantityChange = (value: number) => {
    if (value > 0 && value <= product.stock) {
      setQuantity(value)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Geri Dön
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <Card className="relative bg-gradient-to-br from-purple-100 to-pink-100 h-96 flex items-center justify-center overflow-hidden">
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center text-lg shadow-lg z-10">
                    -{Math.round(discount)}%
                  </div>
                )}

                {/* Stock Status Badge */}
                {!inStock && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                    <span className="bg-gray-700 text-white px-6 py-3 rounded-full font-bold text-lg">
                      Stokta Yok
                    </span>
                  </div>
                )}

                {/* Image */}
                <ProductImage
                  imageUrl={product.imageUrl}
                  alt={product.name}
                  fill
                  className="w-full h-full"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />

                {/* Favorite Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 left-4 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition z-10"
                >
                  <Heart
                    className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </button>

                {/* Share Button */}
                <button className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition z-10">
                  <Share2 className="w-6 h-6 text-gray-600" />
                </button>
              </Card>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 ${
                        activeImageIndex === idx ? 'border-primary' : 'border-gray-300'
                      }`}
                    >
                      <ProductImage
                        imageUrl={img}
                        alt={`${product.name} ${idx}`}
                        className="w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title and Category */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  📦 {product.categoryName}
                </p>
                <h1 className="text-4xl font-bold text-foreground mb-3">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {product.description}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 py-4 border-y">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 4.5)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews || 0} değerlendirme)
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2 py-4 border-b">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">
                    {product.finalPrice.toFixed(2)}₼
                  </span>
                  {discount > 0 && (
                    <span className="text-2xl text-gray-400 line-through">
                      {product.price.toFixed(2)}₼
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-green-600 font-semibold">
                    Sizə {(product.price - product.finalPrice).toFixed(2)}₼ ekonomiya!
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className={`p-3 rounded-lg ${inStock ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`font-semibold ${inStock ? 'text-green-700' : 'text-red-700'}`}>
                  {inStock ? (
                    <>✓ Stokda Var ({product.stock} ürün)</>
                  ) : (
                    <>✗ Stokta Yok</>
                  )}
                </p>
              </div>

              {/* Quantity Selector */}
              {inStock && (
                <div className="space-y-3 py-4 border-b">
                  <label className="block font-semibold text-foreground">
                    Miqdar
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      −
                    </button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={product.stock}
                      className="w-16 text-center"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                    <span className="text-sm text-muted-foreground ml-auto">
                      Ən çox {product.stock} ədəd
                    </span>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-7 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-6 h-6 mr-2" />
                Sepete Əlavə Et
              </Button>

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y">
                <div className="text-center">
                  <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold">Sürətli Çatdırılma</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold">Təhlükəsiz Ödəniş</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold">30 Gün Geri Qaytarma</p>
                </div>
              </div>

              {/* Product Details */}
              <Card className="p-6 space-y-4">
                <h3 className="font-bold text-lg">Məhsul Təfərrüatları</h3>
                
                {product.ageGroups && product.ageGroups.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground mb-2">Yaş Qrupu</p>
                    <div className="flex flex-wrap gap-2">
                      {product.ageGroups.map((age, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {age}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.materials && product.materials.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground mb-2">Materiallar</p>
                    <div className="flex flex-wrap gap-2">
                      {product.materials.map((material, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.size && product.size.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground mb-2">Ölçü</p>
                    <div className="flex flex-wrap gap-2">
                      {product.size.map((size, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors && product.colors.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground mb-2">Rənglər</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Məhsul Kodu</p>
                  <p className="font-mono font-semibold">#{product.id}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Elan Tarixi</p>
                  <p className="font-semibold">
                    {new Date(product.createdAt).toLocaleDateString('az-AZ')}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

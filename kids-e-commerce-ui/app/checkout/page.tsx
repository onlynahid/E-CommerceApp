'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useOrders } from '@/hooks/use-orders'
import { validateCheckoutForm, hasErrors } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductImage } from '@/components/product-image'
import { Trash2, Plus, Minus, AlertCircle, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart()
  const { createOrder, isLoading: orderLoading } = useOrders()
  
  const [step, setStep] = useState<'cart' | 'checkout'>('cart')
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-primary mb-4 animate-bounce">
              ✅ Sifariş Gönderildi
            </h1>
            <p className="text-xl text-gray-600 mb-8">Sifarişiniz uğurla qəbul edildi</p>
            <Button
              onClick={() => router.push('/')}
              size="lg"
              className="bg-primary text-white font-bold px-8 py-6"
            >
              Əsas Səhifəyə Qayıt
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md p-8 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-4">Sepetiniz Boş</h2>
            <p className="text-muted-foreground mb-6">
              Henüz hiçbir ürün eklemediniz
            </p>
            <Button
              onClick={() => router.push('/')}
              className="w-full bg-primary text-white"
            >
              Alışverişe Devam Et
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validateCheckoutForm(
      formData.fullName,
      formData.email,
      formData.phoneNumber,
      formData.address
    )
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    try {
      setSubmitError(null)
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
      }))

      await createOrder({
        ...formData,
        orderItems,
      })

      clearCart()
      setOrderSuccess(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Sipariş oluşturma başarısız')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Sepetim</h1>
            <p className="text-muted-foreground">
              {items.length} ürün
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 pb-6 border-b last:border-b-0 last:pb-0"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <ProductImage
                        imageUrl={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.product.name}</h3>
                      <p className="text-primary font-semibold">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-semibold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <p className="text-sm text-muted-foreground">
                        Toplam: {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Order Summary & Checkout */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Sipariş Özeti</h2>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{submitError}</span>
                  </div>
                )}

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ara Toplam:</span>
                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kargo:</span>
                    <span className="font-semibold">Ücretsiz</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam:</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                {step === 'cart' ? (
                  <Button
                    onClick={() => setStep('checkout')}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-6 rounded-full"
                  >
                    Ödeme Sayfasına Git
                  </Button>
                ) : (
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Ad Soyad
                      </label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={errors.fullName ? 'border-red-500' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        E-posta
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Telefon
                      </label>
                      <Input
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+994501234567"
                        className={errors.phoneNumber ? 'border-red-500' : ''}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Adres
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Şehir, Mahalle, Sokak..."
                        className={`w-full px-3 py-2 border rounded-lg outline-none focus:border-primary ${
                          errors.address ? 'border-red-500' : ''
                        }`}
                        rows={3}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Notlar (İsteğe bağlı)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Teslimat notları..."
                        className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary"
                        rows={2}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={orderLoading}
                      className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-6 rounded-full"
                    >
                      {orderLoading ? 'İşleniyor...' : 'Siparişi Tamamla'}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => setStep('cart')}
                      variant="outline"
                      className="w-full"
                    >
                      Geri Dön
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

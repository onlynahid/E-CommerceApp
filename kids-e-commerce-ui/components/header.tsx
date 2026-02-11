'use client'

import { ShoppingCart, Search, Heart, User, Menu, X, Trash2, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { totalItems, items, removeItem, updateQuantity, totalPrice } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleCheckout = () => {
    setIsCartOpen(false)
    router.push('/checkout')
  }

  return (
    <header className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg flex items-center gap-1">
              🎈 AY & YU
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/products" className="text-white hover:text-cyan-100 font-semibold transition">
              Məhsullar
            </a>
            <a href="/#categories" className="text-white hover:text-cyan-100 font-semibold transition">
              Kateqoriyalar
            </a>
            <a href="/?discount=true" className="text-white hover:text-cyan-100 font-semibold transition">
              İndirimler
            </a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs">
            <div className="flex items-center bg-white rounded-full px-4 py-2 gap-2">
              <Search className="w-4 h-4 text-teal-600" />
              <input
                type="text"
                placeholder="Axtarış..."
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          {/* Social Icons */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="text-white hover:text-cyan-100 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-white hover:text-cyan-100 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
              </svg>
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Heart className="w-5 h-5" />
            </Button>
            {user ? (
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <User className="w-5 h-5" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-foreground rounded-lg shadow-lg hidden group-hover:block">
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  {user.isAdmin && (
                    <a href="/admin" className="block px-4 py-2 hover:bg-gray-100">
                      Admin Panel
                    </a>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => router.push('/auth/login')}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <User className="w-5 h-5" />
              </Button>
            )}
            <Button
              onClick={() => setIsCartOpen(!isCartOpen)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 pb-4">
            <a href="/products" className="block text-white hover:bg-white/10 px-4 py-2 rounded-lg transition">
              Məhsullar
            </a>
            <a href="/#categories" className="block text-white hover:bg-white/10 px-4 py-2 rounded-lg transition">
              Kateqoriyalar
            </a>
            <a href="/?discount=true" className="block text-white hover:bg-white/10 px-4 py-2 rounded-lg transition">
              İndirimler
            </a>
            <div className="flex items-center bg-white rounded-full px-4 py-2 gap-2 mt-4">
              <Search className="w-5 h-5 text-teal-600" />
              <input
                type="text"
                placeholder="Axtarış..."
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </nav>
        )}
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 mt-20"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Cart Panel */}
          <div className="fixed right-0 top-20 w-full md:w-96 bg-white rounded-b-xl shadow-2xl z-50 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Sepetim</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">Sepetiniz boş</p>
                  <p className="text-sm text-muted-foreground mt-2">Alışverişe başlamak için ürün ekleyin</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-3 pb-4 border-b last:border-b-0 last:pb-0"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">🛍️</span>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{item.product.name}</h3>
                          <p className="text-teal-600 font-bold text-sm">
                            {formatPrice(item.product.price)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1 border rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="p-1 hover:bg-gray-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-semibold text-xs min-w-[1.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="p-1 hover:bg-gray-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ara Toplam:</span>
                      <span className="font-semibold">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kargo:</span>
                      <span className="font-semibold text-green-600">Ücretsiz</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-3 border-t">
                      <span>Toplam:</span>
                      <span className="text-teal-600">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    className="w-full mt-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold py-3 rounded-lg"
                  >
                    Ödemeye Git
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  )
}

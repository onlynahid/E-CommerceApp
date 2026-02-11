'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adminAuthApi } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LogOut, Menu, X, Home, Package, ShoppingCart, Layers, Settings as SettingsIcon } from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Get current user from localStorage if exists
    const user = adminAuthApi.getCurrentUser()
    setCurrentUser(user)
  }, [])

  const handleLogout = () => {
    adminAuthApi.logout()
    router.push('/admin/login')
  }

  const menuItems = [
    { href: '/admin', label: '📊 Dashboard', icon: Home },
    { href: '/admin/products', label: '📦 Məhsullar', icon: Package },
    { href: '/admin/orders', label: '🛒 Sifarişlər', icon: ShoppingCart },
    { href: '/admin/categories', label: '📂 Kategoriyalar', icon: Layers },
    { href: '/admin/settings', label: '⚙️ Ayarlar', icon: SettingsIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-primary text-white rounded-lg shadow-lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-40 shadow-lg`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
            👨‍💼 Admin
          </h1>
          <p className="text-sm text-muted-foreground">Mərkəzi İdarə Paneli</p>
        </div>

        {/* User Info */}
        {currentUser && (
          <div className="p-4 mx-3 mt-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">Daxil olan:</p>
            <p className="text-sm font-bold text-gray-800 truncate">{currentUser.email}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
              ✓ Admin
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary/10 text-gray-700 hover:text-primary font-semibold transition flex items-center gap-2 active:bg-primary/20"
              >
                <span>{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          {currentUser && (
            <Button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              <LogOut className="w-4 h-4" />
              Çıxış
            </Button>
          )}
          <p className="text-xs text-muted-foreground text-center">
            v1.0.0
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

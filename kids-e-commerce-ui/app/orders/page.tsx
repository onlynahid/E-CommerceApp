'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-7xl mb-6">📦</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Sifariş Gönderildi
          </h1>
        </div>
      </main>

      <Footer />
    </div>
  )
}

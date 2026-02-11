'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Mail } from 'lucide-react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20">✉️</div>
      <div className="absolute bottom-10 right-10 text-5xl opacity-15">📬</div>
      <div className="absolute top-1/2 right-20 text-4xl opacity-25 transform -rotate-45">⭐</div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-6">
          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Xəbərlərə Abunə Ol
            </h2>
            <p className="text-xl text-white/90">
              Yeni məhsullar, endirimler və xüsusi təkliflər haqqında ilk bilən olun
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-600" />
              <Input
                type="email"
                placeholder="E-poçtunuzu daxil edin..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 py-6 rounded-full border-0 text-lg"
              />
            </div>
            <Button
              type="submit"
              className="bg-white text-teal-600 hover:bg-cyan-50 font-bold px-8 py-6 rounded-full text-lg"
            >
              Abunə Ol
            </Button>
          </form>

          {/* Success Message */}
          {isSubscribed && (
            <div className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/30 inline-block">
              ✅ Abunəliyiniz qəbul edildi!
            </div>
          )}

          {/* Info text */}
          <p className="text-white/80 text-sm">
            Sizin e-poçtunuz təhlükəsiz saxlanılır. Heç vaxt spam göndərməyəcəyik.
          </p>
        </div>
      </div>
    </section>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useHero } from '@/hooks/use-hero'
import { ProductImage } from './product-image'

export function Hero() {
  const { heroes, isLoading, error } = useHero()

  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 overflow-hidden pt-16 pb-32 h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (error || !heroes || heroes.length === 0) {
    return null
  }

  // Birinci hero-nu göstər (ilk element)
  const hero = heroes[0]

  return (
    <div className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 overflow-hidden pt-16 pb-32">
      {/* Decorative stars */}
      <div className="absolute top-20 left-12 text-5xl opacity-40 transform -rotate-12">⭐</div>
      <div className="absolute top-40 right-32 text-4xl opacity-30 transform rotate-45">⭐</div>
      <div className="absolute bottom-40 left-20 text-3xl opacity-25 transform -rotate-45">⭐</div>

      {/* Sparkles */}
      <div className="absolute top-32 right-20 text-2xl opacity-50">✨</div>
      <div className="absolute bottom-32 right-40 text-2xl opacity-40">✨</div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 w-fit">
              <span className="text-sm font-bold">🎁 Xüsusi Təklif</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                {hero.title}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-lg text-white/90 max-w-md leading-relaxed">
              {hero.description}
            </p>

            {/* CTA Button */}
            <div>
              <Button className="bg-white text-teal-700 hover:bg-cyan-50 font-bold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                {hero.orderMessage}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right - Cloud Image Container */}
          <div className="relative h-96 lg:h-96 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Cloud background shapes */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Outer cloud shape */}
                <div className="absolute w-80 h-72 bg-white rounded-full blur-sm opacity-30" />
                
                {/* Main cloud container with border */}
                <div className="relative w-72 h-72 bg-white rounded-full shadow-2xl overflow-hidden border-8 border-white flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-teal-50 flex items-center justify-center">
                    <ProductImage
                      imageUrl={hero.imageUrl}
                      alt={hero.title}
                      className="w-full h-full object-cover"
                      fill={false}
                    />
                  </div>
                </div>
              </div>

              {/* Discount Badge */}
              {hero.discountMessage && (
                <div className="absolute -top-4 -right-4 z-20">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-white transform rotate-12">
                    <span className="text-white font-black text-sm">Endirim</span>
                    <span className="text-white font-black text-2xl">{hero.discountMessage}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Curved Wave Shape at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 lg:h-40">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-full"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="wave-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
          <path
            d="M0,40 Q300,80 600,40 T1200,40 L1200,120 L0,120 Z"
            fill="white"
            filter="url(#wave-shadow)"
          />
          {/* Subtle secondary wave for depth */}
          <path
            d="M0,50 Q300,90 600,50 T1200,50 L1200,120 L0,120 Z"
            fill="white"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  )
}

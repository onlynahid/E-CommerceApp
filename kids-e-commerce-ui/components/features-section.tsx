'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: '✅',
      title: 'Yüksək Keyfiyyət',
      description: 'Bütün məhsullar sertifikatlaşdırılıb və təhlükəsizdir',
    },
    {
      icon: '🚚',
      title: 'Sürətli Çatdırılma',
      description: '1-2 gün ərzində Bakıya çatdırılma',
    },
    {
      icon: '💳',
      title: 'Təhlükəsiz Ödəniş',
      description: 'Bütün ödəniş üsulları qəbul olunur',
    },
    {
      icon: '🔄',
      title: 'Qaytarma Qrantiyası',
      description: '30 gün içində qaytarma imkanı',
    },
  ]

  return (
    <>
      {/* Comfort Section with Yellow Background */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-100 relative overflow-hidden">
        {/* Decorative elements - positioned like in the image */}
        <div className="absolute top-5 right-20 text-8xl opacity-40 transform rotate-12 drop-shadow-lg">🌈</div>
        <div className="absolute bottom-10 left-5 text-7xl opacity-30 transform -rotate-45">🌼</div>
        <div className="absolute top-32 right-5 text-6xl opacity-20">☁️</div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text Content */}
            <div className="space-y-6 z-10">
              <div className="space-y-2">
                <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Balacaqlar Üçün
                </h2>
                <h3 className="text-4xl lg:text-5xl font-bold text-amber-600">
                  Rahatlıq və Xoşbəxtlik
                </h3>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed max-w-lg font-medium">
                Biz bilirik ki, uşaqlar üçün ən yaxşısı istəyirsiz. Buna görə də hər məhsul 
                ehtiyatla seçilir, sınaqdan keçirilir və sevgi ilə təqdim olunur.
              </p>

              <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold px-8 py-6 rounded-full text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all">
                Daha Çox Öyrən
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Right - Toys Display Grid */}
            <div className="relative h-96 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Floating toys arrangement */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Left toy - Teddy Bear */}
                  <div className="absolute left-0 top-1/4 text-9xl transform -rotate-12 hover:scale-110 transition-transform duration-300 drop-shadow-xl">
                    🧸
                  </div>

                  {/* Center toy - Paint Palette */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 text-9xl hover:scale-110 transition-transform duration-300 drop-shadow-xl">
                    🎨
                  </div>

                  {/* Right toy - Balloon */}
                  <div className="absolute right-0 top-1/2 transform translate-y-8 text-9xl hover:scale-110 transition-transform duration-300 drop-shadow-xl animate-bounce">
                    🎈
                  </div>

                  {/* Bottom - Circus Tent */}
                  <div className="absolute bottom-0 right-1/4 text-8xl transform rotate-6 hover:scale-110 transition-transform duration-300 drop-shadow-xl">
                    🎪
                  </div>

                  {/* Bottom left - Happy face */}
                  <div className="absolute bottom-5 left-1/4 text-8xl transform -rotate-12 hover:scale-110 transition-transform duration-300 drop-shadow-xl">
                    😊
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20">
          <svg
            viewBox="0 0 1200 60"
            className="w-full h-full"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,30 Q300,60 600,30 T1200,30 L1200,60 L0,60 Z"
              fill="white"
              opacity="0.8"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Nə üçün biz?</h2>
            <p className="text-gray-600 text-lg font-medium">Valideyinlərin səkkindən başla</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-3xl border-3 border-teal-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-teal-300"
              >
                <div className="text-6xl mb-4 transform hover:scale-125 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

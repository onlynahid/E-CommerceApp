'use client'

import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react'
import { useSettingsContext } from '@/lib/settings-context'

export function Footer() {
  const { settings, socialLinks, isLoading } = useSettingsContext()

  const defaultSettings = {
    name: 'Ayyu Kids',
    phoneNumber: '+994 (50) 555-0123',
    email: 'info@ayyukids.com',
    address: 'Bakı, Azərbaycan',
  }

  const currentSettings = settings || defaultSettings
  const currentSocialLinks = socialLinks || {
    facebook: '',
    instagram: '',
    twitter: '',
  }

  return (
    <footer className="bg-gradient-to-b from-teal-700 to-teal-900 text-white py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-5xl opacity-30 animate-pulse">🎈</div>
      <div className="absolute bottom-20 right-20 text-4xl opacity-20 animate-bounce">⭐</div>
      <div className="absolute top-1/2 left-20 text-3xl opacity-15">🎁</div>

      {/* Wave decoration at top */}
      <div className="absolute top-0 left-0 right-0 -mt-1">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 Q300,0 600,50 T1200,50 L1200,0 L0,0 Z"
            fill="white"
            opacity="0.1"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-4xl">🎈</span>
              <h3 className="text-3xl font-bold">
                {currentSettings.name}
              </h3>
            </div>
            <p className="text-teal-100 text-base leading-relaxed">
              Uşaqları xoşbəxt etmək bizim missiyamız. Hər məhsul sevgi, diqqət və keyfiyyətlə seçilir.
            </p>
            <div className="flex gap-4 pt-4">
              {currentSocialLinks.facebook && (
                <a 
                  href={currentSocialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-600 hover:bg-cyan-500 p-3 rounded-full transition-all transform hover:scale-110 hover:shadow-lg"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {currentSocialLinks.instagram && (
                <a 
                  href={currentSocialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-600 hover:bg-cyan-500 p-3 rounded-full transition-all transform hover:scale-110 hover:shadow-lg"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {currentSocialLinks.twitter && (
                <a 
                  href={currentSocialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-600 hover:bg-cyan-500 p-3 rounded-full transition-all transform hover:scale-110 hover:shadow-lg"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-cyan-100 uppercase tracking-wider">Tez Bağlantılar</h4>
            <ul className="space-y-3 text-teal-100">
              <li>
                <a href="/" className="hover:text-cyan-300 transition-colors font-medium">
                  Əsas Səhifə
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-cyan-300 transition-colors font-medium">
                  Məhsullar
                </a>
              </li>
              <li>
                <a href="/?discount=true" className="hover:text-cyan-300 transition-colors font-medium">
                  İndirimler
                </a>
              </li>
              <li>
                <a href="/orders" className="hover:text-cyan-300 transition-colors font-medium">
                  Sifarişlərim
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-cyan-100 uppercase tracking-wider">Dəstək</h4>
            <ul className="space-y-3 text-teal-100">
              <li>
                <a href="#" className="hover:text-cyan-300 transition-colors font-medium">
                  Əlaqə
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-300 transition-colors font-medium">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-300 transition-colors font-medium">
                  Gizlilik
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-300 transition-colors font-medium">
                  Şərtlər
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-teal-600 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h5 className="text-sm font-bold text-cyan-200 uppercase tracking-wider mb-4">📞 Əlaqə Məlumatı</h5>
              <div className="space-y-3">
                {currentSettings.phoneNumber && (
                  <div className="flex items-center gap-3 text-teal-100 hover:text-cyan-300 transition-colors">
                    <Phone className="w-5 h-5 text-cyan-300 flex-shrink-0" />
                    <a href={`tel:${currentSettings.phoneNumber}`} className="font-medium">
                      {currentSettings.phoneNumber}
                    </a>
                  </div>
                )}
                {currentSettings.email && (
                  <div className="flex items-center gap-3 text-teal-100 hover:text-cyan-300 transition-colors">
                    <Mail className="w-5 h-5 text-cyan-300 flex-shrink-0" />
                    <a href={`mailto:${currentSettings.email}`} className="font-medium">
                      {currentSettings.email}
                    </a>
                  </div>
                )}
                {currentSettings.address && (
                  <div className="flex items-start gap-3 text-teal-100">
                    <MapPin className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-1" />
                    <span className="font-medium">{currentSettings.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h5 className="text-sm font-bold text-cyan-200 uppercase tracking-wider mb-4">📧 Xəbərlərə Abunə Ol</h5>
              <p className="text-teal-100 text-sm">Yeni məhsullar və endirimlərdən ilk xəbər alın</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="E-poçtunuz..."
                  className="flex-1 px-4 py-3 rounded-full text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <button className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105">
                  ✉️
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-teal-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-teal-100 text-sm font-medium">
              © 2024 {currentSettings.name}. Bütün hüquqlar qorunur.
            </p>
            <div className="flex items-center gap-1 text-teal-100 text-sm">
              Made with
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              for kids
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

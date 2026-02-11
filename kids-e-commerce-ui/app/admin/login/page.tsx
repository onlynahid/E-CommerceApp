'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminAuthApi } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Mail, Lock, AlertCircle, Loader2, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: 'Admin045@gmail.com', password: 'admin123' })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
    if (successMessage) setSuccessMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    // Validate form
    if (!formData.email || !formData.password) {
      setError('E-mail və şifrə məcburi deyildir')
      setIsLoading(false)
      return
    }

    if (!formData.email.includes('@')) {
      setError('Zəhmət olmasa geçərli bir e-mail adresi daxil edin')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Şifrə ən azı 6 simvol olmalıdır')
      setIsLoading(false)
      return
    }

    try {
      const response = await adminAuthApi.login({
        email: formData.email,
        password: formData.password,
      })

      if (!response.success) {
        setError(response.message || 'Admin girişi uğursuz oldu')
        setIsLoading(false)
        return
      }

      // Check if user is admin
      if (!response.user.isAdmin) {
        setError('Bu hesab admin əsasında deyildir')
        adminAuthApi.logout()
        setIsLoading(false)
        return
      }

      // Successful login
      setSuccessMessage(`✓ Xoş gəldiniz, ${response.user.username}! Admin Panelinə yönləndirilirsiniz...`)
      
      setTimeout(() => {
        router.push('/admin')
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bir xəta baş verdi. Zəhmət olmasa yenidən cəhd edin'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-primary/20 to-secondary/20 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -ml-48 -mb-48" />

      {/* Main Card */}
      <Card className="w-full max-w-md p-8 shadow-2xl backdrop-blur-sm border-2 border-primary/20 relative z-10">
        {/* Admin Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-full shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            👨‍💼 Admin Paneli
          </h1>
          <p className="text-muted-foreground text-sm">Yalnız admin istifadəçiləri üçün</p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3 animate-pulse">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              📧 E-mail Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-4 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="pl-10 h-12 border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              🔐 Şifrə
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-4 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="pl-10 h-12 border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-6 rounded-full text-base hover:shadow-lg transition mt-6 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Giriş yapılıyor...
              </>
            ) : (
              <>
                🚀 Admin Panelinə Daxil Ol
              </>
            )}
          </Button>
        </form>

        {/* Test Credentials Info */}
        <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <p className="text-xs font-bold text-blue-800 mb-3">📝 Admin Giriş Məlumatları:</p>
          <div className="space-y-2 bg-white p-3 rounded border border-blue-100">
            <div>
              <p className="text-xs text-blue-600 font-semibold">E-mail:</p>
              <p className="text-sm font-mono text-blue-900 break-all">Admin045@gmail.com</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-semibold">Şifrə:</p>
              <p className="text-sm font-mono text-blue-900">admin123</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-semibold">İstifadəçi Adı:</p>
              <p className="text-sm font-mono text-blue-900">Admin045</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-semibold">Rol:</p>
              <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="text-xs text-green-800 mb-2">✓ Backend Bağlantısı</p>
          <p className="text-xs text-green-700">
            <strong>URL:</strong> https://localhost:7038/api/AdminAuth/login
          </p>
          <p className="text-xs text-green-700 mt-1">
            <strong>Status:</strong> Aktiv ✓
          </p>
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <p className="text-xs text-yellow-800">
            <strong>⚠️ Xəbərdarlıq:</strong> Bu səhifə yalnız administrator istifadəçiləri üçün nəzərdə tutulmuşdur.
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-primary font-semibold hover:text-secondary transition text-sm"
          >
            ← Ana səhifəyə qayıt
          </a>
        </div>
      </Card>
    </div>
  )
}

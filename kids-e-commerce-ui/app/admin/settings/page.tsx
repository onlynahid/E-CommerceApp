'use client'

import { useState } from 'react'
import { useSettingsContext } from '@/lib/settings-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Save, AlertCircle, CheckCircle, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import { Alert } from '@/components/ui/alert'

/**
 * Settings Management Page
 * Admin interface to manage site configuration, contact info, and social media links
 */
export default function SettingsPage() {
  const { settings, socialLinks, isLoading, error, updateSettings, updateSocialLinks } = useSettingsContext()
  
  // Form states
  const [formData, setFormData] = useState({
    name: settings?.name || '',
    phoneNumber: settings?.phoneNumber || '',
    address: settings?.address || '',
    email: settings?.email || '',
  })

  const [socialFormData, setSocialFormData] = useState({
    facebook: socialLinks?.facebook || '',
    instagram: socialLinks?.instagram || '',
    twitter: socialLinks?.twitter || '',
  })

  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [socialLoading, setSocialLoading] = useState(false)
  const [socialError, setSocialError] = useState<string | null>(null)
  const [socialSuccess, setSocialSuccess] = useState(false)

  // Update form data when settings load
  React.useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        phoneNumber: settings.phoneNumber || '',
        address: settings.address || '',
        email: settings.email || '',
      })
    }
  }, [settings])

  React.useEffect(() => {
    if (socialLinks) {
      setSocialFormData({
        facebook: socialLinks.facebook || '',
        instagram: socialLinks.instagram || '',
        twitter: socialLinks.twitter || '',
      })
    }
  }, [socialLinks])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      await updateSettings(formData as any)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Ayarları kaydetme başarısız')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleSaveSocialLinks = async (e: React.FormEvent) => {
    e.preventDefault()
    setSocialLoading(true)
    setSocialError(null)
    setSocialSuccess(false)

    try {
      await updateSocialLinks(socialFormData)
      setSocialSuccess(true)
      setTimeout(() => setSocialSuccess(false), 3000)
    } catch (err) {
      setSocialError(err instanceof Error ? err.message : 'Sosyal medya bağlantılarını kaydetme başarısız')
    } finally {
      setSocialLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Ayarlar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">⚙️ Site Ayarları</h1>
          <p className="text-muted-foreground text-lg">
            Web sitenizin genel ayarlarını, iletişim bilgilerini ve sosyal medya bağlantılarını yönetin
          </p>
        </div>

        {/* Global Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <div className="ml-3">
              <p className="text-red-800 font-semibold">Hata</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </Alert>
        )}

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Site Information Card */}
          <Card className="p-6 border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🏪</div>
              <div>
                <h3 className="font-bold text-lg">Site Adı</h3>
                <p className="text-sm text-muted-foreground">{formData.name || 'Belirlenmemiş'}</p>
              </div>
            </div>
          </Card>

          {/* Phone Card */}
          <Card className="p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-bold text-lg">Telefon</h3>
                <p className="text-sm text-muted-foreground break-all">{formData.phoneNumber || 'Belirlenmemiş'}</p>
              </div>
            </div>
          </Card>

          {/* Email Card */}
          <Card className="p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-bold text-lg">E-posta</h3>
                <p className="text-sm text-muted-foreground break-all">{formData.email || 'Belirlenmemiş'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Settings Form */}
        <Card className="p-8 mb-8 border-2 border-gray-200 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span>📝</span> Site Bilgileri
            </h2>
            <p className="text-muted-foreground mt-1">Site adı, iletişim bilgileri ve adresi güncelleyin</p>
          </div>

          {saveSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="ml-3">
                <p className="text-green-800 font-semibold">Başarılı</p>
                <p className="text-green-700 text-sm">Ayarlar başarıyla kaydedildi</p>
              </div>
            </Alert>
          )}

          {saveError && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div className="ml-3">
                <p className="text-red-800 font-semibold">Hata</p>
                <p className="text-red-700 text-sm">{saveError}</p>
              </div>
            </Alert>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Site Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Site Adı <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Örn:AYYUAZ"
                required
                className="h-12 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Web sitesinin adı, tüm sayfalarda ve sosyal medyada görüntülenecektir
              </p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-base font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4" /> Telefon Numarası
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleFormChange}
                placeholder="Örn: +90 (212) 555-0123"
                className="h-12 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Müşterilerin sizi arayabileceği telefon numarası
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" /> E-posta Adresi
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Örn: info@playkids.com"
                className="h-12 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Müşteri iletişimi için geçerli bir e-posta adresi
              </p>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-base font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Adres
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Örn: İstanbul, Türkiye"
                className="h-12 text-base"
              />
              <p className="text-sm text-muted-foreground">
                İşletmenizin fiziksel adresi
              </p>
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                disabled={saveLoading}
                className="flex-1 h-12 text-base font-semibold flex items-center justify-center gap-2"
              >
                {saveLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Ayarları Kaydet
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Social Media Links Form */}
        <Card className="p-8 border-2 border-gray-200 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span>📱</span> Sosyal Medya Bağlantıları
            </h2>
            <p className="text-muted-foreground mt-1">
              Sosyal medya profillerinizin bağlantılarını ekleyin
            </p>
          </div>

          {socialSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="ml-3">
                <p className="text-green-800 font-semibold">Başarılı</p>
                <p className="text-green-700 text-sm">Sosyal medya bağlantıları başarıyla güncellendi</p>
              </div>
            </Alert>
          )}

          {socialError && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div className="ml-3">
                <p className="text-red-800 font-semibold">Hata</p>
                <p className="text-red-700 text-sm">{socialError}</p>
              </div>
            </Alert>
          )}

          <form onSubmit={handleSaveSocialLinks} className="space-y-6">
            {/* Facebook */}
            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-base font-semibold flex items-center gap-2">
                <Facebook className="w-5 h-5 text-blue-600" /> Facebook Sayfası
              </Label>
              <Input
                id="facebook"
                name="facebook"
                type="url"
                value={socialFormData.facebook}
                onChange={handleSocialChange}
                placeholder="Örn: https://facebook.com/playkids"
                className="h-12 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Facebook sayfanızın tam URL'si
              </p>
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-base font-semibold flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-600" /> Instagram Profili
              </Label>
              <Input
                id="instagram"
                name="instagram"
                type="url"
                value={socialFormData.instagram}
                onChange={handleSocialChange}
                placeholder="Örn: https://instagram.com/playkids"
                className="h-12 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Instagram profilinizin tam URL'si
              </p>
            </div>

            {/* Twitter */}
            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-base font-semibold flex items-center gap-2">
                <Twitter className="w-5 h-5 text-sky-600" /> Twitter Profili
              </Label>
              <Input
                id="twitter"
                name="twitter"
                type="url"
                value={socialFormData.twitter}
                onChange={handleSocialChange}
                placeholder="Örn: https://twitter.com/playkids"
                className="h-12 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Twitter profilinizin tam URL'si
              </p>
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                disabled={socialLoading}
                className="flex-1 h-12 text-base font-semibold flex items-center justify-center gap-2"
              >
                {socialLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Sosyal Medya Bağlantılarını Kaydet
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Preview Section */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <h3 className="text-xl font-bold text-foreground mb-4">👁️ Önizleme</h3>
            <div className="flex gap-4">
              {socialFormData.facebook && (
                <a
                  href={socialFormData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                  title="Facebook'u ziyaret et"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {socialFormData.instagram && (
                <a
                  href={socialFormData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition"
                  title="Instagram'ı ziyaret et"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {socialFormData.twitter && (
                <a
                  href={socialFormData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 transition"
                  title="Twitter'ı ziyaret et"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
              {!socialFormData.facebook && !socialFormData.instagram && !socialFormData.twitter && (
                <p className="text-muted-foreground italic">
                  Sosyal medya bağlantılarını ekledikten sonra burada görüntülenecektir
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

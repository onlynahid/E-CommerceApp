'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { adminCategoriesApi } from '@/lib/api-client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertCircle, Loader2, Plus, Edit, Trash2, Search } from 'lucide-react'

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [filteredCategories, setFilteredCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [Image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    const filtered = categories.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCategories(filtered)
  }, [searchTerm, categories])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await adminCategoriesApi.getAll()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kategoriyalar yüklənə bilmədi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOpenDialog = (category?: any) => {
    if (category) {
      setSelectedCategory(category)
      setFormData({ name: category.name, description: category.description })
      setImagePreview(category.İmage)
      setImage(null)
    } else {
      setSelectedCategory(null)
      setFormData({ name: '', description: '' })
      setImagePreview(null)
      setImage(null)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedCategory(null)
    setFormData({ name: '', description: '' })
    setImage(null)
    setImagePreview(null)
  }

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      setError('Kategoriya adı boş ola bilməz')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)

      if (selectedCategory) {
        // Update existing category
        formDataToSend.append('id', selectedCategory.id.toString())
        
        // If no new image is provided, include the existing image URL
        if (!Image&& selectedCategory.İmage) {
          formDataToSend.append('İmage', selectedCategory.İmage)
        }
        
        if (Image) {
          formDataToSend.append('image', Image)
        }

        const updated = await adminCategoriesApi.update(selectedCategory.id, formDataToSend)
        setCategories(categories.map((c) => (c.id === updated.id ? updated : c)))
      } else {
        // Create new category
        if (Image) {
          formDataToSend.append('image', Image)
        }

        const created = await adminCategoriesApi.create(formDataToSend)
        setCategories([...categories, created])
      }

      handleCloseDialog()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kategoriya saxlanıla bilmədi')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu kategoriyanı silmək istəyirsiniz?')) return

    try {
      setIsDeleting(true)
      await adminCategoriesApi.delete(id)
      setCategories(categories.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kategoriya silinə bilmədi')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">📂 Kategoriyalar</h1>
            <p className="text-muted-foreground">Cəmi {categories.length} kategoriya</p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => handleOpenDialog()}
          >
            <Plus className="w-5 h-5" />
            Yeni Kategoriya Əlavə Et
          </Button>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Kategoriya adı və ya təsviri axtarın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent outline-none"
            />
          </div>
        </Card>

        {/* Error Alert */}
        {error && (
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Kategoriyalar yüklənir...</p>
          </Card>
        )}

        {/* Categories Grid */}
        {!isLoading && (
          <>
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <Card
                    key={category.id}
                    className="border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center overflow-hidden">
                      {category.İmage && category.İmage !== '/uploads/categories/default-category.jpg' ? (
                        <img
                          src={category.İmage}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <span className="text-6xl opacity-20">📦</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                        {category.description}
                      </p>

                      {/* Product Count */}
                      <div className="mb-4">
                        <span className="inline-block text-base font-bold text-magenta-600">
                          {category.productCount || 0} məhsul
                        </span>
                      </div>

                      {/* Action Buttons Bar */}
                      <div className="bg-yellow-50 rounded-lg p-3 flex items-center justify-between border border-yellow-100">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 font-semibold flex-1"
                          onClick={() => handleOpenDialog(category)}
                        >
                          <Edit className="w-4 h-4" />
                          Düzəlt
                        </Button>
                        <div className="w-px h-6 bg-yellow-200" />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold flex-1 flex items-center justify-center gap-2"
                          onClick={() => handleDelete(category.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground text-lg">
                  {searchTerm ? 'Axtarış nəticəsi tapılmadı' : 'Kategoriya yoxdur'}
                </p>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Category Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Kategoriyanı Düzəlt' : 'Yeni Kategoriya Əlavə Et'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Kategoriya Adı *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Kategoriya adını daxil edin..."
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Təsvir</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kategoriya təsvirini daxil edin..."
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Şəkil</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            {imagePreview && (
              <div className="mt-4">
                <label className="text-sm font-semibold text-muted-foreground">Şəkil Önizləməsi</label>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-full h-40 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSaving}
              >
                İptal Et
              </Button>
              <Button
                className="flex-1"
                onClick={handleSaveCategory}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saxlanılır...
                  </>
                ) : (
                  'Dəyişiklikləri Kaydet'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

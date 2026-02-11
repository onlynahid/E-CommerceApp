'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { adminProductsApi, adminAuthApi } from '@/lib/api-client'
import { ProductImage } from '@/components/product-image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertCircle, Loader2, Plus, Edit, Trash2, Search, Tag, AlertTriangle, Lock, Upload } from 'lucide-react'

export default function AdminProducts() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    discountPercentage: 0,
    ageGroups: [] as string[],
    materials: [] as string[],
    size: [] as string[],
    colors: [] as string[],
  })
  const [newAgeGroup, setNewAgeGroup] = useState('')
  const [newMaterial, setNewMaterial] = useState('')
  const [newSize, setNewSize] = useState('')
  const [newColor, setNewColor] = useState('')
  const [discountData, setDiscountData] = useState({
    productId: 0,
    discountPercentage: 0,
  })

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const user = adminAuthApi.getCurrentUser()
      const token = localStorage.getItem('token')
      
      if (user && token && user.isAdmin) {
        setIsAuthenticated(true)
      } else {
        // Redirect to login
        router.push('/admin/login')
      }
      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [router])

  // Load products only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
    }
  }, [isAuthenticated])

  useEffect(() => {
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm)
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await adminProductsApi.getAll()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Məhsullar yüklənə bilmədi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu məhsulu silmək istəyirsiniz?')) return

    try {
      setIsDeleting(true)
      await adminProductsApi.delete(id)
      setProducts(products.filter((p) => p.id !== id))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Məhsul silinə bilmədi')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditClick = (product: any) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      discountPercentage: product.discountPercantage || 0,
      ageGroups: product.ageGroups || [],
      materials: product.materials || [],
      size: product.size || [],
      colors: product.colors || [],
    })
    setImagePreview(product.imageUrl)
    setSelectedImage(null)
    setIsDialogOpen(true)
  }

  const handleAddDiscount = (product: any) => {
    setSelectedProduct(product)
    setDiscountData({
      productId: product.id,
      discountPercentage: product.discountPercantage || 0,
    })
    setIsDiscountDialogOpen(true)
  }

  const handleRemoveDiscount = async (productId: number) => {
    if (!window.confirm('Bu məhsuldan endirim silmək istəyirsiniz?')) return

    try {
      setIsSubmitting(true)
      await adminProductsApi.removeDiscount(productId)
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, discountPercantage: 0, finalPrice: p.price } : p
        )
      )
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Endirim silinə bilmədi')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (discountData.discountPercentage < 0 || discountData.discountPercentage > 100) {
      setError('Endirim faizi 0-100 arasında olmalıdır')
      return
    }

    try {
      setIsSubmitting(true)
      if (discountData.discountPercentage === 0) {
        await adminProductsApi.removeDiscount(discountData.productId)
      } else if (selectedProduct.discountPercantage > 0) {
        await adminProductsApi.updateDiscount(
          discountData.productId,
          discountData.discountPercentage
        )
      } else {
        await adminProductsApi.addDiscount(
          discountData.productId,
          discountData.discountPercentage
        )
      }

      // Refresh products
      await loadProducts()
      setIsDiscountDialogOpen(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Endirim əməliyyatı uğursuz oldu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name.trim()) {
      setError('Məhsul adı məcburi deyildir')
      return
    }

    if (formData.price <= 0) {
      setError('Qiymət 0-dan çox olmalıdır')
      return
    }

    if (formData.stock < 0) {
      setError('Stok mənfi rəqəm ola bilməz')
      return
    }

    if (formData.categoryId <= 0) {
      setError('Kateqoriya seçilməlidir')
      return
    }

    try {
      setIsSubmitting(true)

      // Create FormData for multipart request
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('stock', formData.stock.toString())
      formDataToSend.append('categoryId', formData.categoryId.toString())
      if (formData.discountPercentage > 0) {
        formDataToSend.append('discountPercentage', formData.discountPercentage.toString())
      }
      
      // Append arrays as JSON strings for proper .NET deserialization
      // The backend needs a custom JsonConverter to handle this
      if (formData.ageGroups.length > 0) {
        formDataToSend.append('ageGroups', JSON.stringify(formData.ageGroups))
      } else {
        formDataToSend.append('ageGroups', JSON.stringify([]))
      }
      
      if (formData.materials.length > 0) {
        formDataToSend.append('materials', JSON.stringify(formData.materials))
      } else {
        formDataToSend.append('materials', JSON.stringify([]))
      }
      
      if (formData.size.length > 0) {
        formDataToSend.append('size', JSON.stringify(formData.size))
      } else {
        formDataToSend.append('size', JSON.stringify([]))
      }
      
      if (formData.colors.length > 0) {
        formDataToSend.append('colors', JSON.stringify(formData.colors))
      } else {
        formDataToSend.append('colors', JSON.stringify([]))
      }

      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('Image', selectedImage)
      }

      if (selectedProduct) {
        // Update existing product
        await adminProductsApi.update(selectedProduct.id, formDataToSend)
      } else {
        // Create new product
        await adminProductsApi.create(formDataToSend)
      }

      // Refresh products list
      await loadProducts()
      setIsDialogOpen(false)
      setImagePreview(null)
      setSelectedImage(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Əməliyyat uğursuz oldu')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Yoxlanılır...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 border-2 border-red-200 bg-red-50">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Giriş Tələb Olunur</h2>
            <p className="text-red-700 mb-6">
              Bu səhifəyə daxil olmaq üçün admin olarak giriş etməlisiniz.
            </p>
            <Button
              onClick={() => router.push('/admin/login')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Admin Panelinə Daxil Ol
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">📦 Məhsullar İdarəsi</h1>
            <p className="text-muted-foreground">Cəmi {products.length} məhsul</p>
          </div>
          <Button
            onClick={() => {
              setSelectedProduct(null)
              setFormData({
                name: '',
                description: '',
                price: 0,
                stock: 0,
                categoryId: 0,
                discountPercentage: 0,
                ageGroups: [],
                materials: [],
                size: [],
                colors: [],
              })
              setImagePreview(null)
              setSelectedImage(null)
              setIsDialogOpen(true)
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Məhsul Əlavə Et
          </Button>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Məhsul adı, təsviri və ya ID axtarın..."
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
            <p className="text-muted-foreground">Məhsullar yüklənir...</p>
          </Card>
        )}

        {/* Products Table */}
        {!isLoading && (
          <Card className="border-2 border-gray-200 overflow-hidden">
            {filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Şəkil</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">ID</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Məhsul Adı</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Qiymət</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Endirim</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Son Qiymət</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Stok</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-700">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <ProductImage
                              imageUrl={product.imageUrl || ''}
                              alt={product.name}
                              className="w-full h-full"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">#{product.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-green-600">
                          {product.price?.toFixed(2)}₼
                        </td>
                        <td className="px-6 py-4">
                          {product.discountPercantage && product.discountPercantage > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                                -{product.discountPercantage}%
                              </span>
                              <button
                                onClick={() => handleRemoveDiscount(product.id)}
                                className="text-red-600 hover:text-red-800 text-xs font-bold"
                                title="Endirim sil"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-blue-600">
                          {product.finalPrice?.toFixed(2)}₼
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              product.stock > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="w-4 h-4" />
                            Düzəlt
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => handleAddDiscount(product)}
                            title="Endirim əlavə et/düzəlt"
                          >
                            <Tag className="w-4 h-4" />
                            Endirim
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                            onClick={() => handleDelete(product.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchTerm ? 'Axtarış nəticəsi tapılmadı' : 'Məhsul yoxdur'}
                </p>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Məhsulu Düzəlt' : 'Yeni Məhsul Əlavə Et'}
            </DialogTitle>
            <DialogDescription>
              Məhsul məlumatlarını daxil edin və ya düzəldin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition">
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <ProductImage
                      imageUrl={imagePreview}
                      alt={formData.name || 'Məhsul şəkili'}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePreview(null)
                        setSelectedImage(null)
                      }}
                    >
                      Təmizlə
                    </Button>
                    <label className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <span>Dəyiş</span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="font-semibold text-gray-700">Şəkil seçin və ya buraya sürükləyin</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF (max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Məhsul Adı</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Məhsul adını daxil edin..."
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Kateqoriya ID</label>
                <Input
                  type="number"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: parseInt(e.target.value) || 0 })
                  }
                  placeholder="Kateqoriya ID"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-muted-foreground">Təsvir</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Məhsul təsvirini daxil edin..."
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Qiymət</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Stok</label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Endirim %</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-muted-foreground">Yaş Qrupları</label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newAgeGroup}
                  onChange={(e) => setNewAgeGroup(e.target.value)}
                  placeholder="Yaş qrupu əlavə edin..."
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newAgeGroup.trim()) {
                      setFormData({
                        ...formData,
                        ageGroups: [...formData.ageGroups, newAgeGroup.trim()],
                      })
                      setNewAgeGroup('')
                    }
                  }}
                >
                  Əlavə et
                </Button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.ageGroups.map((ageGroup, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span>{ageGroup}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          ageGroups: formData.ageGroups.filter((_, i) => i !== index),
                        })
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-muted-foreground">Materiallar</label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="Material əlavə edin..."
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newMaterial.trim()) {
                      setFormData({
                        ...formData,
                        materials: [...formData.materials, newMaterial.trim()],
                      })
                      setNewMaterial('')
                    }
                  }}
                >
                  Əlavə et
                </Button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.materials.map((material, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span>{material}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          materials: formData.materials.filter((_, i) => i !== index),
                        })
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-muted-foreground">Ölçülər</label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Ölçü əlavə edin..."
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newSize.trim()) {
                      setFormData({
                        ...formData,
                        size: [...formData.size, newSize.trim()],
                      })
                      setNewSize('')
                    }
                  }}
                >
                  Əlavə et
                </Button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.size.map((size, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span>{size}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          size: formData.size.filter((_, i) => i !== index),
                        })
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-muted-foreground">Rənglər</label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Rəng əlavə edin..."
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newColor.trim()) {
                      setFormData({
                        ...formData,
                        colors: [...formData.colors, newColor.trim()],
                      })
                      setNewColor('')
                    }
                  }}
                >
                  Əlavə et
                </Button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span>{color}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          colors: formData.colors.filter((_, i) => i !== index),
                        })
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal Et
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  'Məhsulu Kaydet'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Discount Dialog */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Məhsulda Endirim İdarəsi</DialogTitle>
            <DialogDescription>
              Məhsul endirim faizi daxil edin və ya silin.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={handleDiscountSubmit} className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-1">Məhsul:</p>
                <p className="text-lg font-bold text-blue-800">{selectedProduct.name}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-green-900 mb-1">Orijinal Qiymət:</p>
                <p className="text-2xl font-bold text-green-800">{selectedProduct.price?.toFixed(2)}₼</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Endirim Faizi (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discountData.discountPercentage}
                  onChange={(e) =>
                    setDiscountData({
                      ...discountData,
                      discountPercentage: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0-100 arasında dəyər daxil edin"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  0 daxil etmə endirim siləcəkdir
                </p>
              </div>

              {discountData.discountPercentage > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm font-semibold text-purple-900 mb-1">Əvvəl Qiymət:</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {(
                      selectedProduct.price - 
                      (selectedProduct.price * discountData.discountPercentage) / 100
                    ).toFixed(2)}
                    ₼
                  </p>
                  <p className="text-sm text-purple-700 mt-2">
                    Ən azı {(
                      (selectedProduct.price * discountData.discountPercentage) /
                      100
                    ).toFixed(2)}
                    ₼ qənaət
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDiscountDialogOpen(false)}>
                  İptal Et
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Emal olunur...
                    </>
                  ) : discountData.discountPercentage === 0 ? (
                    'Endirim Sil'
                  ) : (
                    'Endirim Təyin Et'
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

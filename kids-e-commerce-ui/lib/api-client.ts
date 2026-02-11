import { apiCall, ApiError, STORAGE_KEYS } from './utils'

// Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  username: string
  fullName: string
}

export interface User {
  id: string
  email: string
  username: string
  fullName: string
  isAdmin: boolean
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

// Updated Product interface to match backend ProductDto
export interface Product {
  id: number
  name: string
  description: string
  price: number
  finalPrice: number  // Price after discount
  stock: number
  categoryId: number
  categoryName?: string
  imageUrl: string  // Actual image URL from backend
  createdAt: string
  ageGroups?: string[]
  materials?: string[]
  size?: string[]
  colors?: string[]
  discountPercantage?: number  // Note: matches backend typo
  rating?: number
  reviews?: number
}

export interface Category {
  id: number
  name: string
  description: string
  imageUrl: string
  createdAt: string
  productCount: number
}

export interface Settings {
  id?: number
  name: string
  phoneNumber: string
  address: string
  email: string
  facebookUrl?: string
  instagramUrl?: string
  twitterUrl?: string
}

export interface Hero {
  id: number
  title: string
  description: string
  imageUrl: string
  discountMessage: string
  orderMessage: string
}

export interface OrderItem {
  productId: number
  quantity: number
  unitPrice: number
}

export interface CreateOrderRequest {
  fullName: string
  phoneNumber: string
  email: string
  address: string
  notes?: string
  orderItems: OrderItem[]
}

export interface OrderItemDto {
  id: number
  orderId: number
  productId: number
  productName: string
  productImageUrl: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: number
  fullName: string
  phoneNumber: string
  email: string
  address: string
  notes: string
  orderStatus: string
  createdAt: string
  totalAmount: number
  acceptedAt?: string | null
  rejectedAt?: string | null
  rejectedReason?: string | null
  orderItems: OrderItemDto[]
}

export interface ProductFilter {
  ageGroups?: string[]
  materials?: string[]
  size?: string[]
  colors?: string[]
  minPrice?: number
  maxPrice?: number
}

export interface FilterResponse {
  products: Product[]
  totalCount: number
  appliedFilters: {
    ageGroups: string[]
    materials: string[]
    sizes: string[]
    colors: string[]
    minPrice: number
    maxPrice: number
  }
}

export interface AvailableFilters {
  ageGroups: string[]
  materials: string[]
  sizes: string[]
  colors: string[]
  priceRange: {
    min: number
    max: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

// Helper function to parse and clean product filter arrays
const parseFilterArray = (value: any): string[] => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .map(item => {
        // Handle stringified JSON arrays like "[\"6-12\""
        if (typeof item === 'string' && item.startsWith('[')) {
          try {
            const parsed = JSON.parse(item)
            return Array.isArray(parsed) ? parsed : [parsed]
          } catch {
            return []
          }
        }
        // Handle regular strings
        if (typeof item === 'string' && item.trim() && item !== '[]') {
          return item.trim()
        }
        return null
      })
      .flat()
      .filter((v): v is string => v !== null && v !== '' && v !== '[]')
  }
  return []
}

// Helper function to normalize product data from API
const normalizeProduct = (product: any): Product => {
  return {
    ...product,
    ageGroups: parseFilterArray(product.ageGroups),
    materials: parseFilterArray(product.materials),
    size: parseFilterArray(product.size),
    colors: parseFilterArray(product.colors),
  }
}

// Helper function to normalize array of products
const normalizeProducts = (products: any[]): Product[] => {
  if (!Array.isArray(products)) return []
  return products.map(normalizeProduct)
}

// Authentication API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    if (response.token && response.user) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
    }
    return response
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    if (response.token && response.user) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
    }
    return response
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem(STORAGE_KEYS.USER)
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: (): boolean => {
    return typeof window !== 'undefined' && !!localStorage.getItem(STORAGE_KEYS.TOKEN)
  },

  isAdmin: (): boolean => {
    const user = authApi.getCurrentUser()
    return user?.isAdmin ?? false
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiCall('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }, true)
  },

  changeEmail: async (newEmail: string): Promise<{ success: boolean; message: string }> => {
    return apiCall('/auth/change-email', {
      method: 'POST',
      body: JSON.stringify({ newEmail }),
    }, true)
  },
}

// Admin Authentication API
export const adminAuthApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>('/AdminAuth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    if (response.token && response.user) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
    }
    return response
  },

  validateToken: async (token: string): Promise<{ success: boolean; message: string }> => {
    return apiCall('/AdminAuth/validate-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem(STORAGE_KEYS.USER)
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: (): boolean => {
    return typeof window !== 'undefined' && !!localStorage.getItem(STORAGE_KEYS.TOKEN)
  },

  isAdmin: (): boolean => {
    const user = adminAuthApi.getCurrentUser()
    return user?.isAdmin ?? false
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiCall('/AdminAuth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }, true)
  },

  changeEmail: async (newEmail: string): Promise<{ success: boolean; message: string }> => {
    return apiCall('/AdminAuth/change-email', {
      method: 'POST',
      body: JSON.stringify({ newEmail, currentPassword: '' }),
    }, true)
  },

  getCurrentUserInfo: async (): Promise<any> => {
    return apiCall('/AdminAuth/me', {}, true)
  },

  decodeToken: async (token: string): Promise<any> => {
    return apiCall('/AdminAuth/debug/decode-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  },
}

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const data = await apiCall<any[]>('/product')
    return normalizeProducts(data)
  },

  getById: async (id: number): Promise<Product> => {
    const data = await apiCall<any>(`/product/${id}`)
    return normalizeProduct(data)
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    const data = await apiCall<any[]>(`/product/category/${categoryId}`)
    return normalizeProducts(data)
  },

  search: async (searchTerm: string): Promise<Product[]> => {
    const data = await apiCall<any[]>(`/product/search?searchTerm=${encodeURIComponent(searchTerm)}`)
    return normalizeProducts(data)
  },

  getPriceRange: async (minPrice: number, maxPrice: number): Promise<Product[]> => {
    const data = await apiCall<any[]>(`/product/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`)
    return normalizeProducts(data)
  },

  getPaged: async (page: number, pageSize: number = 12): Promise<PaginatedResponse<Product>> => {
    const data = await apiCall<any>(`/product/paged?page=${page}&pageSize=${pageSize}`)
    return {
      ...data,
      data: normalizeProducts(data.data)
    }
  },

  getAvailable: async (): Promise<Product[]> => {
    const data = await apiCall<any[]>('/product/available')
    return normalizeProducts(data)
  },

  getLatest: async (count: number = 8): Promise<Product[]> => {
    const data = await apiCall<any[]>(`/product/latest?count=${count}`)
    return normalizeProducts(data)
  },

  getSortedByPrice: async (ascending: boolean = true): Promise<Product[]> => {
    const data = await apiCall<any[]>(`/product/sorted-by-price?ascending=${ascending}`)
    return normalizeProducts(data)
  },

  getAvailability: async (productId: number): Promise<{ available: boolean; quantity: number }> => {
    return apiCall(`/product/${productId}/availability`)
  },

  filter: async (filters: ProductFilter): Promise<Product[]> => {
    const data = await apiCall<any[]>('/product/filter', {
      method: 'POST',
      body: JSON.stringify(filters),
    })
    return normalizeProducts(data)
  },

  getWithDiscounts: async (): Promise<Product[]> => {
    const data = await apiCall<any[]>('/product/with-discounts')
    return normalizeProducts(data)
  },

  getDiscountsAbove: async (minDiscountPercentage: number): Promise<Product[]> => {
    const data = await apiCall<any[]>(`/product/discounts-above?minDiscountPercentage=${minDiscountPercentage}`)
    return normalizeProducts(data)
  },

  getDiscountStatistics: async (): Promise<any> => {
    return apiCall('/product/discount-statistics')
  },
}

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    return apiCall<Category[]>('/category')
  },

  getById: async (id: number): Promise<Category> => {
    return apiCall<Category>(`/category/${id}`)
  },

  getWithProducts: async (): Promise<(Category & { products: Product[] })[]> => {
    return apiCall('/category/with-products')
  },

  getByIdWithProducts: async (id: number): Promise<Category & { products: Product[] }> => {
    return apiCall(`/category/${id}/with-products`)
  },

  search: async (searchTerm: string): Promise<Category[]> => {
    return apiCall<Category[]>(`/category/search?searchTerm=${encodeURIComponent(searchTerm)}`)
  },

  getPaged: async (page: number, pageSize: number = 12): Promise<PaginatedResponse<Category>> => {
    return apiCall<PaginatedResponse<Category>>(`/category/paged?page=${page}&pageSize=${pageSize}`)
  },
}

// Orders API
export const ordersApi = {
  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    return apiCall<Order>('/order/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  },

  getById: async (id: number): Promise<Order> => {
    return apiCall<Order>(`/order/${id}`, {}, true)
  },

  getAll: async (): Promise<Order[]> => {
    return apiCall<Order[]>('/order', {}, true)
  },

  update: async (id: number, data: Partial<CreateOrderRequest>): Promise<Order> => {
    return apiCall<Order>(`/order/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true)
  },

  delete: async (id: number): Promise<{ success: boolean }> => {
    return apiCall(`/order/${id}`, {
      method: 'DELETE',
    }, true)
  },
}

// Admin Products API
export const adminProductsApi = {
  create: async (formData: FormData): Promise<Product> => {
    return apiCall<Product>('/AdminProduct', {
      method: 'POST',
      body: formData,
    }, true)
  },

  update: async (id: number, formData: FormData): Promise<Product> => {
    return apiCall<Product>(`/AdminProduct/${id}`, {
      method: 'PUT',
      body: formData,
    }, true)
  },

  delete: async (id: number): Promise<{ success: boolean }> => {
    return apiCall(`/AdminProduct/${id}`, { method: 'DELETE' }, true)
  },

  getAll: async (): Promise<Product[]> => {
    return apiCall<Product[]>('/AdminProduct', {}, true)
  },

  getById: async (id: number): Promise<Product> => {
    return apiCall<Product>(`/AdminProduct/${id}`, {}, true)
  },

  getPaged: async (page: number, pageSize: number = 12): Promise<PaginatedResponse<Product>> => {
    return apiCall<PaginatedResponse<Product>>(`/AdminProduct/paged?page=${page}&pageSize=${pageSize}`, {}, true)
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    return apiCall<Product[]>(`/AdminProduct/category/${categoryId}`, {}, true)
  },

  search: async (searchTerm: string): Promise<Product[]> => {
    return apiCall<Product[]>(`/AdminProduct/search?searchTerm=${encodeURIComponent(searchTerm)}`, {}, true)
  },

  filter: async (filters: ProductFilter): Promise<Product[]> => {
    return apiCall<Product[]>('/AdminProduct/filter', {
      method: 'POST',
      body: JSON.stringify(filters),
    }, true)
  },

  getSortedByPrice: async (ascending: boolean = true): Promise<Product[]> => {
    return apiCall<Product[]>(`/AdminProduct/sorted/price?ascending=${ascending}`, {}, true)
  },

  getSortedByDate: async (ascending: boolean = false): Promise<Product[]> => {
    return apiCall<Product[]>(`/AdminProduct/sorted/date?ascending=${ascending}`, {}, true)
  },

  getAvailable: async (): Promise<Product[]> => {
    return apiCall<Product[]>('/AdminProduct/available', {}, true)
  },

  getLatest: async (count: number = 8): Promise<Product[]> => {
    return apiCall<Product[]>(`/AdminProduct/latest?count=${count}`, {}, true)
  },

  getAvailability: async (productId: number): Promise<any> => {
    return apiCall(`/AdminProduct/${productId}/availability`, {}, true)
  },

  getStatistics: async (): Promise<any> => {
    return apiCall('/AdminProduct/statistics', {}, true)
  },

  getPriceRange: async (minPrice: number, maxPrice: number): Promise<Product[]> => {
    return apiCall<Product[]>(`/AdminProduct/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`, {}, true)
  },

  // Discount management
  addDiscount: async (productId: number, discountPercentage: number): Promise<any> => {
    return apiCall(`/AdminProduct/${productId}/discount`, {
      method: 'POST',
      body: JSON.stringify({ discountPercentage }),
    }, true)
  },

  updateDiscount: async (productId: number, discountPercentage: number): Promise<any> => {
    return apiCall(`/AdminProduct/${productId}/discount`, {
      method: 'PUT',
      body: JSON.stringify({ discountPercentage }),
    }, true)
  },

  removeDiscount: async (productId: number): Promise<any> => {
    return apiCall(`/AdminProduct/${productId}/discount`, { method: 'DELETE' }, true)
  },

  getDiscount: async (productId: number): Promise<any> => {
    return apiCall(`/AdminProduct/${productId}/discount`, {}, true)
  },

  bulkDiscount: async (productDiscounts: { productId: number; discountPercentage: number }[]): Promise<any> => {
    return apiCall('/AdminProduct/bulk-discount', {
      method: 'POST',
      body: JSON.stringify({ productDiscounts }),
    }, true)
  },
}

// Admin Categories API
export const adminCategoriesApi = {
  create: async (formData: FormData): Promise<Category> => {
    return apiCall<Category>('/AdminCategory', {
      method: 'POST',
      body: formData,
    }, true)
  },

  update: async (id: number, formData: FormData): Promise<Category> => {
    return apiCall<Category>(`/AdminCategory/${id}`, {
      method: 'PUT',
      body: formData,
    }, true)
  },

  delete: async (id: number): Promise<{ success: boolean }> => {
    return apiCall(`/AdminCategory/${id}`, { method: 'DELETE' }, true)
  },

  getAll: async (): Promise<Category[]> => {
    return apiCall<Category[]>('/AdminCategory', {}, true)
  },

  getById: async (id: number): Promise<Category> => {
    return apiCall<Category>(`/AdminCategory/${id}`, {}, true)
  },

  getWithProducts: async (): Promise<(Category & { products: Product[] })[]> => {
    return apiCall('/AdminCategory/with-products', {}, true)
  },

  getByIdWithProducts: async (id: number): Promise<Category & { products: Product[] }> => {
    return apiCall(`/AdminCategory/${id}/with-products`, {}, true)
  },

  search: async (searchTerm: string): Promise<Category[]> => {
    return apiCall<Category[]>(`/AdminCategory/search?searchTerm=${encodeURIComponent(searchTerm)}`, {}, true)
  },

  getPaged: async (page: number, pageSize: number = 12): Promise<PaginatedResponse<Category>> => {
    return apiCall<PaginatedResponse<Category>>(`/AdminCategory/paged?page=${page}&pageSize=${pageSize}`, {}, true)
  },

  getCount: async (): Promise<{ count: number }> => {
    return apiCall('/AdminCategory/count', {}, true)
  },

  checkName: async (name: string, excludeId?: number): Promise<{ exists: boolean }> => {
    let endpoint = `/AdminCategory/check-name?name=${encodeURIComponent(name)}`
    if (excludeId) endpoint += `&excludeId=${excludeId}`
    return apiCall(endpoint, {}, true)
  },
}

// Admin Orders API
export const adminOrdersApi = {
  getAll: async (): Promise<Order[]> => {
    return apiCall<Order[]>('/AdminOrder', {}, true)
  },

  getById: async (id: number): Promise<Order> => {
    return apiCall<Order>(`/AdminOrder/${id}`, {}, true)
  },

  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    return apiCall<Order>('/AdminOrder', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }, true)
  },

  update: async (id: number, data: Partial<Order>): Promise<Order> => {
    return apiCall<Order>(`/AdminOrder/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true)
  },

  delete: async (id: number): Promise<{ success: boolean }> => {
    return apiCall(`/AdminOrder/${id}`, { method: 'DELETE' }, true)
  },

  accept: async (id: number): Promise<any> => {
    return apiCall(`/AdminOrder/${id}/accept`, { method: 'POST' }, true)
  },

  reject: async (id: number, rejectedReason: string): Promise<any> => {
    return apiCall(`/AdminOrder/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ rejectedReason }),
    }, true)
  },

  getByCustomer: async (customerName: string): Promise<Order[]> => {
    return apiCall<Order[]>(`/AdminOrder/customer/${encodeURIComponent(customerName)}`, {}, true)
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<Order[]> => {
    return apiCall<Order[]>(`/AdminOrder/date-range?startDate=${startDate}&endDate=${endDate}`, {}, true)
  },

  getRecent: async (count: number = 10): Promise<Order[]> => {
    return apiCall<Order[]>(`/AdminOrder/recent?count=${count}`, {}, true)
  },

  search: async (searchTerm: string): Promise<Order[]> => {
    return apiCall<Order[]>(`/AdminOrder/search?searchTerm=${encodeURIComponent(searchTerm)}`, {}, true)
  },

  getWithItems: async (): Promise<any[]> => {
    return apiCall('/AdminOrder/with-items', {}, true)
  },

  getByIdWithItems: async (id: number): Promise<any> => {
    return apiCall(`/AdminOrder/${id}/with-items`, {}, true)
  },

  getPaged: async (page: number, pageSize: number = 12): Promise<PaginatedResponse<Order>> => {
    return apiCall<PaginatedResponse<Order>>(`/AdminOrder/paged?page=${page}&pageSize=${pageSize}`, {}, true)
  },

  getStatistics: async (): Promise<any> => {
    return apiCall('/AdminOrder/statistics', {}, true)
  },

  getAverageValue: async (): Promise<{ averageValue: number }> => {
    return apiCall('/AdminOrder/average-value', {}, true)
  },
}

// File Upload API
export const fileUploadApi = {
  uploadImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData()
    formData.append('Image', file)
    
    return apiCall<{ imageUrl: string }>('/fileupload/Image', {
      method: 'POST',
      body: formData,
    }, true)
  },

  deleteImage: async (imageUrl: string): Promise<{ success: boolean }> => {
    return apiCall('/fileupload/Image', {
      method: 'DELETE',
      body: JSON.stringify({ imageUrl }),
    }, true)
  },

  getImages: async (): Promise<{ images: string[] }> => {
    return apiCall('/fileupload/images', {}, true)
  },

  validateImage: async (file: File): Promise<{ valid: boolean; message: string }> => {
    const formData = new FormData()
    formData.append('Image', file)
    
    return apiCall<{ valid: boolean; message: string }>('/fileupload/validate', {
      method: 'POST',
      body: formData,
    }, true)
  },
}

// Settings API
export const settingsApi = {
  getAll: async (): Promise<Settings[]> => {
    return apiCall<Settings[]>('/settings')
  },

  getById: async (id: number): Promise<Settings> => {
    return apiCall<Settings>(`/settings/${id}`)
  },

  create: async (settings: Settings): Promise<Settings> => {
    return apiCall<Settings>('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    }, true)
  },

  update: async (id: number, settings: Settings): Promise<Settings> => {
    return apiCall<Settings>(`/settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    }, true)
  },

  delete: async (id: number): Promise<{ success: boolean }> => {
    return apiCall(`/settings/${id}`, { method: 'DELETE' }, true)
  },

  getCurrentSettings: async (): Promise<Settings> => {
    // The backend returns an array, so we take the first record
    const settingsArray = await apiCall<Settings[]>('/settings')
    if (Array.isArray(settingsArray) && settingsArray.length > 0) {
      return settingsArray[0]
    }
    throw new ApiError(404, 'No settings found')
  },

  updateCurrentSettings: async (settings: Settings): Promise<Settings> => {
    // Update the first settings record (id=1)
    if (!settings.id) settings.id = 1
    return apiCall<Settings>(`/settings/${settings.id}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    }, true)
  },

  getSocialMediaLinks: async (): Promise<{ facebook: string; instagram: string; twitter: string }> => {
    // Get the first settings record and extract social media links
    const settingsArray = await apiCall<Settings[]>('/settings')
    if (Array.isArray(settingsArray) && settingsArray.length > 0) {
      const settings = settingsArray[0]
      return {
        facebook: settings.facebookUrl || '',
        instagram: settings.instagramUrl || '',
        twitter: settings.twitterUrl || '',
      }
    }
    return {
      facebook: '',
      instagram: '',
      twitter: '',
    }
  },

  updateSocialMediaLinks: async (socialLinks: { facebook?: string; instagram?: string; twitter?: string }): Promise<{ success: boolean }> => {
    // Get current settings and update social media links
    const settingsArray = await apiCall<Settings[]>('/settings')
    if (Array.isArray(settingsArray) && settingsArray.length > 0) {
      const settings = settingsArray[0]
      const updatedSettings: Settings = {
        ...settings,
        facebookUrl: socialLinks.facebook || settings.facebookUrl,
        instagramUrl: socialLinks.instagram || settings.instagramUrl,
        twitterUrl: socialLinks.twitter || settings.twitterUrl,
      }
      await apiCall<Settings>(`/settings/${settings.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedSettings),
      }, true)
      return { success: true }
    }
    throw new ApiError(404, 'No settings found')
  },

  validate: async (settings: Settings): Promise<{ valid: boolean; errors?: string[] }> => {
    return apiCall('/settings/validate', {
      method: 'POST',
      body: JSON.stringify(settings),
    }, true)
  },
}

// Hero API
export const heroApi = {
  getAll: async (): Promise<Hero[]> => {
    return apiCall<Hero[]>('/Hero')
  },

  getById: async (id: number): Promise<Hero> => {
    return apiCall<Hero>(`/Hero/${id}`)
  },
}

export default {
  auth: authApi,
  adminAuth: adminAuthApi,
  products: productsApi,
  categories: categoriesApi,
  orders: ordersApi,
  adminProducts: adminProductsApi,
  adminCategories: adminCategoriesApi,
  adminOrders: adminOrdersApi,
  fileUpload: fileUploadApi,
  settings: settingsApi,
  hero: heroApi,
}
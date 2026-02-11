import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://localhost:7038/api',
  UPLOADS_URL: 'https://localhost:7038',
  FRONTEND_URL: 'http://localhost:3000',
  JWT_EXPIRY: 1440 * 60 * 60 * 1000, // 1440 hours in milliseconds
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'ayyuaz_cart',
}

// Error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// API helper function with proper CORS handling
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth = false
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  // Determine if body is FormData
  const isFormData = options.body instanceof FormData
  
  // Initialize headers - only set Content-Type for non-FormData requests
  const headers: HeadersInit = isFormData 
    ? { 'Accept': 'application/json', ...options.headers }
    : {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      }

  if (includeAuth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.TOKEN) : null
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }
  }

  // Prepare body - don't stringify FormData
  let body: BodyInit | undefined = options.body
  if (!isFormData && typeof options.body === 'string') {
    body = options.body
  } else if (!isFormData && options.body && typeof options.body === 'object') {
    body = JSON.stringify(options.body)
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body,
      credentials: 'include', // Include credentials for CORS
      mode: 'cors',
    })

    if (!response.ok) {
      let error: any = { message: 'Unknown error' }
      try {
        error = await response.json()
      } catch {
        error = { message: response.statusText || 'API request failed' }
      }
      throw new ApiError(response.status, error.message || 'API request failed', error)
    }

    const data = await response.json()
    return data
  } catch (err) {
    if (err instanceof ApiError) {
      throw err
    }
    
    // Handle network errors
    if (err instanceof TypeError) {
      throw new ApiError(0, `Network error: ${err.message}. Make sure the backend is running at ${API_CONFIG.BASE_URL}`)
    }
    
    throw new ApiError(500, err instanceof Error ? err.message : 'Unknown error occurred')
  }
}

/**
 * Normalize image URLs from backend to absolute URLs
 * Backend returns relative paths like "/uploads/image.jpg"
 * This function converts them to absolute URLs like "https://localhost:7038/uploads/image.jpg"
 */
export function normalizeImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return '/placeholder.svg'
  }
  
  // If it's already an absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // If it's a relative path, convert to absolute URL
  if (imageUrl.startsWith('/')) {
    return `${API_CONFIG.UPLOADS_URL}${imageUrl}`
  }
  
  // Default to placeholder if format is unexpected
  return '/placeholder.svg'
}

// Format price in AZN
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('az-AZ', {
    style: 'currency',
    currency: 'AZN',
  }).format(price)
}

// Calculate discount
export function calculateDiscount(originalPrice: number, discountPercentage: number): number {
  return originalPrice - (originalPrice * discountPercentage) / 100
}

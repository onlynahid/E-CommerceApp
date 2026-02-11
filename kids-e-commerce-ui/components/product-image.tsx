'use client'

import { useState } from 'react'
import Image from 'next/image'
import { API_CONFIG } from '@/lib/utils'

interface ProductImageProps {
  imageUrl: string
  alt: string
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down'
}

/**
 * ProductImage Component
 * Handles loading images from backend with fallback support
 * Converts relative paths to full backend URLs
 */
export function ProductImage({
  imageUrl,
  alt,
  className = '',
  fill = false,
  sizes,
  priority = false,
  objectFit = 'cover',
}: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Convert relative image path to full backend URL
  const getFullImageUrl = (url: string): string => {
    // If it already has a protocol, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    
    // If it starts with /, it's relative to backend
    if (url.startsWith('/')) {
      return `${API_CONFIG.BASE_URL.replace('/api', '')}${url}`
    }
    
    // Otherwise, assume it's a path in uploads
    return `${API_CONFIG.BASE_URL.replace('/api', '')}/uploads/${url}`
  }

  const fullImageUrl = getFullImageUrl(imageUrl)

  // Fallback emoji for different product types
  const getFallbackEmoji = () => {
    const lowerAlt = alt.toLowerCase()
    if (lowerAlt.includes('kitab') || lowerAlt.includes('book')) return '📚'
    if (lowerAlt.includes('saati') || lowerAlt.includes('clock')) return '🕐'
    if (lowerAlt.includes('palto') || lowerAlt.includes('coat')) return '🧥'
    if (lowerAlt.includes('gitar') || lowerAlt.includes('guitar')) return '🎸'
    if (lowerAlt.includes('telefon') || lowerAlt.includes('phone')) return '📱'
    if (lowerAlt.includes('etir') || lowerAlt.includes('perfume')) return '🌸'
    if (lowerAlt.includes('eynek') || lowerAlt.includes('glass')) return '👓'
    if (lowerAlt.includes('oyuncak') || lowerAlt.includes('toy')) return '🎮'
    if (lowerAlt.includes('kiyafet') || lowerAlt.includes('clothes')) return '👕'
    if (lowerAlt.includes('aksesuar') || lowerAlt.includes('accessories')) return '👜'
    return '🛍️'
  }

  if (error || !imageUrl || imageUrl === 'default-product.jpg') {
    return (
      <div
        className={`${className} bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center`}
        style={{ position: fill ? 'relative' : 'static' }}
      >
        <div className="text-6xl drop-shadow-lg">{getFallbackEmoji()}</div>
      </div>
    )
  }

  return fill ? (
    <Image
      src={fullImageUrl}
      alt={alt}
      fill
      className={className}
      style={{ objectFit }}
      sizes={sizes}
      priority={priority}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setError(true)
        setIsLoading(false)
      }}
    />
  ) : (
    <Image
      src={fullImageUrl}
      alt={alt}
      className={className}
      sizes={sizes}
      priority={priority}
      width={400}
      height={300}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setError(true)
        setIsLoading(false)
      }}
    />
  )
}

/**
 * Fallback component for when Image is not used
 */
export function ProductImageFallback({ 
  imageUrl, 
  alt 
}: { 
  imageUrl: string
  alt: string 
}) {
  const [hasError, setHasError] = useState(false)

  const getFullImageUrl = (url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    if (url.startsWith('/')) {
      return `${API_CONFIG.BASE_URL.replace('/api', '')}${url}`
    }
    return `${API_CONFIG.BASE_URL.replace('/api', '')}/uploads/${url}`
  }

  const getFallbackEmoji = () => {
    const lowerAlt = alt.toLowerCase()
    if (lowerAlt.includes('kitab')) return '📚'
    if (lowerAlt.includes('saati')) return '🕐'
    if (lowerAlt.includes('palto')) return '🧥'
    if (lowerAlt.includes('gitar')) return '🎸'
    if (lowerAlt.includes('telefon')) return '📱'
    if (lowerAlt.includes('etir')) return '🌸'
    if (lowerAlt.includes('eynek')) return '👓'
    if (lowerAlt.includes('oyuncak')) return '🎮'
    if (lowerAlt.includes('kiyafet')) return '👕'
    if (lowerAlt.includes('aksesuar')) return '👜'
    return '🛍️'
  }

  if (hasError || !imageUrl) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        <span className="text-6xl drop-shadow-lg">{getFallbackEmoji()}</span>
      </div>
    )
  }

  return (
    <img
      src={getFullImageUrl(imageUrl)}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  )
}

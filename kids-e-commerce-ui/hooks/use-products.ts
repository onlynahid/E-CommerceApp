'use client'

import { useEffect, useState, useCallback } from 'react'
import { productsApi, Product, ProductFilter, PaginatedResponse } from '@/lib/api-client'
import { ApiError } from '@/lib/utils'

interface UseProductsOptions {
  pageSize?: number
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { pageSize = 12 } = options

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await productsApi.getAll()
      setProducts(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch products'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchProducts = useCallback(async (query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await productsApi.search(query)
      setProducts(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to search products'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const filterProducts = useCallback(async (filters: ProductFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await productsApi.filter(filters)
      setProducts(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to filter products'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getProductById = useCallback(async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await productsApi.getById(id)
      return data
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch product'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getProductsByCategory = useCallback(async (categoryId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await productsApi.getByCategory(categoryId)
      setProducts(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch category products'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getLatestProducts = useCallback(async (count: number = 8) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await productsApi.getLatest(count)
      setProducts(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch latest products'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getSortedByPrice = useCallback(async (ascending: boolean = true) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await productsApi.getSortedByPrice(ascending)
      setProducts(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch sorted products'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    searchProducts,
    filterProducts,
    getProductById,
    getProductsByCategory,
    getLatestProducts,
    getSortedByPrice,
  }
}

export function useProduct(productId: number) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await productsApi.getById(productId)
        setProduct(data)
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to fetch product'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  return { product, isLoading, error }
}

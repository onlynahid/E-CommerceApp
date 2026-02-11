'use client'

import { useEffect, useState, useCallback } from 'react'
import { categoriesApi, Category } from '@/lib/api-client'
import { ApiError } from '@/lib/utils'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await categoriesApi.getAll()
      setCategories(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch categories'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getCategoryWithProducts = useCallback(async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await categoriesApi.getByIdWithProducts(id)
      return data
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch category'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getAllCategoriesWithProducts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await categoriesApi.getWithProducts()
      setCategories(data as Category[])
      return data
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch categories'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    getCategoryWithProducts,
    getAllCategoriesWithProducts,
  }
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { heroApi, Hero } from '@/lib/api-client'
import { ApiError } from '@/lib/utils'

export function useHero() {
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHeroes = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedHeroes = await heroApi.getAll()
      setHeroes(fetchedHeroes)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch heroes'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getHero = useCallback(async (id: number): Promise<Hero | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const hero = await heroApi.getById(id)
      return hero
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch hero'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHeroes()
  }, [fetchHeroes])

  return {
    heroes,
    isLoading,
    error,
    fetchHeroes,
    getHero,
  }
}

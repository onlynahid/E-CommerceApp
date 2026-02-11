'use client'

import { useEffect, useState, useCallback } from 'react'
import { ordersApi, CreateOrderRequest, Order } from '@/lib/api-client'
import { ApiError } from '@/lib/utils'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = useCallback(async (orderData: CreateOrderRequest): Promise<Order> => {
    setIsLoading(true)
    setError(null)
    try {
      const order = await ordersApi.create(orderData)
      setOrders((prev) => [...prev, order])
      return order
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to create order'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getOrder = useCallback(async (id: number): Promise<Order | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const order = await ordersApi.getById(id)
      return order
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch order'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchAllOrders = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedOrders = await ordersApi.getAll()
      setOrders(fetchedOrders)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch orders'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateOrder = useCallback(async (id: number, data: Partial<CreateOrderRequest>): Promise<Order | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const order = await ordersApi.update(id, data)
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? order : o))
      )
      return order
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to update order'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteOrder = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await ordersApi.delete(id)
      setOrders((prev) => prev.filter((o) => o.id !== id))
      return true
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete order'
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    orders,
    isLoading,
    error,
    createOrder,
    getOrder,
    fetchAllOrders,
    updateOrder,
    deleteOrder,
  }
}

'use client'

import { useState, useEffect } from 'react'
import { settingsApi, Settings } from '@/lib/api-client'

export interface SettingsHookReturn {
  settings: Settings | null
  socialLinks: { facebook: string; instagram: string; twitter: string } | null
  isLoading: boolean
  error: string | null
  updateSettings: (settings: Partial<Settings>) => Promise<void>
  updateSocialLinks: (links: { facebook?: string; instagram?: string; twitter?: string }) => Promise<void>
  refreshSettings: () => Promise<void>
}

/**
 * Custom hook for managing settings
 * Fetches and manages site settings and social media links
 */
export function useSettings(): SettingsHookReturn {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [socialLinks, setSocialLinks] = useState<{ facebook: string; instagram: string; twitter: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch current settings
      const settingsData = await settingsApi.getCurrentSettings()
      setSettings(settingsData)

      // Fetch social media links
      const socialData = await settingsApi.getSocialMediaLinks()
      setSocialLinks(socialData)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch settings'
      setError(message)
      console.error('Settings fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (updatedSettings: Partial<Settings>) => {
    try {
      setError(null)
      const merged = { ...settings, ...updatedSettings } as Settings
      const result = await settingsApi.updateCurrentSettings(merged)
      setSettings(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update settings'
      setError(message)
      throw err
    }
  }

  const updateSocialLinks = async (links: { facebook?: string; instagram?: string; twitter?: string }) => {
    try {
      setError(null)
      await settingsApi.updateSocialMediaLinks(links)
      
      // Update local state
      setSocialLinks(prev => prev ? { ...prev, ...links } : links as any)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update social links'
      setError(message)
      throw err
    }
  }

  const refreshSettings = async () => {
    await fetchSettings()
  }

  return {
    settings,
    socialLinks,
    isLoading,
    error,
    updateSettings,
    updateSocialLinks,
    refreshSettings,
  }
}

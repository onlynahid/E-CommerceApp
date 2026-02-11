'use client'

import React, { createContext, useContext } from 'react'
import { useSettings, SettingsHookReturn } from '@/hooks/use-settings'

const SettingsContext = createContext<SettingsHookReturn | undefined>(undefined)

/**
 * Settings Provider Component
 * Wraps the application to provide settings context
 * Must be placed at the root of the app (in layout.tsx)
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const settingsData = useSettings()

  return (
    <SettingsContext.Provider value={settingsData}>
      {children}
    </SettingsContext.Provider>
  )
}

/**
 * Hook to use settings context
 * Use this in any component to access settings throughout the app
 */
export function useSettingsContext(): SettingsHookReturn {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider')
  }
  return context
}

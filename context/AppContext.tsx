'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { children as mockChildren } from '@/lib/mockData'
import type { ChildProfile, UserMode } from '@/lib/types'

interface AppState {
  mode: UserMode | null
  child: ChildProfile
  setMode: (mode: UserMode | null) => void
  setChild: (child: ChildProfile) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<UserMode | null>(null)
  const [child, setChild] = useState<ChildProfile>(mockChildren[0])

  const value = useMemo(
    () => ({
      mode,
      child,
      setMode,
      setChild,
    }),
    [mode, child],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ParentShell } from '@/components/layout/ParentShell'
import { useApp } from '@/context/AppContext'

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode } = useApp()
  const router = useRouter()
  const pathname = usePathname()
  const variant = pathname?.startsWith('/parent/journey') ? 'light' : 'default'

  useEffect(() => {
    if (mode === null) setMode('parent')
    else if (mode !== 'parent') router.replace('/')
  }, [mode, setMode, router])

  if (mode !== 'parent' && mode !== null) return null

  return <ParentShell variant={variant}>{children}</ParentShell>
}

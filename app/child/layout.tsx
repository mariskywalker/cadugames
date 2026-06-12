'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { useApp } from '@/context/AppContext'

export default function ChildLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode } = useApp()
  const router = useRouter()
  const pathname = usePathname()
  const isLife = pathname?.startsWith('/child/life')
  const isComunicacao = pathname === '/child/life/comunicacao'
  const variant = isLife ? 'life' : 'default'

  useEffect(() => {
    if (mode === null) setMode('child')
    else if (mode !== 'child') router.replace('/')
  }, [mode, setMode, router])

  if (mode !== 'child' && mode !== null) return null

  return (
    <AppShell
      showStatus={!isComunicacao}
      showStats={!isLife}
      showNav
      variant={variant}
    >
      {children}
    </AppShell>
  )
}

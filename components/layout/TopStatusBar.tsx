'use client'

import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/Badge'
import { useApp } from '@/context/AppContext'

const GlbIcon = dynamic(() => import('@/components/ui/GlbIcon'), {
  ssr: false,
  loading: () => <span>⭐</span>,
})

export function TopStatusBar({ showStats = true }: { showStats?: boolean }) {
  const { mode, child } = useApp()

  return (
    <header className="sticky top-0 z-30 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
      <div className="mx-auto max-w-5xl flex items-center justify-between gap-3 rounded-[1.75rem] bg-white/85 backdrop-blur-md border border-white shadow-cadu px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cadu-pink to-cadu-peach text-xl shadow-cadu">
            {child.avatar}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-cadu-muted truncate">
              {mode === 'parent' ? 'Modo responsável' : 'Modo criança'}
            </p>
            <p className="font-bold text-cadu-ink truncate">{child.name}</p>
          </div>
        </div>
        {showStats && (
          <div className="flex items-center gap-2 shrink-0">
            <Badge tone="cream">🔥 {child.streak}d</Badge>
            <Badge tone="pink" className="gap-1.5">
              <GlbIcon src="/models/star.glb" size={22} glowColor="rgba(255,196,87,0.55)" />
              {child.stars}
            </Badge>
          </div>
        )}
      </div>
    </header>
  )
}

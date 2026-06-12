'use client'

import { cn } from '@/lib/cn'
import { BottomNavigation } from './BottomNavigation'
import { TopStatusBar } from './TopStatusBar'

export interface AppShellProps {
  children: React.ReactNode
  /** Exibe barra de status com criança / streak / estrelas */
  showStatus?: boolean
  /** Métricas numéricas (streak, estrelas) — desligado no CADU LIFE */
  showStats?: boolean
  /** Exibe navegação inferior (requer modo no contexto) */
  showNav?: boolean
  /** Variante visual do ambiente */
  variant?: 'default' | 'life'
}

export function AppShell({
  children,
  showStatus = true,
  showStats = true,
  showNav = false,
  variant = 'default',
}: AppShellProps) {
  const isLife = variant === 'life'

  return (
    <div
      className={cn(
        'min-h-dvh text-cadu-ink',
        isLife ? 'cadu-life-shell' : 'cadu-gradient-bg',
      )}
    >
      {!isLife && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
          <div className="cadu-blob-pink absolute -top-24 -left-20 h-72 w-72 rounded-full blur-3xl" />
          <div className="cadu-blob-peach absolute top-1/3 -right-16 h-64 w-64 rounded-full blur-3xl" />
          <div className="cadu-blob-lavender absolute bottom-0 left-1/4 h-56 w-56 rounded-full blur-3xl" />
        </div>
      )}

      <div
        className={cn(
          'relative z-10 mx-auto',
          isLife ? 'max-w-none' : 'max-w-5xl',
          showNav && !isLife && 'pb-28',
          !showNav && !isLife && 'pb-8',
        )}
      >
        {showStatus && <TopStatusBar showStats={showStats} />}
        <main className={isLife ? 'p-0' : 'px-4 md:px-6'}>{children}</main>
      </div>

      {showNav && <BottomNavigation />}
    </div>
  )
}

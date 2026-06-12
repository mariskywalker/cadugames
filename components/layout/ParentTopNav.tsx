'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { parentTopNavigation } from '@/lib/navigation'
import { cn } from '@/lib/cn'

export function ParentTopNav({ light = false }: { light?: boolean }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2">
      <div
        className={cn(
          'mx-auto max-w-6xl flex items-center justify-between gap-2 rounded-2xl backdrop-blur-xl px-3 py-2 md:px-4',
          light
            ? 'border border-white/70 bg-white/65 shadow-[0_8px_22px_rgba(120,100,140,0.10)]'
            : 'border border-white/20 bg-white/10',
        )}
      >
        <Link href="/parent/journey" className="flex items-center gap-1.5 shrink-0">
          <span
            className={cn(
              'text-lg font-extrabold tracking-tight',
              light ? 'text-cadu-ink' : 'text-white',
            )}
          >
            CADU
          </span>
          <span className="text-sm">🐻</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Menu responsável">
          {parentTopNavigation.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'relative px-3 py-1.5 rounded-full text-sm font-semibold transition-colors',
                  light ? 'text-cadu-muted' : 'text-white/90',
                  active && (light ? 'text-cadu-ink' : 'text-white'),
                )}
              >
                {active && (
                  <motion.span
                    layoutId="parent-top-pill"
                    className={cn(
                      'absolute inset-0 rounded-full border',
                      light
                        ? 'bg-white/80 border-white/70'
                        : 'bg-white/25 border-white/30',
                    )}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-1">
                  {item.icon && active && <span className="text-xs">{item.icon}</span>}
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className={cn(
              'relative flex h-9 w-9 items-center justify-center rounded-full text-lg',
              light ? 'bg-white/70' : 'bg-white/15',
            )}
            aria-label="Notificações"
          >
            🔔
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold">
              3
            </span>
          </button>
          <div
            className={cn(
              'hidden sm:flex items-center gap-2 rounded-full pl-1 pr-2 py-1',
              light ? 'bg-white/70' : 'bg-white/15',
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cadu-pink to-cadu-coral text-sm">
              👩
            </span>
            <span className={cn('text-xs font-semibold', light ? 'text-cadu-ink' : 'text-white')}>
              Mãe do Lucas
            </span>
            <span className={cn('text-[10px]', light ? 'text-cadu-muted' : 'text-white/60')}>
              ▾
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

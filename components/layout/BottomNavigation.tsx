'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { getNavigation } from '@/lib/navigation'
import { cn } from '@/lib/cn'

export function BottomNavigation() {
  const pathname = usePathname()
  const { mode } = useApp()
  const items = getNavigation(mode)

  if (!mode) return null

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
      aria-label="Navegação principal"
    >
      <div className="mx-auto max-w-lg rounded-[2rem] bg-white/95 backdrop-blur-md border border-white shadow-cadu-lg px-2 py-2">
        <ul className="flex items-center justify-around gap-1">
          {items.map((item) => {
            const active = item.enabled && pathname === item.href
            const className = cn(
              'relative flex flex-col items-center gap-0.5 rounded-2xl px-2 py-2 text-[11px] font-semibold transition-colors min-w-[52px]',
              !item.enabled && 'opacity-40 cursor-not-allowed',
              item.enabled && active && 'text-cadu-coral',
              item.enabled && !active && 'text-cadu-muted hover:text-cadu-ink',
              !item.enabled && 'text-cadu-muted',
            )

            const content = (
              <>
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl bg-cadu-pink/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative text-lg leading-none">{item.icon}</span>
                <span className="relative">{item.label}</span>
              </>
            )

            return (
              <li key={item.id} className="flex-1 flex justify-center">
                {item.enabled ? (
                  <Link href={item.href} className={className} aria-current={active ? 'page' : undefined}>
                    {content}
                  </Link>
                ) : (
                  <span className={className} aria-disabled title="Em breve — Etapa 2">
                    {content}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

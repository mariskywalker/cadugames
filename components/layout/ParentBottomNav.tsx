'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

const items = [
  { href: '/parent/journey', label: 'Jornada', icon: '🌈' },
  { href: '/parent/dashboard', label: 'Início', icon: '🏠' },
  { href: '/parent/therapist', label: 'Mensagens', icon: '💬', badge: 2 },
  { href: '/', label: 'Trocar', icon: '⚙️' },
]

export function ParentBottomNav({ light = false }: { light?: boolean }) {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      aria-label="Navegação inferior"
    >
      <div className="mx-auto max-w-lg relative">
        <Link
          href="/parent/journey"
          className="absolute left-1/2 -translate-x-1/2 -top-7 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cadu-pink to-cadu-coral text-2xl shadow-[0_8px_24px_rgba(236,72,153,0.5)] border-4 border-white/30"
          aria-label="Jornada CADU LIFE"
        >
          🌈
        </Link>
        <div
          className={cn(
            'rounded-[2rem] backdrop-blur-xl px-2 py-2 pt-4 shadow-lg',
            light
              ? 'border border-white/70 bg-white/65 shadow-[0_10px_30px_rgba(120,100,140,0.12)]'
              : 'border border-white/25 bg-white/15',
          )}
        >
          <ul className="flex items-end justify-around">
            {items.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-semibold rounded-xl transition-colors',
                      active
                        ? light
                          ? 'text-cadu-ink'
                          : 'text-white'
                        : light
                          ? 'text-cadu-muted'
                          : 'text-white/65',
                    )}
                  >
                    <span className="relative text-lg">
                      {item.icon}
                      {'badge' in item && item.badge && (
                        <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="parent-bottom-dot"
                        className={cn(
                          'h-1 w-1 rounded-full',
                          light ? 'bg-cadu-coral' : 'bg-white',
                        )}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}

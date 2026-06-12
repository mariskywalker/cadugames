'use client'

import Link from 'next/link'
import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

export interface FloatingIslandProps {
  name: string
  available?: boolean
  href?: string
  left: string
  top: string
  width?: string
  children: ReactNode
}

export function FloatingIsland({
  name,
  available = false,
  href,
  left,
  top,
  width = 'min(72vw, 360px)',
  children,
}: FloatingIslandProps) {
  const className = cn(
    'floating-island',
    available ? 'floating-island--available' : 'floating-island--locked',
  )

  const style = { left, top, width } as const

  const content = (
    <>
      <div className="floating-island-art">{children}</div>
      <span className="island-label">{name}</span>
    </>
  )

  if (available && href) {
    return (
      <Link
        href={href}
        className={className}
        style={style}
        aria-label={`Explorar ${name}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <div className={className} style={style} aria-label={`${name} — em breve`} aria-disabled>
      {content}
    </div>
  )
}

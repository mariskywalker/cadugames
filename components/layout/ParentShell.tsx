'use client'

import { ParentTopNav } from './ParentTopNav'
import { ParentBottomNav } from './ParentBottomNav'
import { DreamscapeBackground } from './DreamscapeBackground'

export function ParentShell({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'light'
}) {
  const isLight = variant === 'light'

  return (
    <div
      className={
        isLight
          ? 'cadu-parent-bg cadu-parent-bg-light text-cadu-ink min-h-dvh relative'
          : 'cadu-parent-bg text-white min-h-dvh relative'
      }
    >
      <DreamscapeBackground light={isLight} />
      <div className="relative z-10 mx-auto max-w-6xl pb-32">
        <ParentTopNav light={isLight} />
        <main className="px-3 md:px-6">{children}</main>
      </div>
      <ParentBottomNav light={isLight} />
    </div>
  )
}

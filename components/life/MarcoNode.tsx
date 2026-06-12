'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

type MarcoNodeVariant = 'world' | 'marco' | 'quest' | 'achievement'

const statusLabel = {
  completed: 'Conquistado',
  available: 'Próximo passo',
  locked: 'Em breve',
  todo: 'Aventura',
  in_progress: 'Em ação',
  done: 'Feito',
} as const

export interface MarcoNodeProps {
  variant: MarcoNodeVariant
  emoji: string
  label: string
  sublabel?: string
  color: string
  status?: 'completed' | 'available' | 'locked' | 'todo' | 'in_progress' | 'done'
  href?: string
  active?: boolean
  index?: number
  onClick?: () => void
}

export function MarcoNode({
  variant,
  emoji,
  label,
  sublabel,
  color,
  status = 'available',
  href,
  active = false,
  index = 0,
  onClick,
}: MarcoNodeProps) {
  const isLocked = status === 'locked'
  const isDone = status === 'completed' || status === 'done'
  const isActive = active || status === 'available' || status === 'in_progress'

  const size =
    variant === 'world' ? 'h-[4.5rem] w-[4.5rem] text-3xl' : 'h-14 w-14 text-2xl'

  const node = (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 220, damping: 18 }}
      className={cn('relative flex flex-col items-center text-center', variant === 'world' && 'w-28')}
    >
      {isActive && !isLocked && (
        <motion.span
          className="absolute inset-0 rounded-full blur-md"
          style={{ backgroundColor: `${color}44` }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
      )}

      <div
        className={cn(
          'relative z-10 flex items-center justify-center rounded-full ring-1 ring-white/70 shadow-[0_8px_22px_rgba(120,100,140,0.14)] transition-transform',
          size,
          isLocked && 'bg-white/40 grayscale opacity-60',
          isDone && 'text-white',
          !isLocked && !isDone && 'bg-white/75 backdrop-blur-md',
          href && 'group-hover:scale-105',
        )}
        style={{
          backgroundColor: isDone ? color : undefined,
          borderWidth: isActive && !isDone ? 2 : 0,
          borderColor: isActive && !isDone ? color : undefined,
        }}
      >
        {isLocked ? '🔒' : emoji}
      </div>

      <p
        className={cn(
          'mt-2 font-semibold leading-tight text-cadu-ink',
          variant === 'world' ? 'text-xs' : 'text-[11px] max-w-[7rem]',
        )}
      >
        {label}
      </p>

      {sublabel && (
        <span
          className="mt-0.5 text-[10px] font-semibold"
          style={{ color: isLocked ? undefined : color }}
        >
          {sublabel}
        </span>
      )}

      {variant === 'marco' && status && !sublabel && (
        <span className="mt-0.5 text-[9px] font-semibold text-cadu-muted">
          {statusLabel[status as keyof typeof statusLabel]}
        </span>
      )}
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} className="group block" onClick={onClick}>
        {node}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button type="button" className="group block" onClick={onClick}>
        {node}
      </button>
    )
  }

  return node
}

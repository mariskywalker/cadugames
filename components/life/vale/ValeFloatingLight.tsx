'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { ValeAction, ValeActionState } from '@/lib/valeHubData'

export function ValeFloatingLight({
  action,
  isCurrent,
  onSelect,
  index,
}: {
  action: ValeAction
  isCurrent: boolean
  onSelect: (id: string) => void
  index: number
}) {
  const visualState: ValeActionState = isCurrent ? 'current' : action.state
  const isLocked = action.state === 'locked'
  const isCompleted = action.state === 'completed'

  return (
    <motion.button
      type="button"
      className={cn(
        'vale-float-light',
        `vale-float-light--${visualState}`,
        `vale-float-light--${action.placement}`,
      )}
      onClick={() => onSelect(action.id)}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: isLocked ? 0.45 : 1,
        scale: 1,
        y: [0, -4, 0],
      }}
      transition={{
        opacity: { delay: index * 0.08, duration: 0.5 },
        scale: { delay: index * 0.08, type: 'spring', stiffness: 180, damping: 16 },
        y: { duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 },
      }}
      aria-label={action.label}
      aria-pressed={isCurrent}
    >
      <span className="vale-float-light-outer" aria-hidden />
      <span className="vale-float-light-mid" aria-hidden />
      <span className="vale-float-light-core" aria-hidden>
        <span className="vale-float-light-emoji">{action.emoji}</span>
      </span>

      {isCompleted && (
        <motion.span
          className="vale-float-light-sparkle"
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          aria-hidden
        >
          ✦
        </motion.span>
      )}

      <span className="vale-float-light-whisper">{action.whisper ?? action.label}</span>
    </motion.button>
  )
}

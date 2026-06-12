'use client'

import { motion } from 'framer-motion'
import type { LifeConquista } from '@/lib/types'

export function ConquistaCard({
  conquista,
  color,
}: {
  conquista: LifeConquista
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white/65 backdrop-blur-md border border-white/70 p-5 shadow-[0_14px_40px_rgba(120,100,140,0.12)]"
      style={{ boxShadow: `0 14px 40px ${color}1a` }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-cadu-muted/80 mb-2">
        Conquista
      </p>
      <div className="flex items-start gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
          style={{ backgroundColor: `${color}22` }}
        >
          {conquista.emoji}
        </span>
        <div>
          <h3 className="text-lg font-bold text-cadu-ink">{conquista.title}</h3>
          <p className="text-sm text-cadu-muted mt-1 leading-relaxed">{conquista.celebration}</p>
        </div>
      </div>
    </motion.div>
  )
}

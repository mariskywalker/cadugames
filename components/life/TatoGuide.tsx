'use client'

import { motion } from 'framer-motion'
import { tato } from '@/lib/lifeData'
import { cn } from '@/lib/cn'

export function TatoGuide({
  message,
  className,
}: {
  message: string
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-end gap-3', className)}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-[#efe0d2] via-[#e7dcec] to-[#dccfe8] text-3xl shadow-[0_8px_22px_rgba(120,100,140,0.18)] ring-1 ring-white/70"
      >
        {tato.avatar}
      </motion.div>
      <div className="relative max-w-md rounded-3xl rounded-bl-md bg-white/70 backdrop-blur-md border border-white/70 shadow-[0_10px_30px_rgba(120,100,140,0.12)] px-4 py-3">
        <p className="text-[11px] font-bold tracking-wide uppercase text-cadu-muted/80">{tato.name}</p>
        <p className="text-[15px] font-medium text-cadu-ink leading-snug">{message}</p>
      </div>
    </motion.div>
  )
}

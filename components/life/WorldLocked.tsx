'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { LifeDimension } from '@/lib/types'
import { tatoLines } from '@/lib/lifeSliceData'
import { TatoGuide } from './TatoGuide'
import { WorldPreviewDiorama } from '@/components/worlds/WorldPreviewDiorama'

export function WorldLocked({ dimension }: { dimension: LifeDimension }) {
  return (
    <div className="space-y-6 pt-2">
      <Link
        href="/child/life"
        className="inline-flex items-center gap-1 text-sm font-bold text-cadu-muted hover:text-cadu-coral transition-colors"
      >
        ← Mapa da jornada
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white/65 backdrop-blur-md border border-white/70 p-8 text-center"
      >
        <span className="text-5xl opacity-40">{dimension.emoji}</span>
        <h1 className="text-xl font-bold text-cadu-ink mt-4">{dimension.worldName}</h1>
        <p className="text-sm text-cadu-muted mt-2 max-w-xs mx-auto">{dimension.tagline}</p>
        <span className="mt-4 inline-block rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-cadu-muted">
          Novo horizonte
        </span>
      </motion.div>

      <TatoGuide message={tatoLines.worldLocked} />

      <WorldPreviewDiorama dimension={dimension} />
    </div>
  )
}

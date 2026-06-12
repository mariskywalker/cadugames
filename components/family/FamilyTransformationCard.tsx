'use client'

import { motion } from 'framer-motion'
import type { FamilyTransformation } from '@/lib/types'
import { GlassCard } from '@/components/ui/GlassCard'

export function FamilyTransformationCard({
  transformation,
  childName,
}: {
  transformation: FamilyTransformation
  childName: string
}) {
  return (
    <section aria-label="Transformação familiar">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-cadu-muted/80 mb-3">
        Transformação familiar
      </h2>
      <GlassCard glow tone="light">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-sm font-bold">{transformation.worldName}</p>
              <p className="text-xs text-cadu-muted">Marco: {transformation.marcoName}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-cadu-muted/80 mb-1">
                O que mudou
              </p>
              <p className="text-sm leading-relaxed">
                {transformation.whatChanged.replace('Lucas', childName)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-cadu-muted/80 mb-1">
                Como observar
              </p>
              <p className="text-sm text-cadu-muted leading-relaxed">
                {transformation.howToObserve}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-cadu-muted/80 mb-1">
                O que isso significa
              </p>
              <p className="text-sm text-cadu-muted leading-relaxed">
                {transformation.whatItMeans.replace(/Lucas/g, childName)}
              </p>
            </div>
          </div>
        </motion.div>
      </GlassCard>
    </section>
  )
}

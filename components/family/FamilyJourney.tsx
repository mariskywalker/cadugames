'use client'

import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { GlassCard } from '@/components/ui/GlassCard'
import {
  getSliceFamilyTransformation,
  lifeConquistas,
  tato,
} from '@/lib/lifeSliceData'
import { FamilyJourneyMap } from './FamilyJourneyMap'
import { FamilyTransformationCard } from './FamilyTransformationCard'

export function FamilyJourney() {
  const { child } = useApp()
  const transformation = getSliceFamilyTransformation()
  const conquista = lifeConquistas.find((c) => c.id === transformation.conquistaId)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-extrabold">A jornada de {child.name}</h1>
        <p className="text-cadu-muted mt-1 leading-relaxed">
          Como {child.name} está participando cada vez mais da vida.
        </p>
      </motion.div>

      <GlassCard glow tone="light">
        <div className="flex items-start gap-3">
          <span className="text-3xl shrink-0">{tato.avatar}</span>
          <p className="text-sm font-bold leading-snug">
            {child.name} está explorando o Vale das Palavras. Uma nova história começou a
            florescer na jornada.
          </p>
        </div>
      </GlassCard>

      <FamilyJourneyMap />

      {conquista && (
        <section aria-label="Conquista recente">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cadu-muted/80 mb-3">
            Conquista recente
          </h2>
          <GlassCard glow tone="light">
            <div className="flex items-start gap-3">
              <span className="text-3xl shrink-0">{conquista.emoji}</span>
              <div>
                <p className="text-sm font-bold">{conquista.title}</p>
                <p className="text-xs text-cadu-muted mt-1 leading-relaxed">
                  {conquista.celebration.replace(/Lucas/g, child.name)}
                </p>
                <span className="mt-2 inline-block text-[10px] font-semibold text-cadu-muted/80">
                  Vale das Palavras
                </span>
              </div>
            </div>
          </GlassCard>
        </section>
      )}

      <FamilyTransformationCard transformation={transformation} childName={child.name} />
    </div>
  )
}

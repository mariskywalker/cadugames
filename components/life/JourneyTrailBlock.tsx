'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { getActiveWorldId, getLifeDimension } from '@/lib/lifeSliceData'
import { childProfile, todayMission, trailConqueredSkills } from '@/lib/mockChildProfile'

export function JourneyTrailBlock() {
  const world = getLifeDimension(getActiveWorldId())

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl bg-white/85 backdrop-blur-md border border-white/70 shadow-cadu p-5 md:p-6"
      aria-label="Onde estamos na jornada"
    >
      <p className="text-xs font-extrabold uppercase tracking-wide text-cadu-muted">
        Onde estamos?
      </p>
      <h2 className="mt-1 text-xl md:text-2xl font-extrabold text-cadu-ink">
        {world?.worldName ?? 'Vale das Palavras'}
      </h2>

      <div className="mt-4">
        <p className="text-sm font-extrabold text-cadu-ink">Você já conquistou:</p>
        <ul className="mt-2 space-y-1.5">
          {trailConqueredSkills.map((skill) => (
            <li key={skill} className="flex items-start gap-2 text-sm font-semibold text-cadu-ink">
              <span className="text-cadu-mint" aria-hidden>
                ✓
              </span>
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 pt-4 border-t border-cadu-cream">
        <p className="text-sm font-extrabold text-cadu-ink">Próxima missão:</p>
        <p className="mt-1 text-base font-extrabold text-cadu-coral">
          {childProfile.currentMission}
        </p>
        <Link
          href={todayMission.ctaHref}
          className="mt-4 inline-block rounded-full bg-cadu-coral px-5 py-2 text-sm font-extrabold text-white shadow-cadu transition-transform hover:-translate-y-0.5"
        >
          Iniciar
        </Link>
      </div>
    </motion.section>
  )
}

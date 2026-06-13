'use client'

import { motion } from 'framer-motion'
import { tatoLines } from '@/lib/lifeSliceData'
import { childProfile } from '@/lib/mockChildProfile'
import { JourneyTrailBlock } from './JourneyTrailBlock'
import { WorldStatusList } from './CurrentGoalCard'
import { TatoGuide } from './TatoGuide'
import { WorldMap } from './WorldMap'

export function LifeDashboard() {
  return (
    <div className="journey-page">
      <div className="journey-sky-background" aria-hidden>
        <span className="journey-cloud journey-cloud-1" />
        <span className="journey-cloud journey-cloud-2" />
        <span className="journey-cloud journey-cloud-3" />
        <span className="journey-mist" />
      </div>

      <div className="journey-content">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-cadu-ink">
            Minha Jornada
          </h1>
          <p className="text-cadu-muted mt-1.5">
            Oi {childProfile.name}, veja onde você está e o que vem a seguir.
          </p>
        </motion.div>

        <JourneyTrailBlock />

        <TatoGuide message={tatoLines.map} />

        <p className="text-sm font-semibold uppercase tracking-wide text-cadu-muted/80 pt-2">
          Mapa dos mundos
        </p>
      </div>

      <WorldMap />

      <div className="journey-content pt-2 pb-8">
        <p className="text-base font-semibold uppercase tracking-wide text-cadu-muted/90">
          Status dos mundos
        </p>
        <WorldStatusList />
      </div>
    </div>
  )
}

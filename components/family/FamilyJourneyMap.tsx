'use client'

import { motion } from 'framer-motion'
import {
  getActiveWorldId,
  getJourneyPathProgress,
  getJourneyWorlds,
  tato,
} from '@/lib/lifeSliceData'
import { buildSmoothPath, getPathLength } from '@/lib/journeyLayout'
import { GlassCard } from '@/components/ui/GlassCard'

export function FamilyJourneyMap() {
  const worlds = getJourneyWorlds()
  const pathPoints = worlds.map((w) => ({ x: w.mapX, y: w.mapY }))
  const pathD = buildSmoothPath(pathPoints)
  const pathLen = getPathLength(pathPoints)
  const pathProgress = getJourneyPathProgress()
  const activeWorld = worlds.find((w) => w.id === getActiveWorldId())

  return (
    <section aria-label="Mapa da jornada">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-cadu-muted/80 mb-3">
        Mapa da jornada
      </h2>
      <GlassCard glow tone="light">
        <p className="text-xs text-cadu-muted mb-3 leading-relaxed">
          {activeWorld
            ? `${activeWorld.worldName} é o território explorado neste momento da jornada.`
            : 'O caminho da jornada se desenha aos poucos.'}
        </p>
        <div className="relative mx-auto w-full" style={{ height: '14rem' }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <path
              d={pathD}
              fill="none"
              stroke="rgba(120,100,140,0.12)"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d={pathD}
              fill="none"
              stroke="rgba(120,100,140,0.4)"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              strokeDasharray={pathLen}
              initial={{ strokeDashoffset: pathLen }}
              animate={{ strokeDashoffset: pathLen * (1 - pathProgress) }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>

          {worlds.map((world) => (
            <div
              key={world.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${world.mapX}%`, top: `${world.mapY}%` }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm ring-1 ring-white/30"
                style={{
                  backgroundColor:
                    world.id === activeWorld?.id
                      ? `${world.color}88`
                      : world.sliceActive
                        ? `${world.color}44`
                        : 'rgba(120,100,140,0.15)',
                  opacity: world.sliceActive ? 1 : 0.45,
                }}
                title={world.worldName}
              >
                {world.emoji}
              </span>
            </div>
          ))}

          {activeWorld && (
            <motion.div
              className="absolute z-20 -translate-x-1/2 -translate-y-full"
              style={{
                left: `${activeWorld.mapX}%`,
                top: `calc(${activeWorld.mapY}% - 1.25rem)`,
              }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/70 text-sm shadow-sm">
                {tato.avatar}
              </span>
            </motion.div>
          )}
        </div>
        {activeWorld && (
          <p className="mt-3 text-xs text-cadu-muted">
            <span className="font-semibold">{tato.name}</span> acompanha a jornada no{' '}
            <span className="font-semibold">{activeWorld.worldName}</span>.
          </p>
        )}
      </GlassCard>
    </section>
  )
}

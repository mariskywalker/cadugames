'use client'

import { motion } from 'framer-motion'
import type { LifeConquista, LifeDimension, LifeMarco } from '@/lib/types'
import { getConquistaForMarco } from '@/lib/lifeSliceData'
import { buildSmoothPath, getMarcoPositions, getPathLength } from '@/lib/journeyLayout'
import { MarcoNode } from './MarcoNode'
import { ConquistaCard } from './ConquistaCard'

export function MarcoJourney({
  dimension,
  marcos,
  conquistas,
}: {
  dimension: LifeDimension
  marcos: LifeMarco[]
  conquistas: LifeConquista[]
}) {
  const positions = getMarcoPositions(marcos.length)
  const pathPoints = positions
  const pathD = buildSmoothPath(pathPoints)
  const pathLen = getPathLength(pathPoints)
  const completedCount = marcos.filter((m) => m.status === 'completed').length
  const pathFill = marcos.length > 0 ? completedCount / marcos.length : 0

  const unlockedConquista = conquistas.find((c) => c.unlocked)

  return (
    <section aria-label={`Trilha de ${dimension.worldName}`}>
      <p className="text-base font-semibold uppercase tracking-wide text-cadu-muted/80 mb-3">
        Trilha dos marcos
      </p>

      <div className="relative mx-auto w-full" style={{ minHeight: '28rem' }}>
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
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <motion.path
            d={pathD}
            fill="none"
            stroke={dimension.color}
            strokeOpacity={0.45}
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={pathLen}
            initial={{ strokeDashoffset: pathLen }}
            animate={{ strokeDashoffset: pathLen * (1 - pathFill) }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>

        {marcos.map((marco, i) => {
          const pos = positions[i] ?? { x: 50, y: 50 }
          const conquista = getConquistaForMarco(marco.id)

          return (
            <div
              key={marco.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <MarcoNode
                variant="marco"
                emoji={marco.emoji}
                label={marco.name}
                sublabel={
                  marco.status === 'completed'
                    ? 'Vivido'
                    : marco.status === 'available'
                      ? 'Próximo passo'
                      : 'Em breve'
                }
                color={dimension.color}
                status={marco.status}
                active={marco.status === 'available'}
                index={i}
              />
              {conquista && marco.status === 'completed' && (
                <motion.div
                  className="absolute left-full top-1/2 ml-3 -translate-y-1/2 hidden sm:block"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold whitespace-nowrap"
                    style={{ backgroundColor: `${dimension.color}22`, color: dimension.color }}
                  >
                    {conquista.emoji} {conquista.title}
                  </span>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {unlockedConquista && (
        <motion.div
          className="mt-6 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-cadu-muted/80">
            O vale celebrou
          </p>
          <ConquistaCard conquista={unlockedConquista} color={dimension.color} />
          <p className="text-xs text-cadu-muted text-center leading-relaxed">
            O mundo mudou — uma marca permanente na jornada.
          </p>
        </motion.div>
      )}
    </section>
  )
}

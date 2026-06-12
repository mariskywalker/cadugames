'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  getConquistasByDimension,
  getLifeDimension,
  getMarcosByDimension,
  getWorldJourneyState,
  getWorldStateLabel,
  isWorldInSlice,
  tatoLines,
} from '@/lib/lifeSliceData'
import { TatoGuide } from './TatoGuide'
import { MarcoJourney } from './MarcoJourney'
import { WorldLocked } from './WorldLocked'
import dynamic from 'next/dynamic'

const ValePalavrasHub = dynamic(
  () => import('./vale/ValePalavrasHub').then((m) => m.ValePalavrasHub),
  {
    ssr: false,
    loading: () => (
      <div className="vale-hub-loading vale-world-loading p-8 text-center text-sm text-cadu-muted">
        O vale está despertando…
      </div>
    ),
  },
)

export function DimensionDetail({ dimensionId }: { dimensionId: string }) {
  const dimension = getLifeDimension(dimensionId)

  if (!dimension) {
    return (
      <div className="pt-10 text-center space-y-4">
        <p className="text-5xl">🧭</p>
        <p className="text-cadu-muted">Este mundo ainda não apareceu no mapa.</p>
        <Link
          href="/child/life"
          className="inline-block rounded-3xl bg-cadu-coral text-white font-semibold px-6 py-3 shadow-cadu"
        >
          Voltar ao mapa
        </Link>
      </div>
    )
  }

  if (!isWorldInSlice(dimension.id)) {
    return <WorldLocked dimension={dimension} />
  }

  const marcos = getMarcosByDimension(dimension.id)
  const conquistas = getConquistasByDimension(dimension.id)
  const worldState = getWorldJourneyState(dimension.id)
  const stateLabel = getWorldStateLabel(worldState)
  const completedMarco = marcos.find((m) => m.status === 'completed')
  const tatoMessage = completedMarco?.tatoLine ?? tatoLines.worldEntry

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
        className="relative overflow-hidden rounded-3xl bg-white/65 backdrop-blur-md border border-white/70 p-5"
        style={{ boxShadow: `0 14px 40px ${dimension.color}1f` }}
      >
        {/* atmosfera do Vale das Palavras — palavras flutuando */}
        {dimension.id === 'comunicacao' && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            {['✦', '◦', '·', '✧', '◦'].map((mark, i) => (
              <motion.span
                key={i}
                className="absolute text-[10px] font-light"
                style={{
                  left: `${12 + i * 18}%`,
                  top: `${8 + (i % 3) * 12}%`,
                  color: `${dimension.color}66`,
                }}
                animate={{ y: [0, -6, 0], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {mark}
              </motion.span>
            ))}
          </div>
        )}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-70"
          style={{
            background: `radial-gradient(120% 90% at 20% -30%, ${dimension.color}33, transparent 70%)`,
          }}
          aria-hidden
        />
        <div className="relative flex items-center gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl text-4xl ring-1 ring-white/60"
            style={{ backgroundColor: `${dimension.color}22` }}
          >
            {dimension.emoji}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-cadu-muted/80">
              Território
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-cadu-ink leading-tight">
              {dimension.worldName}
            </h1>
            <p className="text-sm text-cadu-muted">{dimension.tagline}</p>
            <span
              className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: `${dimension.color}1f`, color: dimension.color }}
            >
              {stateLabel}
            </span>
          </div>
        </div>
      </motion.div>

      <TatoGuide message={dimension.id === 'comunicacao' ? tatoLines.worldEntry : tatoMessage} />

      {dimension.id === 'comunicacao' ? (
        <ValePalavrasHub dimension={dimension} />
      ) : (
        <MarcoJourney dimension={dimension} marcos={marcos} conquistas={conquistas} />
      )}
    </div>
  )
}

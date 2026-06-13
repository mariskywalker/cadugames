'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { loadDailyWorldState, recordInteractionVisit } from '@/lib/worlds/dailyWorldState'
import {
  formatHubPointsExport,
  getWorldInteraction,
  resolveFeedback,
} from '@/lib/worlds/worldInteractions'
import type { WorldId } from '@/lib/worlds/types'
import { useHubPointEditorStore } from '@/store/useHubPointEditorStore'
import { WorldInteractionHotspot } from './WorldInteractionHotspot'
import { WorldInteractionSheet } from './WorldInteractionSheet'

export function WorldInteractionLayer({
  worldId,
  className = '',
  letterOverride,
}: {
  worldId: WorldId
  className?: string
  letterOverride?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hydrate = useHubPointEditorStore((s) => s.hydrate)
  const editorActive = useHubPointEditorStore((s) => s.editorActive)
  const points = useHubPointEditorStore((s) => s.points)
  const selectedId = useHubPointEditorStore((s) => s.selectedId)
  const select = useHubPointEditorStore((s) => s.select)
  const patch = useHubPointEditorStore((s) => s.patch)

  const [activeId, setActiveId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [visited, setVisited] = useState<Set<string>>(new Set())

  useEffect(() => {
    hydrate(worldId)
  }, [hydrate, worldId])

  useEffect(() => {
    const snap = loadDailyWorldState(worldId)
    setVisited(new Set(snap.visitedPointIds))
  }, [worldId])

  const active = activeId ? getWorldInteraction(activeId) : null

  const open = useCallback(
    (id: string) => {
      if (editorActive) return
      setActiveId(id)
      setFeedback(null)
    },
    [editorActive],
  )

  const close = useCallback(() => {
    setActiveId(null)
    setFeedback(null)
  }, [])

  const pick = useCallback(
    (choice: string) => {
      if (!active) return
      const msg = resolveFeedback(active.sheet, choice)
      setFeedback(msg)
      recordInteractionVisit(worldId, active.id, choice)
      setVisited((prev) => new Set(prev).add(active.id))
    },
    [active, worldId],
  )

  const handleMove = useCallback(
    (id: string, x: number, y: number) => {
      patch(id, { x, y })
    },
    [patch],
  )

  if (points.length === 0) return null

  return (
    <div
      ref={containerRef}
      className={`world-interaction-layer${editorActive ? ' world-interaction-layer--editor' : ''} ${className}`.trim()}
      aria-label="Pontos de interação"
    >
      {points.map((point) => (
        <WorldInteractionHotspot
          key={point.id}
          point={point}
          visited={visited.has(point.id)}
          editorMode={editorActive}
          selected={selectedId === point.id}
          containerRef={containerRef}
          onClick={() => open(point.id)}
          onSelect={() => select(point.id)}
          onMove={(x, y) => handleMove(point.id, x, y)}
        />
      ))}

      <AnimatePresence>
        {active && !editorActive && (
          <WorldInteractionSheet
            key={active.id}
            point={active}
            feedback={feedback}
            letterOverride={letterOverride}
            onPick={pick}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

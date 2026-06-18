'use client'

import { useCallback, useEffect, useRef } from 'react'
import { VALE_HOTSPOT_EDITOR_ENABLED } from '@/lib/vale/valeGameplay'
import { VALE_HOTSPOTS } from '@/lib/vale/valeHotspots'
import { useValeHotspotEditorStore } from '@/store/useValeHotspotEditorStore'
import { useValeStore } from '@/store/useValeStore'

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

/** Áreas clicáveis integradas ao cenário — não movem o urso */
export function ValeHotspotLayer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const openSceneHotspot = useValeStore((s) => s.openSceneHotspot)
  const narrativeIntroComplete = useValeStore((s) => s.narrativeIntroComplete)
  const isTraveling = useValeStore((s) => s.isTraveling)
  const interactionPending = useValeStore((s) => s.interactionPending)
  const activeHotspotCardId = useValeStore((s) => s.activeHotspotCardId)

  const editorActive = useValeHotspotEditorStore((s) => s.editorActive)
  const storeHotspots = useValeHotspotEditorStore((s) => s.hotspots)
  const selectedId = useValeHotspotEditorStore((s) => s.selectedId)
  const hydrated = useValeHotspotEditorStore((s) => s.hydrated)
  const hydrate = useValeHotspotEditorStore((s) => s.hydrate)
  const select = useValeHotspotEditorStore((s) => s.select)
  const patchHitArea = useValeHotspotEditorStore((s) => s.patchHitArea)

  useEffect(() => {
    if (VALE_HOTSPOT_EDITOR_ENABLED) hydrate()
  }, [hydrate])

  const hotspots = VALE_HOTSPOT_EDITOR_ENABLED && hydrated ? storeHotspots : VALE_HOTSPOTS

  const handleDrag = useCallback(
    (hotspotId: string, clientX: number, clientY: number) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      patchHitArea(hotspotId, {
        screenX: clamp01((clientX - rect.left) / rect.width),
        screenY: clamp01((clientY - rect.top) / rect.height),
      })
    },
    [patchHitArea],
  )

  const interactionsLocked =
    !narrativeIntroComplete || isTraveling || interactionPending || activeHotspotCardId != null

  return (
    <div
      ref={containerRef}
      className={[
        'vale-world-interactions vale-world-interactions--ui vale-hotspot-layer',
        editorActive ? 'vale-hotspot-layer--editor' : 'vale-hotspot-layer--narrative',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={editorActive ? 'Editor de hotspots do Vale' : 'Locais do Vale'}
    >
      {hotspots.map((hotspot) => {
        const { screenX, screenY, radius } = hotspot.hitArea
        const size = radius * 2
        const selected = editorActive && selectedId === hotspot.id

        return (
          <button
            key={hotspot.id}
            type="button"
            className={[
              'world-interaction-hotspot',
              editorActive ? 'world-interaction-hotspot--editor vale-hotspot-editor-handle' : 'vale-scene-hotspot',
              selected ? 'world-interaction-hotspot--selected vale-hotspot-editor-handle--selected' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              left: `${screenX * 100}%`,
              top: `${screenY * 100}%`,
              width: size,
              height: size,
            }}
            aria-label={hotspot.label}
            disabled={!editorActive && interactionsLocked}
            onPointerDown={(e) => {
              if (!editorActive) return
              e.preventDefault()
              e.stopPropagation()
              select(hotspot.id)

              const onPointerMove = (ev: PointerEvent) => {
                handleDrag(hotspot.id, ev.clientX, ev.clientY)
              }

              const onPointerUp = () => {
                window.removeEventListener('pointermove', onPointerMove)
                window.removeEventListener('pointerup', onPointerUp)
              }

              window.addEventListener('pointermove', onPointerMove)
              window.addEventListener('pointerup', onPointerUp)
              e.currentTarget.setPointerCapture(e.pointerId)
            }}
            onClick={(e) => {
              e.stopPropagation()
              if (editorActive) {
                select(hotspot.id)
                return
              }
              openSceneHotspot(hotspot.id)
            }}
          >
            {editorActive && (
              <span className="vale-hotspot-editor-handle__ring world-interaction-hotspot__ring" aria-hidden />
            )}
            {!editorActive && <span className="vale-scene-hotspot__glow" aria-hidden />}
            {editorActive && (
              <>
                <span className="world-interaction-hotspot__emoji" aria-hidden>
                  {hotspot.emoji}
                </span>
                <span className="world-interaction-hotspot__label">{hotspot.label}</span>
                <span className="vale-hotspot-editor-handle__coords" aria-hidden>
                  {screenX.toFixed(2)}, {screenY.toFixed(2)}
                </span>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}

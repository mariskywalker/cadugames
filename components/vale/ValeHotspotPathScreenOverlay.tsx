'use client'

import { useValeHotspotEditorStore } from '@/store/useValeHotspotEditorStore'
import { useValeHotspotPathDebugStore } from '@/store/useValeHotspotPathDebugStore'

const KIND_CLASS: Record<string, string> = {
  waypoint: 'vale-hotspot-path-screen__dot--waypoint',
  arrive: 'vale-hotspot-path-screen__dot--arrive',
  bear: 'vale-hotspot-path-screen__dot--bear',
  main: 'vale-hotspot-path-screen__dot--main',
  start: 'vale-hotspot-path-screen__dot--start',
  branch: 'vale-hotspot-path-screen__dot--branch',
}

/** Overlay 2D — path 3D projetado na tela + arriveTarget + urso */
export function ValeHotspotPathScreenOverlay() {
  const editorActive = useValeHotspotEditorStore((s) => s.editorActive)
  const projection = useValeHotspotPathDebugStore((s) => s.projection)

  if (!editorActive || !projection.hotspotId) return null

  return (
    <svg
      className="vale-hotspot-path-screen"
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      aria-hidden
    >
      {projection.segments.map((seg, i) => (
        <line
          key={`seg-${i}`}
          className="vale-hotspot-path-screen__line"
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {projection.points.map((point, i) => (
        <g
          key={`pt-${i}-${point.kind}-${point.label ?? ''}`}
          className={`vale-hotspot-path-screen__dot ${KIND_CLASS[point.kind] ?? ''}${
            point.selected ? ' vale-hotspot-path-screen__dot--selected' : ''
          }`}
          transform={`translate(${point.x} ${point.y})`}
        >
          <circle
            r={
              point.selected
                ? 0.013
                : point.kind === 'bear'
                  ? 0.012
                  : point.label === '★'
                    ? 0.011
                    : 0.008
            }
          />
          {point.label && (
            <text
              className="vale-hotspot-path-screen__label"
              y={point.kind === 'bear' ? -0.018 : -0.014}
              textAnchor="middle"
            >
              {point.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

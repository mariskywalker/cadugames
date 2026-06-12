import { useCallback, useEffect, useMemo, useState } from 'react'
import { MAP_HOTSPOTS } from './hotspots'
import { WaterLayer } from './WaterLayer'
import { useCADUStore } from '../../store/useCADUStore'
import './interactive-map.css'

// ─── Replace these paths when you drop final art into /public/interactive-map/ ───
const ASSETS = {
  background: '/interactive-map/background.svg',
  foreground: '/interactive-map/foreground.svg',
}

const PARALLAX = {
  background: 6,
  water: 10,
  foreground: 14,
  hotspots: 18,
}

function useParallax(enabled) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return undefined

    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      setOffset({ x: nx, y: ny })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled])

  return enabled ? offset : { x: 0, y: 0 }
}

function layerTransform(offset, depth, reducedMotion) {
  if (reducedMotion) return undefined
  return {
    transform: `translate3d(${offset.x * depth}px, ${offset.y * depth * 0.6}px, 0)`,
  }
}

/**
 * Reusable 2.5D interactive map scene (illustrated layers + hotspots).
 */
export function InteractiveMapScene({ showGrid: showGridProp, onHotspotActivate }) {
  const showMapGrid = useCADUStore((s) => s.showMapGrid)
  const toggleMapGrid = useCADUStore((s) => s.toggleMapGrid)
  const setViewMode = useCADUStore((s) => s.setViewMode)

  const showGrid = showGridProp ?? showMapGrid
  const [toast, setToast] = useState(null)

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const parallaxOn = !reducedMotion
  const offset = useParallax(parallaxOn)

  const handleHotspot = useCallback(
    (spot) => {
      onHotspotActivate?.(spot)

      const messages = {
        info: `ℹ️ ${spot.label}`,
        action: `✨ ${spot.label}`,
        navigation: `→ ${spot.label}`,
      }
      setToast(messages[spot.type] ?? spot.label)
      window.setTimeout(() => setToast(null), 2400)
    },
    [onHotspotActivate, setViewMode],
  )

  return (
    <div className="interactive-map" aria-label="Mapa interativo CADU">
      <div className="interactive-map__toolbar">
        <span className="interactive-map__chip">sensory_room_01</span>
        <button
          type="button"
          className={`interactive-map__chip ${showGrid ? 'interactive-map__chip--active' : ''}`}
          onClick={toggleMapGrid}
        >
          Grid {showGrid ? 'on' : 'off'}
        </button>
        <button type="button" className="interactive-map__chip" onClick={() => setViewMode('3d')}>
          Cena 3D
        </button>
      </div>

      <div className="interactive-map__stage">
        {/* Static illustrated background — no water motion here */}
        <div
          className="interactive-map__layer interactive-map__layer--bg"
          style={layerTransform(offset, PARALLAX.background, !parallaxOn)}
        >
          <img src={ASSETS.background} alt="" draggable={false} decoding="async" />
        </div>

        {/* Masked water: video + shimmer only inside shoreline clip-path */}
        <WaterLayer
          layerStyle={layerTransform(offset, PARALLAX.water, !parallaxOn)}
          reducedMotion={reducedMotion}
        />

        <div
          className="interactive-map__layer interactive-map__layer--fg"
          style={layerTransform(offset, PARALLAX.foreground, !parallaxOn)}
        >
          <img src={ASSETS.foreground} alt="" draggable={false} decoding="async" />
        </div>

        <div
          className="interactive-map__layer interactive-map__hotspots"
          style={layerTransform(offset, PARALLAX.hotspots, !parallaxOn)}
        >
          {MAP_HOTSPOTS.map((spot) => (
            <button
              key={spot.id}
              type="button"
              className="interactive-map__hotspot"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-label={spot.label}
              onClick={() => handleHotspot(spot)}
            >
              <span className="interactive-map__hotspot-ring" aria-hidden />
              <span className="interactive-map__hotspot-label">{spot.label}</span>
            </button>
          ))}
        </div>

        {showGrid && <div className="interactive-map__grid" aria-hidden />}
      </div>

      {toast && (
        <div className="interactive-map__toast" role="status">
          {toast}
        </div>
      )}
    </div>
  )
}

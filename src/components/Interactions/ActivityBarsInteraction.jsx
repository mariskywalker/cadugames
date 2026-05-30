import { Html } from '@react-three/drei'
import { useEffect } from 'react'
import { useActivityBarsInteraction } from '../../hooks/useActivityBarsInteraction'
import { useCADUStore } from '../../store/useCADUStore'

export function ActivityBarsReward({ rewardY = 1.2 }) {
  const dismissActivityBarsReward = useCADUStore((s) => s.dismissActivityBarsReward)

  useEffect(() => {
    const t = window.setTimeout(() => dismissActivityBarsReward(), 2600)
    return () => window.clearTimeout(t)
  }, [dismissActivityBarsReward])

  return (
    <Html center position={[0, rewardY, 0]} distanceFactor={8} zIndexRange={[90, 0]}>
      <div className="activity-bars-reward" role="status" aria-live="polite">
        <span className="activity-bars-reward__star" aria-hidden>
          ★
        </span>
        <span className="activity-bars-reward__label">Muito bem!</span>
      </div>
    </Html>
  )
}

/**
 * Orquestra approach, orientação e sequência das barras.
 * Montar no CharacterController (substitui useBarAnimations).
 */
export function ActivityBarsInteraction(props) {
  useActivityBarsInteraction(props)
  return null
}

export { useActivityBarsInteraction, isBarAnimActive } from '../../hooks/useActivityBarsInteraction'

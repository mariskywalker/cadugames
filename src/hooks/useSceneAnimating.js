import { useEffect, useState } from 'react'
import { useCADUStore } from '../store/useCADUStore'

/**
 * True when 3D scene should run ambient animations (visible tab + 3d mode).
 */
export function useSceneAnimating() {
  const viewMode = useCADUStore((s) => s.viewMode)
  const [tabVisible, setTabVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  )

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return viewMode === '3d' && tabVisible
}

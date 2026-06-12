'use client'

import { useEffect, useState } from 'react'

/** True when the 3D scene should run ambient animations (visible tab). */
export function useSceneAnimating() {
  const [tabVisible, setTabVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  )

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return tabVisible
}

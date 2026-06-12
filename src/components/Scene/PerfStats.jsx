import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useCADUStore } from '../../store/useCADUStore'

export function PerfStats() {
  const setFps = useCADUStore((s) => s.setFps)
  const accRef = useRef({
    frames: 0,
    elapsed: 0,
    lastReport: 0,
    emaFps: null,
  })

  useFrame((state, delta) => {
    const acc = accRef.current
    acc.frames += 1
    acc.elapsed += delta

    // report ~4x/sec to avoid spamming Zustand
    if (state.clock.elapsedTime - acc.lastReport < 0.25) return

    const instantFps = acc.elapsed > 0 ? acc.frames / acc.elapsed : null
    acc.frames = 0
    acc.elapsed = 0
    acc.lastReport = state.clock.elapsedTime

    if (instantFps == null) return
    const next = acc.emaFps == null ? instantFps : acc.emaFps * 0.8 + instantFps * 0.2
    acc.emaFps = next
    setFps(next)
  })

  return null
}


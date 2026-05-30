import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Subtle pointer parallax (premium, not exaggerated).
 */
export function useParallaxPointer(maxShift = 16) {
  const rootRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const frameRef = useRef(0)

  const apply = useCallback(
    (xNorm, yNorm) => {
      setOffset({
        x: xNorm * maxShift,
        y: yNorm * maxShift,
      })
    },
    [maxShift],
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const onMove = (event) => {
      const rect = root.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const xNorm = (event.clientX - rect.left) / rect.width - 0.5
      const yNorm = (event.clientY - rect.top) / rect.height - 0.5
      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => apply(xNorm, yNorm))
    }

    const onLeave = () => {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => apply(0, 0))
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    return () => {
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frameRef.current)
    }
  }, [apply])

  return { rootRef, offset }
}

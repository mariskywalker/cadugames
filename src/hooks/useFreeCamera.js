import { useEffect } from 'react'
import { useCADUStore } from '../store/useCADUStore'

/** Tecla C alterna câmera livre; ?cam=1 ativa ao carregar. */
export function useFreeCamera() {
  const viewMode = useCADUStore((s) => s.viewMode)
  const freeCameraMode = useCADUStore((s) => s.freeCameraMode)
  const setFreeCameraMode = useCADUStore((s) => s.setFreeCameraMode)
  const toggleFreeCameraMode = useCADUStore((s) => s.toggleFreeCameraMode)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('cam') === '1' || params.get('freecam') === '1') {
      setFreeCameraMode(true)
    }
    if (params.get('cam') === '0') {
      setFreeCameraMode(false)
    }
  }, [setFreeCameraMode])

  useEffect(() => {
    if (viewMode !== '3d') return

    const onKey = (e) => {
      if (e.key !== 'c' && e.key !== 'C') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return
      e.preventDefault()
      toggleFreeCameraMode()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewMode, toggleFreeCameraMode])

  useEffect(() => {
    document.body.classList.toggle('cadu-free-camera-active', freeCameraMode && viewMode === '3d')
    return () => document.body.classList.remove('cadu-free-camera-active')
  }, [freeCameraMode, viewMode])
}

import { useEffect } from 'react'
import { useCADUStore } from '../store/useCADUStore'

/**
 * Ativa modo marcação via ?pick=1 ou ?layout=1 e tecla L para alternar.
 */
export function useScenePickMode() {
  const viewMode = useCADUStore((s) => s.viewMode)
  const scenePickMode = useCADUStore((s) => s.scenePickMode)
  const toggleScenePickMode = useCADUStore((s) => s.toggleScenePickMode)
  const setScenePickMode = useCADUStore((s) => s.setScenePickMode)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('pick') === '1' || params.get('layout') === '1') {
      setScenePickMode(true)
    }
  }, [setScenePickMode])

  useEffect(() => {
    if (viewMode !== '3d') return

    const onKey = (e) => {
      if (e.key !== 'l' && e.key !== 'L') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return
      e.preventDefault()
      toggleScenePickMode()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewMode, toggleScenePickMode])

  useEffect(() => {
    document.body.classList.toggle('cadu-scene-pick-active', scenePickMode && viewMode === '3d')
    return () => document.body.classList.remove('cadu-scene-pick-active')
  }, [scenePickMode, viewMode])
}

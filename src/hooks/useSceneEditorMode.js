import { useEffect } from 'react'
import { useCADUStore } from '../store/useCADUStore'

/**
 * Editor de layout 3D — ?edit=1 ou tecla G.
 * W = mover | E = rotacionar | R = escalar
 */
export function useSceneEditorMode() {
  const viewMode = useCADUStore((s) => s.viewMode)
  const sceneEditorMode = useCADUStore((s) => s.sceneEditorMode)
  const setSceneEditorMode = useCADUStore((s) => s.setSceneEditorMode)
  const toggleSceneEditorMode = useCADUStore((s) => s.toggleSceneEditorMode)
  const setSceneEditorTransformMode = useCADUStore((s) => s.setSceneEditorTransformMode)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('edit') === '1' || params.get('editor') === '1') {
      setSceneEditorMode(true)
    }
  }, [setSceneEditorMode])

  useEffect(() => {
    if (viewMode !== '3d') return

    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return

      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault()
        toggleSceneEditorMode()
        return
      }

      if (!sceneEditorMode) return

      if (e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        setSceneEditorTransformMode('translate')
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        setSceneEditorTransformMode('rotate')
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        setSceneEditorTransformMode('scale')
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewMode, sceneEditorMode, toggleSceneEditorMode, setSceneEditorTransformMode])

  useEffect(() => {
    document.body.classList.toggle('cadu-scene-editor-active', sceneEditorMode && viewMode === '3d')
    return () => document.body.classList.remove('cadu-scene-editor-active')
  }, [sceneEditorMode, viewMode])
}

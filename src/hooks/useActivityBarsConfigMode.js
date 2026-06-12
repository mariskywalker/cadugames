import { useEffect } from 'react'
import { useCADUStore } from '../store/useCADUStore'

/**
 * Editor visual da interação das barras — ?bars=1 ou tecla B.
 */
export function useActivityBarsConfigMode() {
  const viewMode = useCADUStore((s) => s.viewMode)
  const editMode = useCADUStore((s) => s.activityBarsEditMode)
  const setActivityBarsEditMode = useCADUStore((s) => s.setActivityBarsEditMode)
  const toggleActivityBarsEditMode = useCADUStore((s) => s.toggleActivityBarsEditMode)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('bars') === '1' || params.get('barsEdit') === '1') {
      setActivityBarsEditMode(true)
    }
  }, [setActivityBarsEditMode])

  useEffect(() => {
    if (viewMode !== '3d') return

    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return

      const st = useCADUStore.getState()
      if (st.sceneEditorMode || st.scenePickMode) return

      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault()
        toggleActivityBarsEditMode()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewMode, toggleActivityBarsEditMode])

  useEffect(() => {
    document.body.classList.toggle('cadu-bars-editor-active', editMode && viewMode === '3d')
    return () => document.body.classList.remove('cadu-bars-editor-active')
  }, [editMode, viewMode])
}

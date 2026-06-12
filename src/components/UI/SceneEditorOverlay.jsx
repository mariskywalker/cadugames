import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SCENE_EDITOR_OBJECTS } from '../../constants/sceneEditorRegistry'
import { useSceneObjectTransform } from '../../hooks/useSceneObjectTransform'
import { useCADUStore } from '../../store/useCADUStore'

const PANEL_STORAGE_KEY = 'cadu.scene.editor.panel'
const PANEL_WIDTH = 352

function loadPanelState() {
  try {
    const raw = localStorage.getItem(PANEL_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (typeof data?.x !== 'number' || typeof data?.y !== 'number') return null
    return {
      x: data.x,
      y: data.y,
      collapsed: data.collapsed === true,
    }
  } catch {
    return null
  }
}

function savePanelState(state) {
  try {
    localStorage.setItem(PANEL_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

function defaultPanelPosition() {
  if (typeof window === 'undefined') return { x: 16, y: 72 }
  return {
    x: Math.max(12, window.innerWidth - PANEL_WIDTH - 20),
    y: 72,
  }
}

function clampPanelPosition(x, y) {
  if (typeof window === 'undefined') return { x, y }
  const maxX = Math.max(12, window.innerWidth - PANEL_WIDTH - 12)
  const maxY = Math.max(12, window.innerHeight - 48)
  return {
    x: Math.min(Math.max(12, x), maxX),
    y: Math.min(Math.max(12, y), maxY),
  }
}

function useFloatingPanel() {
  const [pos, setPos] = useState(() => {
    const stored = loadPanelState()
    if (stored) return clampPanelPosition(stored.x, stored.y)
    const d = defaultPanelPosition()
    return clampPanelPosition(d.x, d.y)
  })
  const [collapsed, setCollapsed] = useState(() => loadPanelState()?.collapsed ?? false)
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef(null)

  useEffect(() => {
    savePanelState({ x: pos.x, y: pos.y, collapsed })
  }, [pos, collapsed])

  useEffect(() => {
    const onResize = () => setPos((p) => clampPanelPosition(p.x, p.y))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onHeaderPointerDown = useCallback(
    (e) => {
      if (e.button !== 0 || e.target.closest('button')) return
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: pos.x,
        origY: pos.y,
      }
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [pos.x, pos.y],
  )

  const onHeaderPointerMove = useCallback((e) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setPos(clampPanelPosition(dragRef.current.origX + dx, dragRef.current.origY + dy))
  }, [])

  const onHeaderPointerUp = useCallback((e) => {
    dragRef.current = null
    setDragging(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }, [])

  return {
    pos,
    collapsed,
    dragging,
    setCollapsed,
    onHeaderPointerDown,
    onHeaderPointerMove,
    onHeaderPointerUp,
  }
}

function TransformReadout({ objectId, defaults }) {
  const transform = useSceneObjectTransform(objectId, defaults)
  return (
    <code className="scene-editor-panel__values">
      pos [{transform.position.map((n) => n.toFixed(2)).join(', ')}]
      <br />
      rot [{transform.rotation.map((n) => n.toFixed(3)).join(', ')}]
      <br />
      scl [{transform.scale.map((n) => n.toFixed(3)).join(', ')}]
    </code>
  )
}

export function SceneEditorOverlay() {
  const sceneEditorMode = useCADUStore((s) => s.sceneEditorMode)
  const selectedEditorObjectId = useCADUStore((s) => s.selectedEditorObjectId)
  const sceneEditorTransformMode = useCADUStore((s) => s.sceneEditorTransformMode)
  const sceneEditorMessage = useCADUStore((s) => s.sceneEditorMessage)
  const setSelectedEditorObject = useCADUStore((s) => s.setSelectedEditorObject)
  const setSceneEditorTransformMode = useCADUStore((s) => s.setSceneEditorTransformMode)
  const setSceneEditorMode = useCADUStore((s) => s.setSceneEditorMode)
  const copyEditorExport = useCADUStore((s) => s.copyEditorExport)
  const resetEditorObject = useCADUStore((s) => s.resetEditorObject)
  const resetAllEditorOverrides = useCADUStore((s) => s.resetAllEditorOverrides)

  const {
    pos,
    collapsed,
    dragging,
    setCollapsed,
    onHeaderPointerDown,
    onHeaderPointerMove,
    onHeaderPointerUp,
  } = useFloatingPanel()

  const selected = useMemo(
    () => SCENE_EDITOR_OBJECTS.find((o) => o.id === selectedEditorObjectId) ?? SCENE_EDITOR_OBJECTS[0],
    [selectedEditorObjectId],
  )

  if (!sceneEditorMode) return null

  return (
    <div
      className={`scene-editor-panel${collapsed ? ' is-collapsed' : ''}${dragging ? ' is-dragging' : ''}`}
      style={{ left: pos.x, top: pos.y }}
      role="dialog"
      aria-label="Editor de cena 3D"
    >
      <div
        className="scene-editor-panel__chrome"
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
        onPointerCancel={onHeaderPointerUp}
      >
        <span className="scene-editor-panel__title">Editor de cena</span>
        <div className="scene-editor-panel__window-actions">
          <button
            type="button"
            className="scene-editor-panel__icon-btn"
            aria-label={collapsed ? 'Expandir painel' : 'Minimizar painel'}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? '□' : '—'}
          </button>
          <button
            type="button"
            className="scene-editor-panel__icon-btn scene-editor-panel__icon-btn--close"
            aria-label="Fechar editor"
            onClick={() => setSceneEditorMode(false)}
          >
            ×
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="scene-editor-panel__body">
          <p className="scene-editor-panel__hint">
            Arraste pela barra superior. Gizmo + atalhos W/E/R.
          </p>

          <div className="scene-editor-panel__objects">
            {SCENE_EDITOR_OBJECTS.map((obj) => (
              <button
                key={obj.id}
                type="button"
                className={`scene-editor-panel__obj${selected?.id === obj.id ? ' is-active' : ''}`}
                onClick={() => setSelectedEditorObject(obj.id)}
              >
                {obj.label}
              </button>
            ))}
          </div>

          <div className="scene-editor-panel__modes">
            {[
              ['translate', 'Mover (W)'],
              ['rotate', 'Rotacionar (E)'],
              ['scale', 'Escalar (R)'],
            ].map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                className={`scene-editor-panel__mode${sceneEditorTransformMode === mode ? ' is-active' : ''}`}
                onClick={() => setSceneEditorTransformMode(mode)}
              >
                {label}
              </button>
            ))}
          </div>

          {selected && (
            <div className="scene-editor-panel__readout">
              <span className="scene-editor-panel__readout-label">{selected.label}</span>
              <TransformReadout objectId={selected.id} defaults={selected.defaults} />
            </div>
          )}

          {sceneEditorMessage && <p className="scene-editor-panel__msg">{sceneEditorMessage}</p>}

          <div className="scene-editor-panel__actions">
            <button type="button" className="scene-editor-panel__btn" onClick={() => copyEditorExport()}>
              Copiar valores
            </button>
            <button
              type="button"
              className="scene-editor-panel__btn scene-editor-panel__btn--ghost"
              onClick={() => resetEditorObject(selected?.id)}
            >
              Reset objeto
            </button>
            <button
              type="button"
              className="scene-editor-panel__btn scene-editor-panel__btn--ghost"
              onClick={() => resetAllEditorOverrides()}
            >
              Reset tudo
            </button>
          </div>

          <ul className="scene-editor-panel__keys">
            <li>
              <kbd>G</kbd> fechar · <kbd>W</kbd>/<kbd>E</kbd>/<kbd>R</kbd> gizmo
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

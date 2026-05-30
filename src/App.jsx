import { lazy, Suspense, useEffect, useState } from 'react'
import { LandingScreen } from './components/UI/LandingScreen'
import { HUD } from './components/UI/HUD'
import { ScenePickOverlay } from './components/UI/ScenePickOverlay'
import { SceneEditorOverlay } from './components/UI/SceneEditorOverlay'
import { ActivityBarsConfigOverlay } from './components/UI/ActivityBarsConfigOverlay'
import { CameraControlsBar } from './components/UI/CameraControlsBar'
import { CharacterAnimationPanel } from './components/UI/CharacterAnimationPanel'
import { useScenePickMode } from './hooks/useScenePickMode'
import { useSceneEditorMode } from './hooks/useSceneEditorMode'
import { useActivityBarsConfigMode } from './hooks/useActivityBarsConfigMode'
import { useFreeCamera } from './hooks/useFreeCamera'
import { useCADUStore } from './store/useCADUStore'
import { ROOM_STUDIO_GRADIENT_CSS } from './constants/roomBackdrop'
import { AnimationClipTester } from './components/Debug/AnimationClipTester'
import './components/UI/cadu-ui.css'
import './components/UI/scene-hotspots.css'
import './components/UI/scene-pick.css'
import './components/UI/character-animation-panel.css'
import './components/Debug/animation-clip-tester.css'
import './components/UI/scene-editor.css'
import './components/UI/activity-bars-config-editor.css'

const Scene = lazy(() =>
  import('./components/Scene/Scene').then((m) => ({ default: m.Scene })),
)
const InteractiveMapScene = lazy(() =>
  import('./components/InteractiveMap/InteractiveMapScene').then((m) => ({
    default: m.InteractiveMapScene,
  })),
)

export default function App() {
  const viewMode = useCADUStore((s) => s.viewMode)
  const scenePickMode = useCADUStore((s) => s.scenePickMode)
  const sceneEditorMode = useCADUStore((s) => s.sceneEditorMode)
  const activityBarsEditMode = useCADUStore((s) => s.activityBarsEditMode)
  const inRoom = viewMode === '3d' || viewMode === 'map'
  const [clipTesterMode] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('cliptest') === '1'
  })

  useScenePickMode()
  useSceneEditorMode()
  useActivityBarsConfigMode()
  useFreeCamera()

  useEffect(() => {
    useCADUStore.getState().resetToIdle()
    useCADUStore.getState().setDebug(false)
  }, [])

  if (clipTesterMode && viewMode === '3d') {
    return (
      <div className="cadu-app cadu-app--raw-clips">
        <AnimationClipTester />
      </div>
    )
  }

  return (
    <div
      className={`cadu-app${scenePickMode && viewMode === '3d' ? ' cadu-app--pick-mode' : ''}${sceneEditorMode && viewMode === '3d' ? ' cadu-app--editor-mode' : ''}${activityBarsEditMode && viewMode === '3d' ? ' cadu-app--bars-editor-mode' : ''}`}
    >
      <div
        className={`cadu-app__world${inRoom ? ' cadu-app__world--entering' : ''}`}
        aria-hidden={viewMode === 'landing'}
      >
        {viewMode === 'landing' && <LandingScreen />}
        {viewMode === 'map' && (
          <Suspense fallback={null}>
            <InteractiveMapScene />
          </Suspense>
        )}
        {viewMode === '3d' && (
          <>
            <div
              className="cadu-room-studio-bg"
              style={{ background: ROOM_STUDIO_GRADIENT_CSS }}
              aria-hidden
            />
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </>
        )}
      </div>
      {inRoom && (
        <div
          className={`cadu-app__vignette${viewMode === '3d' ? ' cadu-app__vignette--studio' : ''}`}
          aria-hidden
        />
      )}
      {inRoom && !scenePickMode && !sceneEditorMode && !activityBarsEditMode && <HUD />}
      {viewMode === '3d' && <ScenePickOverlay />}
      {viewMode === '3d' && <SceneEditorOverlay />}
      {viewMode === '3d' && <ActivityBarsConfigOverlay />}
      {viewMode === '3d' && !sceneEditorMode && !activityBarsEditMode && <CharacterAnimationPanel />}
      {viewMode === '3d' && !sceneEditorMode && !activityBarsEditMode && <CameraControlsBar />}
    </div>
  )
}

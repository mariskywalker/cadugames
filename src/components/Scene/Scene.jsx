import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { NavMeshFloor } from './NavMeshFloor'
import { ScenePickTool } from './ScenePickTool'
import { SceneEditorGizmo } from './SceneEditorGizmo'
import { ActivityBarsConfigEditor } from './debug/ActivityBarsConfigEditor'
import { ActivityBarsDebugMarkers } from './debug/ActivityBarsDebugMarkers'
import { ActivityBarsCharacterGizmo } from './debug/ActivityBarsCharacterGizmo'
import { FixedRoomCamera } from './FixedRoomCamera'
import { CaptureCameraOnLock } from './CaptureCameraOnLock'
import { Lights } from './Lights'
import { PerfStats } from './PerfStats'
import { LayeredRoomScene } from './LayeredRoomScene'
import { useCADUStore } from '../../store/useCADUStore'
import {
  CAMERA_STORAGE_KEY,
  DEFAULT_CAMERA_FOV,
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_TARGET,
} from '../../constants/scene'
import { ROOM_STUDIO_GRADIENT } from '../../constants/roomBackdrop'

function DebugCameraControls({ controlsRef }) {
  const { camera } = useThree()
  const persistCameraView = useCADUStore((s) => s.persistCameraView)
  const cameraSaveTick = useCADUStore((s) => s.cameraSaveTick)

  const defaultTarget = useMemo(
    () => new THREE.Vector3(...DEFAULT_CAMERA_TARGET),
    [],
  )

  useEffect(() => {
    camera.position.set(...DEFAULT_CAMERA_POSITION)
    defaultTarget.set(...DEFAULT_CAMERA_TARGET)
    camera.fov = DEFAULT_CAMERA_FOV
    camera.updateProjectionMatrix()
  }, [camera, defaultTarget])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    controls.target.copy(defaultTarget)
    controls.update()

    const persist = () => {
      persistCameraView(
        [camera.position.x, camera.position.y, camera.position.z],
        [controls.target.x, controls.target.y, controls.target.z],
      )
    }
    controls.addEventListener('end', persist)
    return () => controls.removeEventListener('end', persist)
  }, [camera, controlsRef, defaultTarget, persistCameraView])

  useEffect(() => {
    if (!cameraSaveTick) return
    const controls = controlsRef.current
    if (!controls) return
    persistCameraView(
      [camera.position.x, camera.position.y, camera.position.z],
      [controls.target.x, controls.target.y, controls.target.z],
    )
  }, [cameraSaveTick, camera, controlsRef, persistCameraView])

  return null
}

function FreeCameraControls({ controlsRef }) {
  const markedCamera = useCADUStore((s) => s.markedCamera)
  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan
      enableZoom
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.5}
      zoomSpeed={0.9}
      panSpeed={0.7}
      minDistance={2.8}
      maxDistance={22}
      maxPolarAngle={Math.PI * 0.52}
      target={markedCamera.target}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
      touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
    />
  )
}

export function Scene() {
  const debug = useCADUStore((s) => s.debug)
  const scenePickMode = useCADUStore((s) => s.scenePickMode)
  const sceneEditorMode = useCADUStore((s) => s.sceneEditorMode)
  const activityBarsEditMode = useCADUStore((s) => s.activityBarsEditMode)
  const freeCameraMode = useCADUStore((s) => s.freeCameraMode)
  const markedCamera = useCADUStore((s) => s.markedCamera)
  const freeCamera = debug || scenePickMode || freeCameraMode || sceneEditorMode || activityBarsEditMode
  const controlsRef = useRef()
  const clearTarget = useCADUStore((s) => s.clearTarget)
  const resetToIdle = useCADUStore((s) => s.resetToIdle)

  useEffect(() => {
    clearTarget()
    resetToIdle()
  }, [clearTarget, resetToIdle])

  return (
    <Canvas
      className="cadu-scene__canvas"
      dpr={[1, 1.5]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{
        position: markedCamera.position,
        fov: markedCamera.fov,
        near: 0.1,
        far: 120,
      }}
      onContextMenu={(e) => e.preventDefault()}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0)
        scene.background = null
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.02
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}
    >
      <Lights />
      <LayeredRoomScene fixedCamera={!freeCamera} />
      <NavMeshFloor />
      <ScenePickTool />
      <SceneEditorGizmo controlsRef={controlsRef} />
      <ActivityBarsConfigEditor controlsRef={controlsRef} />
      <ActivityBarsDebugMarkers />
      <ActivityBarsCharacterGizmo controlsRef={controlsRef} />
      <ContactShadows
        position={[0, 0.01, 1.15]}
        opacity={0.1}
        scale={12}
        blur={3.2}
        far={4.2}
        color={ROOM_STUDIO_GRADIENT.start}
      />
      {debug && <PerfStats />}
      <CaptureCameraOnLock />
      <FixedRoomCamera enabled={!freeCamera} />

      {freeCamera && (
        <>
          {debug && <DebugCameraControls controlsRef={controlsRef} />}
          <FreeCameraControls controlsRef={controlsRef} />
        </>
      )}
    </Canvas>
  )
}

import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { useCADUStore } from '../../../store/useCADUStore'
import { logBarsClick } from '../../../utils/activityBarsDebug'

function distXZ(a, b) {
  const dx = a[0] - b[0]
  const dz = a[2] - b[2]
  return Math.hypot(dx, dz)
}

function triggerBarsInteraction() {
  const st = useCADUStore.getState()
  if (st.playerControlLocked && st.activityBarsPhase && st.activityBarsPhase !== 'approach') return
  try {
    logBarsClick(st.activityBarsConfig)
    st.startActivityBarsInteraction()
  } catch (err) {
    console.error(err)
    st.setAnimationError(err.message)
  }
}

function ClickableMarker({ position, color, hitRadius, visualRadius, active }) {
  const [hovered, setHovered] = useState(false)
  const scale = active || hovered ? 1.18 : 1
  const opacity = active || hovered ? 0.95 : 0.72

  return (
    <group position={position} scale={scale}>
      <mesh
        renderOrder={998}
        onPointerDown={(e) => {
          if (e.button !== 0) return
          e.stopPropagation()
          triggerBarsInteraction()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          setHovered(true)
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
          setHovered(false)
        }}
      >
        <sphereGeometry args={[hitRadius, 20, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh renderOrder={997}>
        <sphereGeometry args={[visualRadius, 16, 12]} />
        <meshBasicMaterial color={color} depthTest={false} transparent opacity={opacity} />
      </mesh>

      {(active || hovered) && (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]} renderOrder={996}>
          <ringGeometry args={[hitRadius * 0.72, hitRadius * 0.95, 32]} />
          <meshBasicMaterial color={color} depthTest={false} transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  )
}

/**
 * Marcadores clicáveis — mesmos valores de activityBarsConfig usados pela interação.
 */
export function ActivityBarsDebugMarkers() {
  const config = useCADUStore((s) => s.activityBarsConfig)
  const activityBarsEditMode = useCADUStore((s) => s.activityBarsEditMode)
  const charPos = useCADUStore((s) => s.characterWorldPosition)
  const activityBarsPhase = useCADUStore((s) => s.activityBarsPhase)

  const { hotspotPosition, interactionPoint, faceTarget, animationAnchor } = config
  const anchorPos = animationAnchor?.position ?? interactionPoint

  const nearInteraction = useMemo(
    () => distXZ(charPos, interactionPoint) < 3.8,
    [charPos, interactionPoint],
  )
  const markersActive = nearInteraction || activityBarsPhase === 'approach' || !activityBarsPhase

  const lookArrow = useMemo(() => {
    const from = new THREE.Vector3(...interactionPoint)
    const to = new THREE.Vector3(...faceTarget)
    const dir = to.clone().sub(from)
    const length = Math.min(dir.length(), 1.45)
    if (length < 0.05) return null
    dir.normalize()
    return new THREE.ArrowHelper(dir, from, length, 0x38bdf8, 0.18, 0.12)
  }, [interactionPoint, faceTarget])

  const anchorArrow = useMemo(() => {
    if (!animationAnchor?.rotation) return null
    const [, ry] = animationAnchor.rotation
    const from = new THREE.Vector3(...anchorPos)
    const dir = new THREE.Vector3(Math.sin(ry), 0, Math.cos(ry))
    return new THREE.ArrowHelper(dir, from, 0.55, 0xf87171, 0.14, 0.1)
  }, [anchorPos, animationAnchor?.rotation])

  if (activityBarsEditMode) return null

  return (
    <group name="activity-bars-debug-markers">
      <ClickableMarker
        position={hotspotPosition}
        color="#fbbf24"
        hitRadius={0.55}
        visualRadius={0.13}
        active={markersActive}
      />

      <ClickableMarker
        position={interactionPoint}
        color="#4ade80"
        hitRadius={0.62}
        visualRadius={0.14}
        active={markersActive}
      />

      <ClickableMarker
        position={anchorPos}
        color="#ef4444"
        hitRadius={0.58}
        visualRadius={0.12}
        active={markersActive}
      />

      <Line
        points={[interactionPoint, anchorPos]}
        color="#ef4444"
        lineWidth={1.2}
        transparent
        opacity={0.45}
        dashed
        dashSize={0.08}
        gapSize={0.06}
        depthTest={false}
      />

      <Line
        points={[interactionPoint, faceTarget]}
        color="#38bdf8"
        lineWidth={1.5}
        transparent
        opacity={0.55}
        depthTest={false}
      />

      {lookArrow && <primitive object={lookArrow} />}
      {anchorArrow && <primitive object={anchorArrow} />}
    </group>
  )
}

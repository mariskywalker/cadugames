'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { ROOM_STUDIO_FOG } from '@/lib/opening/roomBackdrop'
import { SCENE_HUB, SCENE_HUB_RADIUS } from '@/lib/opening/sceneLayout'

function createGroundMistTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const cx = size / 2
  const gradient = ctx.createRadialGradient(cx, cx, 0, cx, cx, size * 0.5)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
  gradient.addColorStop(0.28, 'rgba(255, 195, 200, 0.05)')
  gradient.addColorStop(0.52, 'rgba(255, 185, 192, 0.14)')
  gradient.addColorStop(0.72, 'rgba(255, 178, 168, 0.16)')
  gradient.addColorStop(0.88, 'rgba(255, 200, 188, 0.11)')
  gradient.addColorStop(1, 'rgba(255, 195, 185, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function HorizonGroundMist() {
  const map = useMemo(() => createGroundMistTexture(), [])
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map,
        transparent: true,
        opacity: ROOM_STUDIO_FOG.groundOpacity,
        depthWrite: false,
        toneMapped: false,
        fog: true,
      }),
    [map],
  )

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[SCENE_HUB[0], ROOM_STUDIO_FOG.sheetY, SCENE_HUB[2]]}
      renderOrder={-8}
      material={material}
    >
      <circleGeometry args={[SCENE_HUB_RADIUS * ROOM_STUDIO_FOG.sheetRadiusMult, 96]} />
    </mesh>
  )
}

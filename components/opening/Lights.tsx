'use client'

import { SCENE_OBJECTS } from '@/lib/opening/sceneComposition'
import { SCENE_HUB } from '@/lib/opening/sceneLayout'
import { ROOM_STUDIO_GRADIENT, ROOM_STUDIO_LIGHTING } from '@/lib/opening/roomBackdrop'

const tube = SCENE_OBJECTS.bubbleColumn.position

export function Lights() {
  const L = ROOM_STUDIO_LIGHTING

  return (
    <>
      <ambientLight intensity={0.28} color={L.ambient} />
      <hemisphereLight intensity={0.38} color={L.hemisphereSky} groundColor={L.hemisphereGround} />

      <directionalLight
        position={[7, 3.8, -4.5]}
        intensity={0.48}
        color={L.sunsetKey}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={32}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.00014}
        shadow-normalBias={0.028}
      />

      <directionalLight position={[-5, 4.5, 5]} intensity={0.22} color={L.sunsetFill} />
      <directionalLight position={[-2, 5.5, -8]} intensity={0.2} color={L.sunsetRim} />
      <directionalLight position={[tube[0], 3.2, tube[2] + 2]} intensity={0.14} color={L.tubeFill} />
      <pointLight
        position={[tube[0] + 2.4, 2.2, tube[2] + 1.8]}
        intensity={0.32}
        distance={9}
        decay={2}
        color={L.tubeSpill}
      />
      <pointLight
        position={[tube[0] - 2.1, 1.9, tube[2] + 2.2]}
        intensity={0.24}
        distance={8}
        decay={2}
        color={L.tubeSpill}
      />
      <pointLight
        position={[SCENE_HUB[0], 1.2, SCENE_HUB[2] + 0.8]}
        intensity={0.08}
        distance={10}
        decay={2}
        color={ROOM_STUDIO_GRADIENT.mid}
      />
    </>
  )
}

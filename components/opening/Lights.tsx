'use client'

import { SCENE_OBJECTS } from '@/lib/opening/sceneComposition'
import { SCENE_HUB } from '@/lib/opening/sceneLayout'
import { ROOM_STUDIO_GRADIENT, ROOM_STUDIO_LIGHTING } from '@/lib/opening/roomBackdrop'

const tube = SCENE_OBJECTS.bubbleColumn.position

export function Lights() {
  const L = ROOM_STUDIO_LIGHTING

  return (
    <>
      <ambientLight intensity={1.1} color={L.ambient} />
      <hemisphereLight intensity={0.45} color={L.hemisphereSky} groundColor={L.hemisphereGround} />

      <directionalLight
        position={[2.5, 8.5, 6]}
        intensity={0.42}
        color={L.key}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={28}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.00012}
        shadow-normalBias={0.024}
      />

      <directionalLight position={[-4, 5, 3]} intensity={0.18} color={L.fill} />
      <directionalLight position={[0, 4, -8]} intensity={0.14} color={L.rim} />

      <pointLight
        position={[SCENE_HUB[0], 1.4, SCENE_HUB[2] + 0.4]}
        intensity={0.65}
        distance={14}
        decay={2}
        color={L.hubGlow}
      />
      <pointLight
        position={[tube[0], 2.1, tube[2] + 0.5]}
        intensity={0.22}
        distance={8}
        decay={2}
        color="#E8F4FF"
      />
    </>
  )
}

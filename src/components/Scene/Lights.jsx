import { ROOM_STUDIO_COLORS, ROOM_STUDIO_GRADIENT } from '../../constants/roomBackdrop'
import { SCENE_HUB } from '../../constants/sceneLayout'

/** Iluminação próxima à referência — ambiente rosado, key frontal suave, fill lateral. */
export function Lights() {
  return (
    <>
      <ambientLight intensity={0.48} color="#fff3f0" />
      <hemisphereLight
        intensity={0.52}
        color="#ffe8e2"
        groundColor={ROOM_STUDIO_GRADIENT.start}
      />
      {/* Key — frente/direita, sombras suaves */}
      <directionalLight
        position={[3.5, 9, 8]}
        intensity={0.62}
        color="#fffaf8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={32}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.00012}
        shadow-normalBias={0.025}
      />
      {/* Fill esquerda — abre sombras do urso e equipamentos */}
      <directionalLight position={[-6, 5.5, 4]} intensity={0.28} color="#ffd8d0" />
      {/* Rim suave atrás — separa do fundo */}
      <directionalLight position={[0, 5, -7]} intensity={0.16} color="#ffc8be" />
      {/* Warm bounce no palco */}
      <pointLight
        position={[SCENE_HUB[0], 1.8, SCENE_HUB[2] + 1.2]}
        intensity={0.45}
        distance={14}
        decay={2}
        color="#ffb8a8"
      />
    </>
  )
}

'use client'

import { VALE_HERO_MODE, VALE_USE_REFERENCE_BG } from '@/lib/vale/valeWorld'

const USE_IMPORTED_GLB_LIGHTING = VALE_USE_REFERENCE_BG && VALE_HERO_MODE

/**
 * Hero + referência: iluminação mínima — o bake do GLB define o look.
 * Fallback: rig manual para cenas sem fundo de referência.
 */
export function ValeLights() {
  if (USE_IMPORTED_GLB_LIGHTING) {
    return (
      <>
        {/* Luz suave — revela o bake do GLB sem apagar o pôr do sol das texturas */}
        <ambientLight intensity={0.42} color="#ffe8d8" />
        <hemisphereLight intensity={0.32} color="#ffd4b0" groundColor="#8a6858" />
        <directionalLight position={[0, 4, -10]} intensity={0.5} color="#ffcc80" />
        <directionalLight position={[2, 2, 8]} intensity={0.18} color="#fff4ee" />
      </>
    )
  }

  if (VALE_USE_REFERENCE_BG) {
    return (
      <>
        <ambientLight intensity={0.32} color="#ffe0c8" />
        <hemisphereLight intensity={0.38} color="#ffd0b0" groundColor="#8a7058" />
        <directionalLight
          position={[0, 4.5, -14]}
          intensity={1.45}
          color="#ffcc70"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={32}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-7}
          shadow-bias={-0.0001}
          shadow-normalBias={0.025}
        />
        <directionalLight position={[1.5, 2.5, 11]} intensity={0.2} color="#fff4ee" />
        <directionalLight position={[0, 2.8, 9]} intensity={0.3} color="#ffb878" />
        <pointLight position={[0, 1.05, -0.05]} intensity={0.85} color="#ffc878" distance={5} decay={2} />
        <pointLight position={[0.1, 1.5, -0.1]} intensity={0.5} color="#ffb050" distance={3.5} decay={2} />
        <pointLight position={[-0.32, 0.52, 0.22]} intensity={0.3} color="#ff9048" distance={3} decay={2} />
        <pointLight position={[0.32, 0.52, 0.22]} intensity={0.3} color="#ff9048" distance={3} decay={2} />
      </>
    )
  }

  return (
    <>
      <ambientLight intensity={0.42} color="#ffe8d8" />
      <hemisphereLight intensity={0.48} color="#ffcfb8" groundColor="#b89078" />
      <directionalLight
        position={[1, 6, -9]}
        intensity={1.2}
        color="#ffb878"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={36}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.00012}
        shadow-normalBias={0.028}
      />
      <directionalLight position={[5, 4, 10]} intensity={0.22} color="#fff0f0" />
      <directionalLight position={[-5, 3, 12]} intensity={0.35} color="#ffc8d8" />
      <pointLight position={[0, 1.05, -0.05]} intensity={0.9} color="#ffc878" distance={5.5} decay={2} />
      <pointLight position={[0.12, 1.55, -0.08]} intensity={0.55} color="#ffb060" distance={4} decay={2} />
    </>
  )
}

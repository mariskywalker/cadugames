'use client'

import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, useGLTF } from '@react-three/drei'
import { Color, MathUtils, type Group, type Mesh, type MeshStandardMaterial } from 'three'

function HoverModel({
  src,
  hovered,
  color,
}: {
  src: string
  hovered: boolean
  color?: string
}) {
  const ref = useRef<Group>(null)
  const { scene } = useGLTF(src)

  // Tinge os materiais do modelo para deixar a estrela mais amarelada/dourada.
  useMemo(() => {
    if (!color) return
    const tint = new Color(color)
    scene.traverse((o) => {
      const mesh = o as Mesh
      if (!mesh.isMesh) return
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((m) => {
        const mat = m as MeshStandardMaterial
        if (mat && mat.color) {
          mat.color.copy(tint)
          if (mat.emissive) {
            mat.emissive.copy(tint)
            mat.emissiveIntensity = 0.12
          }
          // aparência de ouro: brilho metálico moderado (sem env map, metalness alto escurece)
          if (typeof mat.metalness === 'number') mat.metalness = 0.55
          if (typeof mat.roughness === 'number') mat.roughness = 0.35
          mat.needsUpdate = true
        }
      })
    })
  }, [scene, color])

  useFrame((state) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime

    if (hovered) {
      // balançar suave enquanto o mouse está em cima
      g.rotation.y = Math.sin(t * 4) * 0.45
      g.rotation.x = Math.sin(t * 3) * 0.18
      const s = MathUtils.lerp(g.scale.x, 1.15, 0.15)
      g.scale.set(s, s, s)
    } else {
      // volta suavemente para a posição de descanso
      g.rotation.y = MathUtils.lerp(g.rotation.y, 0, 0.12)
      g.rotation.x = MathUtils.lerp(g.rotation.x, 0, 0.12)
      const s = MathUtils.lerp(g.scale.x, 1, 0.12)
      g.scale.set(s, s, s)
    }
  })

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  )
}

export interface GlbIconProps {
  /** Caminho do .glb em /public */
  src: string
  size?: number
  /** Mostra um glow atrás do modelo */
  glow?: boolean
  /** Cor do glow */
  glowColor?: string
  /** Cor aplicada aos materiais do modelo (ex.: deixar a estrela mais amarela) */
  color?: string
  className?: string
}

/**
 * Renderiza um modelo GLB como ícone 3D pequeno (fundo transparente),
 * com glow atrás e animação de balanço no hover.
 */
export default function GlbIcon({
  src,
  size = 48,
  glow = true,
  glowColor = 'rgba(255, 196, 87, 0.65)',
  color = '#E6B422',
  className,
}: GlbIconProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: 'relative', cursor: 'pointer' }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {glow && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-35%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`,
            filter: 'blur(8px)',
            opacity: hovered ? 1 : 0.7,
            transform: hovered ? 'scale(1.15)' : 'scale(1)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 40 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 3, 4]} intensity={1.4} />
          <directionalLight position={[-3, -1, -2]} intensity={0.5} color="#ffd6e8" />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.15}>
              <HoverModel src={src} hovered={hovered} color={color} />
            </Bounds>
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}

useGLTF.preload('/models/star.glb')

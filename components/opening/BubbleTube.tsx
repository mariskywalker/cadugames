'use client'

import { useFrame } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { BUBBLE_TUBE_HEIGHT, BUBBLE_TUBE_RADIUS } from '@/lib/opening/animations'
import { SCENE_OBJECTS, sceneObjectDefaults } from '@/lib/opening/sceneComposition'
import { useOpeningStore } from '@/store/useOpeningStore'
import { SceneTransform } from './SceneTransform'
import { BubbleTubeGlb } from './BubbleTubeGlb'

const TUBE_BASE_SCALE = sceneObjectDefaults(SCENE_OBJECTS.bubbleColumn).scale[0]

const DEFAULT_METRICS = {
  innerRadius: BUBBLE_TUBE_RADIUS * 0.78,
  height: BUBBLE_TUBE_HEIGHT,
}

function TubeLoadingPlaceholder() {
  return (
    <mesh position={[0, BUBBLE_TUBE_HEIGHT * 0.5, 0]}>
      <cylinderGeometry args={[BUBBLE_TUBE_RADIUS * 0.5, BUBBLE_TUBE_RADIUS * 0.5, BUBBLE_TUBE_HEIGHT, 16]} />
      <meshBasicMaterial color="#7dd3fc" transparent opacity={0.25} wireframe />
    </mesh>
  )
}

function Caustics({ causticsRef }: { causticsRef: React.MutableRefObject<Record<string, { value: number | THREE.Color }> | null> }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uStrength: { value: 0.34 },
      uColor: { value: new THREE.Color('#7dd3fc') },
    }),
    [],
  )
  if (causticsRef && !causticsRef.current) causticsRef.current = uniforms

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.011, -0.4]} renderOrder={0}>
      <circleGeometry args={[5.8, 72]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uStrength;
          uniform vec3 uColor;
          varying vec2 vUv;

          float caustic(vec2 p){
            float t = uTime * 0.22;
            float a = sin((p.x * 10.0) + t) + sin((p.y * 12.0) - t * 1.3);
            float b = sin((p.x * 14.0) - t * 0.9) + sin((p.y * 9.0) + t * 1.1);
            float c = sin((p.x + p.y) * 16.0 + t * 0.7);
            float v = (a + b + c) / 3.0;
            v = smoothstep(0.25, 0.95, v * 0.5 + 0.5);
            return v;
          }

          void main(){
            vec2 p = (vUv - 0.5);
            float r = length(p);
            float mask = smoothstep(0.55, 0.0, r);
            float v = caustic(p * 1.2);
            float alpha = v * uStrength * mask;
            gl_FragColor = vec4(uColor * (0.35 + 0.65 * v), alpha);
          }
        `}
      />
    </mesh>
  )
}

export function BubbleTube() {
  const group = useRef<THREE.Group>(null)
  const causticsRef = useRef<Record<string, { value: number | THREE.Color }> | null>(null)
  const [, setTubeMetrics] = useState(DEFAULT_METRICS)
  const setBubbleTubeCollider = useOpeningStore((s) => s.setBubbleTubeCollider)
  const defaults = sceneObjectDefaults(SCENE_OBJECTS.bubbleColumn)

  useEffect(() => {
    setBubbleTubeCollider(BUBBLE_TUBE_RADIUS * TUBE_BASE_SCALE + 0.4)
  }, [setBubbleTubeCollider])

  const onMetrics = useCallback(
    (m: { innerRadius?: number; height?: number; outerRadius?: number }) => {
      setTubeMetrics({
        innerRadius: m.innerRadius ?? DEFAULT_METRICS.innerRadius,
        height: m.height ?? DEFAULT_METRICS.height,
      })
      if (m.outerRadius) {
        setBubbleTubeCollider(m.outerRadius * TUBE_BASE_SCALE + 0.4)
      }
    },
    [setBubbleTubeCollider],
  )

  useFrame((state) => {
    if (causticsRef.current?.uTime) {
      causticsRef.current.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <SceneTransform
      position={defaults.position}
      rotation={defaults.rotation}
      scale={defaults.scale}
    >
      <group ref={group}>
        <Suspense fallback={<TubeLoadingPlaceholder />}>
          <BubbleTubeGlb onMetrics={onMetrics} />
        </Suspense>
        <Caustics causticsRef={causticsRef} />
        <pointLight position={[2.6, 1.6, 2.2]} intensity={0.42} distance={7.5} decay={2} color="#93c5fd" />
        <pointLight position={[3.1, 1.4, 1.8]} intensity={0.34} distance={6.5} decay={2} color="#7dd3fc" />
        <pointLight position={[-2.2, 1.2, 2.4]} intensity={0.22} distance={6} decay={2} color="#a8d8f0" />
      </group>
    </SceneTransform>
  )
}

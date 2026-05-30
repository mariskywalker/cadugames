import { useFrame } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { BUBBLE_TUBE_HEIGHT, BUBBLE_TUBE_RADIUS } from '../../constants/animations'
import { SCENE_OBJECTS, sceneObjectDefaults } from '../../constants/sceneComposition'
import { useCADUStore } from '../../store/useCADUStore'
import { BubbleTubeGlb } from './BubbleTubeGlb'
import { EditableTransform } from './EditableTransform'

const TUBE_BASE_SCALE = sceneObjectDefaults(SCENE_OBJECTS.bubbleColumn).scale[0]

const DEFAULT_METRICS = {
  innerRadius: BUBBLE_TUBE_RADIUS * 0.78,
  height: BUBBLE_TUBE_HEIGHT,
}

export function BubbleTube() {
  const group = useRef()
  const keyLightRef = useRef()
  const coreGlowRef = useRef()
  const waterUniformsRef = useRef(null)
  const causticsRef = useRef(null)
  const [tubeMetrics, setTubeMetrics] = useState(DEFAULT_METRICS)
  const setBubbleTubeCollider = useCADUStore((s) => s.setBubbleTubeCollider)

  useEffect(() => {
    setBubbleTubeCollider(BUBBLE_TUBE_RADIUS * TUBE_BASE_SCALE + 0.4)
  }, [setBubbleTubeCollider])

  const onMetrics = useCallback(
    (m) => {
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

  const labelY = tubeMetrics.height * 0.52

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const k = keyLightRef.current
    const core = coreGlowRef.current
    if (k) {
      const pulse = 0.94 + 0.06 * Math.sin(t * 0.35)
      k.intensity = 7.2 * pulse
    }
    if (core) {
      core.intensity = 5.5 + 0.8 * Math.sin(t * 0.42)
    }
    if (causticsRef.current) causticsRef.current.uTime.value = t
  })

  return (
    <EditableTransform
      objectId="bubbleColumn"
      defaults={sceneObjectDefaults(SCENE_OBJECTS.bubbleColumn)}
    >
      <group ref={group}>
      <Suspense fallback={<TubeLoadingPlaceholder />}>
        <BubbleTubeGlb onMetrics={onMetrics} />
      </Suspense>

      <TubeWaterVolume
        waterUniformsRef={waterUniformsRef}
        height={tubeMetrics.height}
        radius={tubeMetrics.innerRadius}
      />
      <Bubbles height={tubeMetrics.height} radius={tubeMetrics.innerRadius} />
      <BubbleLights height={tubeMetrics.height} radius={tubeMetrics.innerRadius} />
      <TubeCoreGlow height={tubeMetrics.height} radius={tubeMetrics.innerRadius} />
      <Caustics causticsRef={causticsRef} />
      <pointLight
        position={[0, tubeMetrics.height * 0.48, 0]}
        intensity={7.2}
        distance={14}
        decay={1.8}
        color="#e0f7ff"
        ref={keyLightRef}
      />
      <pointLight
        position={[0, tubeMetrics.height * 0.42, 0]}
        intensity={5.5}
        distance={9}
        decay={1.6}
        color="#bae6fd"
        ref={coreGlowRef}
      />
      <pointLight
        position={[0, 0.25, 0]}
        intensity={1.6}
        distance={7}
        decay={2}
        color="#a5f3fc"
      />
      </group>
    </EditableTransform>
  )
}

function TubeLoadingPlaceholder() {
  return (
    <mesh position={[0, BUBBLE_TUBE_HEIGHT * 0.5, 0]}>
      <cylinderGeometry args={[BUBBLE_TUBE_RADIUS * 0.5, BUBBLE_TUBE_RADIUS * 0.5, BUBBLE_TUBE_HEIGHT, 16]} />
      <meshBasicMaterial color="#7dd3fc" transparent opacity={0.25} wireframe />
    </mesh>
  )
}

function Caustics({ causticsRef }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uStrength: { value: 0.22 },
      uColor: { value: new THREE.Color('#7dd3fc') },
    }),
    [],
  )
  if (causticsRef && !causticsRef.current) causticsRef.current = uniforms

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.011, -1.1]} renderOrder={0}>
      <circleGeometry args={[4.2, 64]} />
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

function TubeWaterVolume({ waterUniformsRef, height, radius }) {
  const waterUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#bae6fd') },
      uColorB: { value: new THREE.Color('#93c5fd') },
      uDensity: { value: 1.05 },
      uScatter: { value: 0.95 },
    }),
    [],
  )

  if (waterUniformsRef && !waterUniformsRef.current) waterUniformsRef.current = waterUniforms

  const rNorm = useMemo(() => (radius / Math.max(radius, 0.01)).toFixed(2), [radius])

  useFrame((state) => {
    waterUniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh position={[0, height * 0.5 + 0.07, 0]} renderOrder={1}>
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        uniforms={waterUniforms}
        vertexShader={`
          varying vec3 vPosL;
          void main() {
            vPosL = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uDensity;
          uniform float uScatter;
          varying vec3 vPosL;

          float hash(vec2 p){
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          void main() {
            float r = length(vPosL.xz);
            float rn = clamp(r / (${rNorm} * 1.0), 0.0, 1.0);
            float h = clamp((vPosL.y / ${height.toFixed(2)}) + 0.5, 0.0, 1.0);
            float center = smoothstep(1.0, 0.0, rn);
            float coreGlow = pow(center, 1.35);
            float bottom = smoothstep(1.0, 0.0, h);
            float n = hash(vPosL.xz * 2.0 + uTime * 0.05);
            float n2 = hash(vPosL.zy * 1.7 - uTime * 0.04);
            float noise = (n + n2) * 0.5;
            float density = uDensity * (0.2 + 0.45 * center + 0.15 * bottom + 0.28 * coreGlow) + (noise - 0.5) * 0.06;
            density = clamp(density, 0.0, 1.0);
            vec3 col = mix(uColorB, uColorA, 0.35 + 0.65 * center);
            col += vec3(0.55, 0.72, 0.88) * coreGlow * 0.42;
            col *= (0.62 + 0.58 * center) * uScatter;
            float alpha = density * 0.42;
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  )
}

function TubeCoreGlow({ height, radius }) {
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#e8f8ff',
        transparent: true,
        opacity: 0.38,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [],
  )

  const y = height * 0.44
  const r = radius * 0.28

  return (
    <group renderOrder={2}>
      <mesh position={[0, y, 0]} material={mat}>
        <sphereGeometry args={[r, 20, 14]} />
      </mesh>
      <mesh position={[0, y, 0]} material={mat}>
        <cylinderGeometry args={[r * 0.85, r * 0.85, height * 0.35, 16, 1, true]} />
      </mesh>
    </group>
  )
}

function BubbleLights({ height, radius }) {
  const lightsRef = useRef([])

  const lights = useMemo(
    () =>
      new Array(6).fill(0).map((_, i) => ({
        a: (i / 6) * Math.PI * 2,
        phase: i * 1.7,
        h: 0.22 + i * 0.17,
        r: 0.18 + i * 0.06,
        inten: 0.12 + i * 0.05,
      })),
    [],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    for (let i = 0; i < lights.length; i++) {
      const l = lightsRef.current[i]
      if (!l) continue
      const p = lights[i]
      const swirl = t * 0.9 + p.phase
      const x = Math.cos(swirl + p.a) * (radius * (0.18 + p.r))
      const z = Math.sin(swirl + p.a) * (radius * (0.18 + p.r))
      const y = 0.18 + height * (0.15 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.35 + p.a)))
      l.position.set(x, y, z)
      l.intensity = (0.35 + 0.18 * Math.sin(t * 2.4 + p.phase)) * (0.85 + p.inten)
    }
  })

  return (
    <group>
      {lights.map((p, i) => (
        <pointLight
          key={i}
          ref={(el) => {
            lightsRef.current[i] = el
          }}
          position={[0, height * p.h, 0]}
          intensity={0.28}
          distance={6.2}
          decay={2}
          color="#93c5fd"
        />
      ))}
    </group>
  )
}

function Bubbles({ height, radius }) {
  const inst = useRef()
  const count = 160

  const rand01 = (i, salt) => {
    const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453123
    return x - Math.floor(x)
  }

  const params = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        r: 0.028 + rand01(i, 1) * 0.05,
        a: rand01(i, 2) * Math.PI * 2,
        spin: (rand01(i, 8) * 2 - 1) * (0.25 + rand01(i, 9) * 0.55),
        w: 0.12 + rand01(i, 3) * 0.2,
        s: 0.12 + rand01(i, 4) * 0.18,
        drift: (rand01(i, 5) * 2 - 1) * 0.02,
        phase: rand01(i, 6) * Math.PI * 2,
        buoy: 0.35 + rand01(i, 10) * 0.7,
        jitter: 0.18 + rand01(i, 11) * 0.45,
      })),
    [count],
  )

  const yRef = useRef(null)
  const vRef = useRef(null)
  const initialYs = useMemo(() => {
    const ys = new Float32Array(count)
    for (let i = 0; i < count; i++) ys[i] = rand01(i, 7) * 1.9
    return ys
  }, [count])
  const initialVs = useMemo(() => {
    const vs = new Float32Array(count)
    for (let i = 0; i < count; i++) vs[i] = 0.15 + rand01(i, 12) * 0.55
    return vs
  }, [count])

  if (yRef.current == null) yRef.current = initialYs
  if (vRef.current == null) vRef.current = initialVs

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#e8f8ff') },
      uRimColor: { value: new THREE.Color('#bae6fd') },
      uRimPower: { value: 1.55 },
      uNeon: { value: 0.85 },
      uSoft: { value: 0.6 },
    }),
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t
    const m = inst.current
    if (!m) return
    const ys = yRef.current
    const vs = vRef.current
    if (!ys || !vs) return

    const top = 2.05
    const yBase = 0.08

    for (let i = 0; i < count; i++) {
      const p = params[i]
      vs[i] += 0.14 * p.buoy * delta
      vs[i] *= 1 - 0.22 * delta
      ys[i] += (p.s * 0.55 + vs[i]) * delta
      if (ys[i] > top) {
        ys[i] = 0.02 + rand01(i, 13) * 0.12
        vs[i] = 0.12 + rand01(i, 14) * 0.35
      }

      const wobble = Math.sin(t * 0.8 + p.phase) * p.w
      const y01 = THREE.MathUtils.clamp(ys[i] / top, 0, 1)
      const swirl = p.a + t * (0.12 + p.spin * 0.08) + y01 * 1.2
      const radialFill = i % 2 === 0 ? 0.22 : 0.52
      const bubbleR = radius * (radialFill + 0.2 * Math.sin(t * 0.65 + p.phase)) + wobble * 0.06
      const jitter =
        Math.sin(t * (1.05 + p.jitter) + p.phase) * 0.009 + Math.cos(t * (0.8 + p.jitter) + p.phase) * 0.008
      const x = Math.cos(swirl) * bubbleR + p.drift + jitter
      const z = Math.sin(swirl) * bubbleR + jitter * 0.6

      dummy.position.set(x, yBase + ys[i] * (height / top), z)
      const inflate = 0.88 + 0.18 * y01 + 0.08 * Math.sin(t * 0.9 + p.phase)
      const s = p.r * inflate
      dummy.scale.set(s * (1 + 0.14 * Math.sin(t * 1.7 + p.phase)), s, s * (1 + 0.14 * Math.cos(t * 1.5 + p.phase)))
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={inst} args={[null, null, count]} renderOrder={3} frustumCulled={false}>
      <sphereGeometry args={[1, 12, 10]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormalW;
          varying vec3 vViewDirW;
          void main() {
            vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
            vec3 nW = normalize(mat3(modelMatrix * instanceMatrix) * normal);
            vNormalW = nW;
            vViewDirW = normalize(cameraPosition - worldPos.xyz);
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          uniform vec3 uRimColor;
          uniform float uRimPower;
          uniform float uNeon;
          uniform float uSoft;
          varying vec3 vNormalW;
          varying vec3 vViewDirW;
          void main() {
            float ndv = clamp(dot(normalize(vNormalW), normalize(vViewDirW)), 0.0, 1.0);
            float rim = pow(1.0 - ndv, uRimPower);
            rim = smoothstep(0.05, 0.85, rim);
            float shimmer = 0.92 + 0.08 * sin(uTime * 1.8 + rim * 5.0);
            float core = pow(ndv, 1.7);
            vec3 col = uColor * (0.16 * uNeon + 0.35 * core) + uRimColor * (rim * 0.42 * shimmer * uNeon);
            float alpha = clamp(0.10 + core * 0.22 + rim * 0.18, 0.0, 0.55) * uSoft;
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </instancedMesh>
  )
}

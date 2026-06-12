'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { SENSORY_SHELL_COLORS, SENSORY_SHELL_LAYOUT } from '@/lib/opening/sensoryRoomShell'
import { SCENE_HUB } from '@/lib/opening/sceneLayout'
import { SCENE_OBJECTS } from '@/lib/opening/sceneComposition'

function useCycloramaMaterial() {
  return useMemo(() => {
    const uniforms = {
      uTop: { value: new THREE.Color(SENSORY_SHELL_COLORS.wallTop) },
      uMid: { value: new THREE.Color(SENSORY_SHELL_COLORS.wallMid) },
      uBase: { value: new THREE.Color(SENSORY_SHELL_COLORS.wallBase) },
      uFloor: { value: new THREE.Color(SENSORY_SHELL_COLORS.wallFloor) },
      uLavender: { value: new THREE.Color(SENSORY_SHELL_COLORS.lavenderShadow) },
      uBlueSpill: { value: new THREE.Color(SENSORY_SHELL_COLORS.blueSpill) },
    }

    return new THREE.ShaderMaterial({
      uniforms,
      side: THREE.FrontSide,
      fog: false,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 uTop;
        uniform vec3 uMid;
        uniform vec3 uBase;
        uniform vec3 uFloor;
        uniform vec3 uLavender;
        uniform vec3 uBlueSpill;
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormal;

        void main() {
          float h = clamp(vUv.y, 0.0, 1.0);
          vec3 col = h < 0.42
            ? mix(uFloor, uBase, h / 0.42)
            : h < 0.72
              ? mix(uBase, uMid, (h - 0.42) / 0.30)
              : mix(uMid, uTop, (h - 0.72) / 0.28);

          float edge = pow(abs(vNormal.x), 1.4) * 0.11;
          col = mix(col, uLavender, edge);

          float tubeGlow = exp(-length(vWorldPos.xz - vec2(0.0, 1.1)) * 0.22) * 0.09;
          col = mix(col, uBlueSpill, tubeGlow);

          float topWash = smoothstep(0.55, 1.0, h) * 0.06;
          col = mix(col, vec3(1.0, 0.88, 0.86), topWash);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
  }, [])
}

export function SensoryRoomShell() {
  const hub = SCENE_HUB
  const L = SENSORY_SHELL_LAYOUT
  const tube = SCENE_OBJECTS.bubbleColumn.position
  const cycloramaMat = useCycloramaMaterial()
  const backZ = hub[2] + L.backZ

  const sideWallMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: SENSORY_SHELL_COLORS.sideWall,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false,
        fog: true,
      }),
    [],
  )

  return (
    <group position={[hub[0], 0, 0]} renderOrder={-30}>
      <mesh
        position={[0, L.cycloramaHeight * 0.5, backZ]}
        material={cycloramaMat}
        frustumCulled={false}
      >
        <cylinderGeometry
          args={[
            L.cycloramaRadius,
            L.cycloramaRadius,
            L.cycloramaHeight,
            72,
            1,
            true,
            L.cycloramaArcStart,
            L.cycloramaArc,
          ]}
        />
      </mesh>

      <mesh position={[-L.sideX, 3.8, hub[2] + L.sideZ]} rotation={[0, L.sideYaw, 0]} material={sideWallMat}>
        <planeGeometry args={[11, 8.2]} />
      </mesh>
      <mesh position={[L.sideX, 3.8, hub[2] + L.sideZ]} rotation={[0, -L.sideYaw, 0]} material={sideWallMat}>
        <planeGeometry args={[11, 8.2]} />
      </mesh>

      <pointLight
        position={[tube[0], tube[1] + 3.4, backZ + 2.4]}
        intensity={0.16}
        distance={18}
        decay={2}
        color={SENSORY_SHELL_COLORS.blueSpill}
      />
    </group>
  )
}

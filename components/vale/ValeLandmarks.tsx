'use client'

import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  VALE_LANDMARKS,
  valeCharacterWorldPos,
  valeTerrain,
  type ValeLandmark,
} from '@/lib/vale/valeWorld'
import { useValeStore } from '@/store/useValeStore'
import * as THREE from 'three'

const groundRay = new THREE.Raycaster()
const rayOrigin = new THREE.Vector3()
const RAY_DOWN = new THREE.Vector3(0, -1, 0)

function useGroundY(x: number, z: number) {
  const [y, setY] = useState(0)

  useEffect(() => {
    const sample = () => {
      if (!valeTerrain.object) return false
      rayOrigin.set(x, 30, z)
      groundRay.set(rayOrigin, RAY_DOWN)
      const hit = groundRay.intersectObject(valeTerrain.object, true)[0]
      if (hit) setY(hit.point.y)
      return true
    }
    if (sample()) return
    const id = setInterval(() => {
      if (sample()) clearInterval(id)
    }, 250)
    return () => clearInterval(id)
  }, [x, z])

  return y
}

/** Âncoras invisíveis — sem placeholders procedurais nem labels flutuantes */
function Landmark({ landmark }: { landmark: ValeLandmark }) {
  const [x, z] = landmark.position
  const groundY = useGroundY(x, z)
  const nearRef = useRef(false)
  const setWalkTarget = useValeStore((s) => s.setWalkTarget)
  const discover = useValeStore((s) => s.discover)
  const setNearHouse = useValeStore((s) => s.setNearHouse)
  const isHouse = landmark.id === 'casa-urso'

  useFrame(() => {
    const dx = valeCharacterWorldPos.x - x
    const dz = valeCharacterWorldPos.z - z
    const isNear = Math.hypot(dx, dz) <= landmark.proximity
    if (isNear !== nearRef.current) {
      nearRef.current = isNear
      if (isHouse) {
        setNearHouse(isNear)
        if (!isNear) useValeStore.getState().closeHouseHub()
      }
      if (isNear) discover(landmark.id, landmark.name, landmark.emoji)
    }
  })

  const anchorSize: [number, number, number] = isHouse ? [2.4, 2.6, 2.4] : [1, 1, 1]

  return (
    <group
      position={[x, groundY, z]}
      onPointerDown={(e) => {
        if (e.button !== 0) return
        e.stopPropagation()
        setWalkTarget(x, z)
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <mesh visible={false}>
        <boxGeometry args={anchorSize} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

export function ValeLandmarks() {
  return (
    <>
      {VALE_LANDMARKS.map((landmark) => (
        <Landmark key={landmark.id} landmark={landmark} />
      ))}
    </>
  )
}

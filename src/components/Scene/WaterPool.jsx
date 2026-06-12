import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { BUBBLE_TUBE_CENTER } from '../../constants/animations'
import { useSceneAnimating } from '../../hooks/useSceneAnimating'
import { PALETTE } from '../../constants/palette'

// REPLACE: /public/scene/water-loop.mp4 — short seamless water loop
const WATER_VIDEO = '/interactive-map/water.mp4'

/**
 * Animated water pool near bubble tube (video texture or UV scroll fallback).
 */
export function WaterPool() {
  const meshRef = useRef()
  const videoRef = useRef(null)
  const [videoOk, setVideoOk] = useState(true)
  const animating = useSceneAnimating()
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const { material, video } = useMemo(() => {
    const vid = document.createElement('video')
    vid.src = WATER_VIDEO
    vid.loop = true
    vid.muted = true
    vid.playsInline = true
    vid.crossOrigin = 'anonymous'
    vid.preload = 'metadata'

    const tex = new THREE.VideoTexture(vid)
    tex.colorSpace = THREE.SRGBColorSpace

    const mat = new THREE.MeshToonMaterial({
      color: PALETTE.accentSoft,
      map: tex,
      transparent: true,
      opacity: 0.75,
    })

    return { material: mat, video: vid }
  }, [])

  useEffect(() => {
    videoRef.current = video
    if (reduced || !animating) {
      video.pause()
      return undefined
    }

    const play = () => {
      video.play().catch(() => setVideoOk(false))
    }
    video.addEventListener('canplay', play)
    play()
    return () => {
      video.pause()
      video.removeEventListener('canplay', play)
    }
  }, [video, animating, reduced])

  useEffect(
    () => () => {
      material.map?.dispose()
    },
    [material],
  )

  useFrame((state) => {
    if (!videoOk || reduced || !animating) return
    const m = meshRef.current
    if (!m?.material?.map) return
    m.material.map.offset.y = (state.clock.elapsedTime * 0.04) % 1
  })

  if (!videoOk) {
    return (
      <mesh
        ref={meshRef}
        rotation-x={-Math.PI / 2}
        position={[BUBBLE_TUBE_CENTER[0], 0.015, BUBBLE_TUBE_CENTER[2]]}
      >
        <circleGeometry args={[1.1, 32]} />
        <meshToonMaterial color="#38bdf8" transparent opacity={0.5} emissive="#0ea5e9" emissiveIntensity={0.2} />
      </mesh>
    )
  }

  return (
    <mesh
      ref={meshRef}
      rotation-x={-Math.PI / 2}
      position={[BUBBLE_TUBE_CENTER[0], 0.015, BUBBLE_TUBE_CENTER[2]]}
      material={material}
    >
      <circleGeometry args={[1.15, 40]} />
    </mesh>
  )
}

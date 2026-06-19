'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  acquireTubeVideo,
  playTubeVideo,
  releaseTubeVideo,
} from '@/lib/opening/tubeVideoElement'
import { useSceneAnimating } from '@/hooks/opening/useSceneAnimating'
import { OPENING_INTERACTIVE_RENDER_ORDER } from '@/lib/opening/openingSceneEditorLayout'

const VERTEX = `
  varying vec3 vLocalPos;
  void main() {
    vLocalPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAGMENT = `
  uniform sampler2D uMap;
  uniform float uExposure;
  uniform float uHalfHeight;
  varying vec3 vLocalPos;

  void main() {
    float u = atan(vLocalPos.z, vLocalPos.x) / 6.28318530718 + 0.5;
    float v = clamp(vLocalPos.y / uHalfHeight * 0.5 + 0.5, 0.0, 1.0);
    vec4 tex = texture2D(uMap, vec2(u, v));
    vec3 col = tex.rgb * uExposure;
    gl_FragColor = vec4(col, clamp(tex.a, 0.9, 1.0));
  }
`

export function BubbleTubeVideoScreen({
  centerY,
  height,
  radius,
}: {
  centerY: number
  height: number
  radius: number
}) {
  const animating = useSceneAnimating()
  const halfHeight = height * 0.5
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const playAttemptRef = useRef(0)

  const material = useMemo(() => {
    const vid = acquireTubeVideo()
    videoRef.current = vid

    const tex = new THREE.VideoTexture(vid)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: tex },
        uExposure: { value: 1.35 },
        uHalfHeight: { value: halfHeight },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      side: THREE.FrontSide,
      depthWrite: false,
      depthTest: true,
      toneMapped: false,
    })

    materialRef.current = mat
    return mat
  }, [])

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uHalfHeight.value = halfHeight
    }
  }, [halfHeight])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    const resume = () => {
      if (!animating) return
      playTubeVideo()
    }

    resume()

    video.addEventListener('loadeddata', resume)
    video.addEventListener('canplay', resume)
    video.addEventListener('canplaythrough', resume)

    const onVisible = () => {
      if (document.visibilityState === 'visible') resume()
    }
    const onPageShow = () => resume()
    const onGesture = () => resume()

    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('pointerdown', onGesture, { once: false })

    return () => {
      video.removeEventListener('loadeddata', resume)
      video.removeEventListener('canplay', resume)
      video.removeEventListener('canplaythrough', resume)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('pointerdown', onGesture)
    }
  }, [animating])

  useEffect(
    () => () => {
      const tex = materialRef.current?.uniforms.uMap.value as THREE.VideoTexture | undefined
      tex?.dispose()
      materialRef.current = null
      videoRef.current = null
      releaseTubeVideo()
    },
    [],
  )

  useFrame(() => {
    const video = videoRef.current
    const tex = materialRef.current?.uniforms.uMap.value as THREE.VideoTexture | undefined
    if (!video || !tex) return

    if (animating && video.paused && video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      playAttemptRef.current += 1
      if (playAttemptRef.current % 20 === 0) {
        playTubeVideo()
      }
    }

    if (!video.paused || video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      tex.needsUpdate = true
    }
  })

  return (
    <mesh position={[0, centerY, 0]} renderOrder={OPENING_INTERACTIVE_RENDER_ORDER} material={material}>
      <cylinderGeometry args={[radius * 0.985, radius * 0.985, height, 80, 1, true]} />
    </mesh>
  )
}

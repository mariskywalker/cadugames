'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CLOUD_ASSETS, SKY_CLOUD_INSTANCES, type CloudInstance } from '@/lib/home/cloudLayers'

const PARALLAX_GAIN = 6.5
const PARALLAX_SMOOTH = 0.042

function useSmoothedOffset(target: { x: number; y: number }) {
  const [smooth, setSmooth] = useState({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const targetRef = useRef(target)
  targetRef.current = target

  useEffect(() => {
    let frame = 0
    const tick = () => {
      const t = targetRef.current
      const c = current.current
      current.current = {
        x: c.x + (t.x - c.x) * PARALLAX_SMOOTH,
        y: c.y + (t.y - c.y) * PARALLAX_SMOOTH,
      }
      setSmooth({ ...current.current })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return smooth
}

function resolveSrc(cloud: CloudInstance) {
  if (cloud.asset === 'bluePng') {
    const list = CLOUD_ASSETS.bluePng
    return list[(cloud.assetIndex ?? 0) % list.length]
  }
  const key = cloud.asset as keyof typeof CLOUD_ASSETS
  const asset = CLOUD_ASSETS[key]
  return typeof asset === 'string' ? asset : CLOUD_ASSETS.soft
}

function CloudSprite({ cloud, offset }: { cloud: CloudInstance; offset: { x: number; y: number } }) {
  const src = resolveSrc(cloud)
  const tx = offset.x * cloud.depth * PARALLAX_GAIN
  const ty = offset.y * cloud.depth * PARALLAX_GAIN
  const isSoftPng = cloud.asset === 'softBlur'

  return (
    <div
      className={`home-sky-cloud${cloud.reverse ? ' home-sky-cloud--reverse' : ''}`}
      style={{
        left: `${cloud.left}%`,
        top: `${cloud.top}%`,
        width: `${cloud.width}%`,
        opacity: cloud.opacity,
        animationDelay: `${cloud.delay}s`,
        animationDuration: `${cloud.drift}s`,
      }}
      aria-hidden
    >
      <div className="home-sky-cloud__body" style={{ transform: `translate3d(${tx}px, ${ty}px, 0)` }}>
        <img
          className={`home-sky-cloud__img${isSoftPng ? ' home-sky-cloud__img--soft' : ''}`}
          src={src}
          alt=""
          draggable={false}
          decoding="async"
          style={{
            animationDuration: `${cloud.float}s`,
            animationDelay: `${cloud.delay * 0.35}s`,
          }}
        />
      </div>
    </div>
  )
}

export function SkyFloatingClouds({ offset = { x: 0, y: 0 } }: { offset?: { x: number; y: number } }) {
  const clouds = useMemo(() => SKY_CLOUD_INSTANCES, [])
  const smoothOffset = useSmoothedOffset(offset)

  return (
    <div className="home-sky-clouds" aria-hidden>
      {clouds.map((cloud) => (
        <CloudSprite key={cloud.id} cloud={cloud} offset={smoothOffset} />
      ))}
    </div>
  )
}

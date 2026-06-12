import { useEffect, useMemo, useRef, useState } from 'react'
import { CLOUD_ASSETS, SKY_CLOUD_INSTANCES } from '../../constants/cloudLayers'

/** Movimento do ponteiro — mais lento que o restante da cena */
const PARALLAX_GAIN = 6.5
const PARALLAX_SMOOTH = 0.042

function useSmoothedOffset(target) {
  const [smooth, setSmooth] = useState({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const targetRef = useRef(target)
  targetRef.current = target

  useEffect(() => {
    let frame = 0
    const tick = () => {
      const t = targetRef.current
      const c = current.current
      const x = c.x + (t.x - c.x) * PARALLAX_SMOOTH
      const y = c.y + (t.y - c.y) * PARALLAX_SMOOTH
      current.current = { x, y }
      setSmooth({ x, y })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return smooth
}

function resolveSrc(cloud) {
  if (cloud.asset === 'bluePng') {
    const list = CLOUD_ASSETS.bluePng
    return list[cloud.assetIndex % list.length]
  }
  return CLOUD_ASSETS[cloud.asset] ?? CLOUD_ASSETS.soft
}

function CloudSprite({ cloud, offset }) {
  const src = resolveSrc(cloud)
  const tx = offset.x * cloud.depth * PARALLAX_GAIN
  const ty = offset.y * cloud.depth * PARALLAX_GAIN
  const isSoftPng = cloud.asset === 'softBlur'

  return (
    <div
      className={`cadu-sky-cloud${cloud.reverse ? ' cadu-sky-cloud--reverse' : ''}`}
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
      <div
        className="cadu-sky-cloud__body"
        style={{ transform: `translate3d(${tx}px, ${ty}px, 0)` }}
      >
        <img
          className={`cadu-sky-cloud__img${isSoftPng ? ' cadu-sky-cloud__img--soft' : ''}`}
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

/**
 * Nuvens azuladas com drift contínuo + parallax por profundidade (dia ensolarado).
 */
export function SkyFloatingClouds({ offset = { x: 0, y: 0 } }) {
  const clouds = useMemo(() => SKY_CLOUD_INSTANCES, [])
  const smoothOffset = useSmoothedOffset(offset)

  return (
    <div className="cadu-sky-clouds" aria-hidden>
      {clouds.map((cloud) => (
        <CloudSprite key={cloud.id} cloud={cloud} offset={smoothOffset} />
      ))}
    </div>
  )
}

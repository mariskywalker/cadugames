'use client'

import type { CSSProperties } from 'react'
import { OPENING_ASSETS } from '@/lib/opening/assets'
import {
  OPENING_BACKDROP_COVER_BASE,
  type OpeningBackgroundLayout,
} from '@/lib/opening/openingSceneEditorLayout'
import { useOpeningSceneEditorStore } from '@/store/useOpeningSceneEditorStore'

function encodeAssetUrl(url: string) {
  return url.replace(/ /g, '%20')
}

export function buildOpeningBackdropStyle(background: OpeningBackgroundLayout): CSSProperties {
  const coverScale = background.height / OPENING_BACKDROP_COVER_BASE
  const offsetPercent = background.offsetY * 5.5
  return {
    opacity: background.opacity,
    objectPosition: `50% calc(50% + ${offsetPercent}%)`,
    transform: `scale(${coverScale})`,
  }
}

/** Background 2D fixo atrás do canvas — o palco 3D sempre desenha por cima. */
export function OpeningSceneBackdropHtml() {
  const background = useOpeningSceneEditorStore((s) => s.layout.background)
  const imageUrl = encodeAssetUrl(background.imageUrl || OPENING_ASSETS.sceneBackdrop)

  return (
    <img
      className="opening-scene__backdrop"
      src={imageUrl}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      style={buildOpeningBackdropStyle(background)}
    />
  )
}

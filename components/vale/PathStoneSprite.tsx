'use client'

import Image from 'next/image'
import {
  PATH_STONE_ASSETS,
  type PathStoneVariantId,
} from '@/lib/vale/pathStoneVariants'

export interface PathStoneSpriteProps {
  variant: PathStoneVariantId
  size?: number
  className?: string
  alt?: string
}

/** Renderiza um único asset de pedra — uso em UI de mapa, inventário, progresso etc. */
export function PathStoneSprite({
  variant,
  size,
  className = '',
  alt,
}: PathStoneSpriteProps) {
  const asset = PATH_STONE_ASSETS[variant]
  const displaySize = size ?? asset.width

  return (
    <span
      className={`path-stone-asset ${className}`.trim()}
      style={{ width: displaySize, height: (displaySize * asset.height) / asset.width }}
    >
      <Image
        src={asset.src}
        alt={alt ?? `Pedra ${asset.label}`}
        width={asset.width}
        height={asset.height}
        draggable={false}
      />
    </span>
  )
}

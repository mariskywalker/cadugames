'use client'

import type { ReactNode } from 'react'

export function SceneTransform({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  children,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  children: ReactNode
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {children}
    </group>
  )
}

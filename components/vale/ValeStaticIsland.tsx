'use client'

import { VALE_STATIC_ISLAND_LAYOUT, VALE_STATIC_ISLAND_SRC } from '@/lib/vale/valeStaticScene'

/** Ilha + casa como PNG estático (sem GLB) */
export function ValeStaticIsland() {
  return (
    <div className="vale-static-island" aria-hidden>
      <img
        className="vale-static-island__art"
        src={VALE_STATIC_ISLAND_SRC}
        alt=""
        draggable={false}
        style={{
          left: VALE_STATIC_ISLAND_LAYOUT.left,
          top: VALE_STATIC_ISLAND_LAYOUT.top,
          width: VALE_STATIC_ISLAND_LAYOUT.width,
          transform: `translate(${VALE_STATIC_ISLAND_LAYOUT.translateX}, ${VALE_STATIC_ISLAND_LAYOUT.translateY})`,
        }}
      />
    </div>
  )
}

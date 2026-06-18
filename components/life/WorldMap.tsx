'use client'

import { FloatingIsland } from './FloatingIsland'
import {
  CidadeAmigosIsland,
  FlorestaEmocoesIsland,
  IlhaDosSonsIsland,
  MontanhaRotinaIsland,
  ValeDasPalavrasIsland,
} from './islandSvgs'

const futureIslands = [
  {
    name: 'Floresta das Emoções',
    left: '10%',
    top: '54%',
    width: 'min(42vw, 200px)',
    art: <FlorestaEmocoesIsland />,
  },
  {
    name: 'Montanha da Rotina',
    left: '88%',
    top: '50%',
    width: 'min(52vw, 260px)',
    art: <MontanhaRotinaIsland />,
  },
  {
    name: 'Cidade dos Amigos',
    left: '58%',
    top: '78%',
    width: 'min(46vw, 220px)',
    art: <CidadeAmigosIsland />,
  },
] as const

export function WorldMap() {
  return (
    <section aria-label="Mapa da jornada" className="floating-map-layer">
      <FloatingIsland
        name="Vale das Palavras"
        available
        href="/child/life/comunicacao"
        left="50%"
        top="12%"
        width="min(72vw, 360px)"
      >
        <ValeDasPalavrasIsland />
      </FloatingIsland>

      <FloatingIsland
        name="Ilha dos Sons"
        subtitle="Ritmo, escuta e expressão"
        available
        href="/child/life/ilha-dos-sons"
        left="12%"
        top="42%"
        width="min(46vw, 220px)"
      >
        <IlhaDosSonsIsland />
      </FloatingIsland>

      {futureIslands.map((island) => (
        <FloatingIsland
          key={island.name}
          name={island.name}
          left={island.left}
          top={island.top}
          width={island.width}
        >
          {island.art}
        </FloatingIsland>
      ))}
    </section>
  )
}

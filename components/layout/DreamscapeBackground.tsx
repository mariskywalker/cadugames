'use client'

/**
 * Fundo dreamscape + cachoeiras animadas.
 *
 * O "palco" tem o MESMO aspect ratio da arte (3:2 = 1536×1024) e é dimensionado
 * para cobrir a viewport (ancorado no topo, centralizado). Como o palco e a imagem
 * têm a mesma proporção, posicionar os streaks em % do palco = % exato da imagem,
 * então o alinhamento das quedas d'água é estável em qualquer tela.
 *
 * Coordenadas em % da IMAGEM. Ajuste fino aqui se alguma queda sair do lugar.
 */
const streaks = [
  { left: '14%', top: '30%', height: '18%', width: 11, speed: 0.72 }, // ilha grande à esquerda
  { left: '52%', top: '40%', height: '16%', width: 10, speed: 0.64 }, // ilha central
  { left: '78.5%', top: '30%', height: '15%', width: 10, speed: 0.78 }, // ilha grande à direita
  { left: '88.5%', top: '34%', height: '13%', width: 8, speed: 0.55 }, // ilha menor à direita
  { left: '96.5%', top: '36%', height: '12%', width: 7, speed: 0.5 }, // ilha da borda
]

export function DreamscapeBackground({ light = false }: { light?: boolean }) {
  return (
    <div className={light ? 'cadu-dreamscape cadu-dreamscape-light' : 'cadu-dreamscape'} aria-hidden>
      <div className="cadu-dreamscape-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/backgrounds/dreamscape.png" alt="" className="cadu-dreamscape-img" />
        {streaks.map((s, i) => (
          <div
            key={i}
            className="cadu-waterfall"
            style={{
              left: s.left,
              top: s.top,
              height: s.height,
              width: `${s.width}px`,
              animationDuration: `${s.speed}s`,
            }}
          >
            <span className="cadu-waterfall-mist" />
          </div>
        ))}
      </div>
      <div className={light ? 'cadu-dreamscape-tint-light' : 'cadu-dreamscape-tint'} />
    </div>
  )
}

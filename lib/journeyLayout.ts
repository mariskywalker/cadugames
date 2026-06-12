export interface JourneyPoint {
  x: number
  y: number
}

/** Pontos serpenteantes para marcos dentro de um territorio */
export function getMarcoPositions(count: number): JourneyPoint[] {
  if (count <= 0) return []
  if (count === 1) return [{ x: 50, y: 50 }]

  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1)
    const y = 94 - t * 86
    const x = 50 + Math.sin(i * 1.15 + 0.4) * 30
    return { x, y }
  })
}

/** Curva suave entre pontos (% do container) */
export function buildSmoothPath(points: JourneyPoint[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) {
    const p = points[0]
    return `M ${p.x} ${p.y}`
  }

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx = (prev.x + curr.x) / 2
    d += ` Q ${cpx} ${prev.y} ${curr.x} ${curr.y}`
  }
  return d
}

/** Comprimento aproximado do path para animacao de progresso */
export function getPathLength(points: JourneyPoint[]): number {
  let len = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    len += Math.hypot(dx, dy)
  }
  return len
}

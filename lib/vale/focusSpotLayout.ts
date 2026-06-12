export interface FocusSpot {
  id: string
  label: string
  /** Centro horizontal (% da viewport) */
  x: number
  /** Centro vertical (% da viewport) */
  y: number
  /** Raio do recorte de nitidez (vmin) */
  r: number
}

export const DEFAULT_FOCUS_SPOTS: FocusSpot[] = [
  { id: 'focus-1', label: 'Entrada / árvore', x: 63.4, y: 56.2, r: 5.9 },
  { id: 'focus-2', label: 'Telhado', x: 73.4, y: 45.4, r: 9.5 },
  { id: 'focus-3', label: 'Cogumelos', x: 80.8, y: 61.2, r: 9 },
  { id: 'focus-4', label: 'Cadu / caminho', x: 44, y: 78, r: 13.5 },
]

export type FocusSpotOverrides = Record<string, Partial<Pick<FocusSpot, 'x' | 'y' | 'r'>>>

export function mergeFocusSpots(overrides: FocusSpotOverrides): FocusSpot[] {
  return DEFAULT_FOCUS_SPOTS.map((spot) => ({
    ...spot,
    ...overrides[spot.id],
  }))
}

export function focusSpotsToCssVars(spots: FocusSpot[]): Record<string, string> {
  const vars: Record<string, string> = {}
  spots.forEach((spot, index) => {
    const n = index + 1
    vars[`--vale-focus-${n}-x`] = `${spot.x}%`
    vars[`--vale-focus-${n}-y`] = `${spot.y}%`
    vars[`--vale-focus-${n}-r`] = `${spot.r}vmin`
  })
  return vars
}

export function formatFocusSpotExport(spots: FocusSpot[]): string {
  const lines = spots.map(
    (s, i) =>
      `  --vale-focus-${i + 1}-x: ${s.x.toFixed(1)}%;\n  --vale-focus-${i + 1}-y: ${s.y.toFixed(1)}%;\n  --vale-focus-${i + 1}-r: ${s.r.toFixed(1)}vmin;`,
  )
  return `// Cole em components/vale/vale.css (.vale-page--hero)\n${lines.join('\n')}`
}

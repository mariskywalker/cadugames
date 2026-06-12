import { STONE_NODES, type StoneNodeLayout } from './stoneNodes'

export const STONE_NODE_EDITOR_STORAGE_KEY = 'cadu.vale.stone-nodes.overrides'

export type StoneNodeOverride = Partial<
  Pick<StoneNodeLayout, 'hitU' | 'hitV' | 'hitSize' | 'zIndex'>
>

export type StoneNodeOverrides = Record<string, StoneNodeOverride>

export function loadStoneNodeOverrides(): StoneNodeOverrides {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STONE_NODE_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { objects?: StoneNodeOverrides }
    return data?.objects ?? {}
  } catch {
    return {}
  }
}

export function saveStoneNodeOverrides(objects: StoneNodeOverrides) {
  try {
    localStorage.setItem(
      STONE_NODE_EDITOR_STORAGE_KEY,
      JSON.stringify({ version: 2, objects, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function mergeStoneNodes(overrides: StoneNodeOverrides): StoneNodeLayout[] {
  return STONE_NODES.map((node) => ({
    ...node,
    ...overrides[node.id],
  }))
}

export function parsePercent(value: string): number {
  return parseFloat(value) || 0
}

export function parseVw(value: string): number {
  return parseFloat(value) || 0
}

export function formatStoneNodeExport(nodes: StoneNodeLayout[]): string {
  const blocks = nodes.map(
    (n) => `  {
    id: '${n.id}',
    label: '${n.label}',
    emoji: '${n.emoji}',
    actionId: '${n.actionId}',
    variant: '${n.variant}',
    hitU: ${n.hitU},
    hitV: ${n.hitV},
    hitSize: ${n.hitSize},
    zIndex: ${n.zIndex},
  }`,
  )
  return `// Cole em lib/vale/stoneNodes.ts + stonePathLayout.ts\n[\n${blocks.join(',\n')}\n]`
}

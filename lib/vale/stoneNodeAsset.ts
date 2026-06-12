/**
 * Asset SVG único das pedras do caminho.
 * Substitua o arquivo em public/vale/path-stones/stone-node.svg pelo seu render.
 */

export const STONE_NODE_ASSET = {
  src: '/vale/path-stones/stone-node.svg',
  width: 256,
  height: 220,
} as const

export const STONE_NODE_ASSET_STORAGE_KEY = 'cadu.vale.stone-node.asset'

export function loadStoneNodeAssetSrc(): string {
  if (typeof window === 'undefined') return STONE_NODE_ASSET.src
  try {
    return localStorage.getItem(STONE_NODE_ASSET_STORAGE_KEY) ?? STONE_NODE_ASSET.src
  } catch {
    return STONE_NODE_ASSET.src
  }
}

export function saveStoneNodeAssetSrc(src: string) {
  try {
    localStorage.setItem(STONE_NODE_ASSET_STORAGE_KEY, src)
  } catch {
    // ignore
  }
}

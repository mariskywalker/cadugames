import {
  DEFAULT_PATH_LAYER,
  DEFAULT_PATH_LAYER_COPY,
  type PathLayerLayout,
} from './pathLayer'

export const PATH_LAYER_EDITOR_STORAGE_KEY = 'cadu.vale.path-layer.overrides'
export const PATH_LAYER_COPY_EDITOR_STORAGE_KEY = 'cadu.vale.path-layer-copy.overrides'
export const PATH_LAYER_ASSET_STORAGE_KEY = 'cadu.vale.path-layer.asset'
export const PATH_LAYER_COPY_ASSET_STORAGE_KEY = 'cadu.vale.path-layer-copy.asset'

export type PathLayerOverride = Partial<
  Pick<
    PathLayerLayout,
    | 'left'
    | 'bottom'
    | 'width'
    | 'translateXPx'
    | 'translateYPx'
    | 'translateZPx'
    | 'rotateDeg'
    | 'rotateXDeg'
    | 'rotateYDeg'
    | 'zIndex'
    | 'opacity'
  >
>

export function loadPathLayerOverride(): PathLayerOverride {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PATH_LAYER_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as PathLayerOverride
  } catch {
    return {}
  }
}

export function savePathLayerOverride(override: PathLayerOverride) {
  try {
    localStorage.setItem(PATH_LAYER_EDITOR_STORAGE_KEY, JSON.stringify(override))
  } catch {
    // ignore
  }
}

export function mergePathLayer(override: PathLayerOverride): PathLayerLayout {
  return { ...DEFAULT_PATH_LAYER, ...override }
}

export function loadPathLayerCopyOverride(): PathLayerOverride {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PATH_LAYER_COPY_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as PathLayerOverride
  } catch {
    return {}
  }
}

export function savePathLayerCopyOverride(override: PathLayerOverride) {
  try {
    localStorage.setItem(PATH_LAYER_COPY_EDITOR_STORAGE_KEY, JSON.stringify(override))
  } catch {
    // ignore
  }
}

export function mergePathLayerCopy(override: PathLayerOverride): PathLayerLayout {
  return { ...DEFAULT_PATH_LAYER_COPY, ...override }
}

export const PATH_LAYER_ASSET = {
  src: '/vale/path-stones/caminho-de-pedras.png',
  width: 1024,
  height: 682,
} as const

export const PATH_LAYER_COPY_ASSET = {
  src: '/vale/path-stones/caminho-de-pedras.svg',
  width: 1024,
  height: 682,
} as const

export function loadPathLayerAssetSrc(): string {
  if (typeof window === 'undefined') return PATH_LAYER_ASSET.src
  try {
    return localStorage.getItem(PATH_LAYER_ASSET_STORAGE_KEY) ?? PATH_LAYER_ASSET.src
  } catch {
    return PATH_LAYER_ASSET.src
  }
}

export function savePathLayerAssetSrc(src: string) {
  try {
    localStorage.setItem(PATH_LAYER_ASSET_STORAGE_KEY, src)
  } catch {
    // ignore
  }
}

export function loadPathLayerCopyAssetSrc(): string {
  if (typeof window === 'undefined') return PATH_LAYER_COPY_ASSET.src
  try {
    return localStorage.getItem(PATH_LAYER_COPY_ASSET_STORAGE_KEY) ?? PATH_LAYER_COPY_ASSET.src
  } catch {
    return PATH_LAYER_COPY_ASSET.src
  }
}

export function savePathLayerCopyAssetSrc(src: string) {
  try {
    localStorage.setItem(PATH_LAYER_COPY_ASSET_STORAGE_KEY, src)
  } catch {
    // ignore
  }
}

export function formatPathLayerExport(
  layer: PathLayerLayout,
  assetSrc: string,
  constName = 'DEFAULT_PATH_LAYER',
): string {
  const tx =
    layer.translateXPx != null && layer.translateXPx !== 0 ? `\n  translateXPx: ${layer.translateXPx},` : ''
  const ty =
    layer.translateYPx != null && layer.translateYPx !== 0 ? `\n  translateYPx: ${layer.translateYPx},` : ''
  const tz =
    layer.translateZPx != null && layer.translateZPx !== 0 ? `\n  translateZPx: ${layer.translateZPx},` : ''
  const rotX =
    layer.rotateXDeg != null && layer.rotateXDeg !== 0 ? `\n  rotateXDeg: ${layer.rotateXDeg},` : ''
  const rotY =
    layer.rotateYDeg != null && layer.rotateYDeg !== 0 ? `\n  rotateYDeg: ${layer.rotateYDeg},` : ''
  return `// Cole em lib/vale/pathLayer.ts
export const ${constName} = {
  id: '${layer.id}',
  left: '${layer.left}',
  bottom: '${layer.bottom}',
  width: '${layer.width}',${tx}${ty}${tz}
  rotateDeg: ${layer.rotateDeg},${rotX}${rotY}
  zIndex: ${layer.zIndex},
  opacity: ${layer.opacity},
}
// Asset: ${assetSrc}`
}

export function formatStonePathHitsExport(
  nodes: { id: string; hitU: number; hitV: number; hitSize: number }[],
): string {
  const lines = nodes.map(
    (n) => `  '${n.id}': { u: ${n.hitU}, v: ${n.hitV}, size: ${n.hitSize} },`,
  )
  return `// Cole em lib/vale/stonePathLayout.ts\nexport const STONE_PATH_HIT_DEFAULTS = {\n${lines.join('\n')}\n}`
}

/** Chaves localStorage do Vale — limpar ao calibrar gameplay ou após mudanças de layout */
export const VALE_LOCAL_STORAGE_KEYS = [
  'cadu.vale.lastBearHotspot',
  'cadu.vale.bearTargets.overrides',
  'cadu.vale.walk-path.overrides',
  'cadu.vale.focus-spots.overrides',
  'cadu.vale.flowers.overrides',
  'cadu.vale.props.overrides',
  'cadu.vale.stone-nodes.overrides',
  'cadu.vale.path-layer.overrides',
  'cadu.vale.path-layer-copy.overrides',
  'cadu.vale.path-layer.asset',
  'cadu.vale.path-layer-copy.asset',
  'cadu.vale.stone-node.asset',
  'cadu.vale.camera.overrides',
  'cadu.vale.island.overrides',
  'cadu.vale.hotspots.hitArea.overrides',
] as const

/** Remove overrides salvos no browser (não mexe em rig/GLB) */
export function clearValeLocalStorageCache() {
  if (typeof window === 'undefined') return
  for (const key of VALE_LOCAL_STORAGE_KEYS) {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  }
}

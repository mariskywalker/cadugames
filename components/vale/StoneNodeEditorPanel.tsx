'use client'

import { useCallback } from 'react'
import {
  formatIslandExport,
  ISLAND_EDITOR_ID,
  type IslandLayout,
  type IslandOverride,
} from '@/lib/vale/islandEditorStorage'
import { PATH_LAYER_COPY_ID, PATH_LAYER_ID, type PathLayerLayout } from '@/lib/vale/pathLayer'
import {
  formatPathLayerExport,
  formatStonePathHitsExport,
  type PathLayerOverride,
} from '@/lib/vale/pathLayerEditorStorage'
import { STONE_NODES, type StoneNodeLayout } from '@/lib/vale/stoneNodes'
import {
  formatStoneNodeExport,
  parsePercent,
  parseVw,
  type StoneNodeOverrides,
} from '@/lib/vale/stoneNodeEditorStorage'

interface StoneNodeEditorPanelProps {
  nodes: StoneNodeLayout[]
  pathLayer: PathLayerLayout
  pathLayerOverride: PathLayerOverride
  pathLayerCopy: PathLayerLayout
  pathLayerCopyOverride: PathLayerOverride
  islandLayout: IslandLayout
  islandOverride: IslandOverride
  selectedId: string
  overrides: StoneNodeOverrides
  assetSrc: string
  copyAssetSrc: string
  onAssetSrcChange: (src: string) => void
  onCopyAssetSrcChange: (src: string) => void
  onApplyAsset: () => void
  onApplyCopyAsset: () => void
  onReloadAsset: () => void
  onReloadCopyAsset: () => void
  onSelect: (id: string) => void
  onPatch: (id: string, patch: StoneNodeOverrides[string]) => void
  onPatchPathLayer: (patch: PathLayerOverride) => void
  onPatchPathLayerCopy: (patch: PathLayerOverride) => void
  onPatchIsland: (patch: IslandOverride) => void
  onResetNode: (id: string) => void
  onResetPathLayer: () => void
  onResetPathLayerCopy: () => void
  onResetIsland: () => void
  onResetAll: () => void
  onClose: () => void
  message: string | null
}

export function StoneNodeEditorPanel({
  nodes,
  pathLayer,
  pathLayerOverride,
  pathLayerCopy,
  pathLayerCopyOverride,
  islandLayout,
  islandOverride,
  selectedId,
  overrides,
  assetSrc,
  copyAssetSrc,
  onAssetSrcChange,
  onCopyAssetSrcChange,
  onApplyAsset,
  onApplyCopyAsset,
  onReloadAsset,
  onReloadCopyAsset,
  onSelect,
  onPatch,
  onPatchPathLayer,
  onPatchPathLayerCopy,
  onPatchIsland,
  onResetNode,
  onResetPathLayer,
  onResetPathLayerCopy,
  onResetIsland,
  onResetAll,
  onClose,
  message,
}: StoneNodeEditorPanelProps) {
  const isPathSelected = selectedId === PATH_LAYER_ID
  const isPathCopySelected = selectedId === PATH_LAYER_COPY_ID
  const isAnyPathSelected = isPathSelected || isPathCopySelected
  const activePathLayer = isPathCopySelected ? pathLayerCopy : pathLayer
  const activePathOverride = isPathCopySelected ? pathLayerCopyOverride : pathLayerOverride
  const activeAssetSrc = isPathCopySelected ? copyAssetSrc : assetSrc
  const isIslandSelected = selectedId === ISLAND_EDITOR_ID
  const selectedStone = nodes.find((n) => n.id === selectedId) ?? nodes[0]

  const patchStone = useCallback(
    (field: 'hitU' | 'hitV' | 'hitSize' | 'zIndex', raw: number) => {
      if (!selectedStone) return
      onPatch(selectedStone.id, { [field]: raw })
    },
    [onPatch, selectedStone],
  )

  const patchPath = useCallback(
    (
      field:
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
        | 'opacity',
      raw: number,
    ) => {
      const patch =
        field === 'left'
          ? { left: `${raw}%` }
          : field === 'bottom'
            ? { bottom: `${raw}%` }
            : field === 'width'
              ? { width: `${raw}vw` }
              : { [field]: raw }
      if (isPathCopySelected) onPatchPathLayerCopy(patch)
      else onPatchPathLayer(patch)
    },
    [isPathCopySelected, onPatchPathLayer, onPatchPathLayerCopy],
  )

  const copyExport = useCallback(async () => {
    const parts = [
      formatIslandExport(islandLayout),
      formatPathLayerExport(pathLayer, assetSrc),
      formatPathLayerExport(pathLayerCopy, copyAssetSrc, 'DEFAULT_PATH_LAYER_COPY'),
      formatStonePathHitsExport(nodes),
      formatStoneNodeExport(nodes),
    ]
    const text = isIslandSelected
      ? formatIslandExport(islandLayout)
      : isPathCopySelected
        ? formatPathLayerExport(pathLayerCopy, copyAssetSrc, 'DEFAULT_PATH_LAYER_COPY')
        : isPathSelected
          ? `${formatPathLayerExport(pathLayer, assetSrc)}\n\n${formatIslandExport(islandLayout)}`
          : parts.join('\n\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
  }, [
    isIslandSelected,
    isPathCopySelected,
    isPathSelected,
    nodes,
    pathLayer,
    pathLayerCopy,
    assetSrc,
    copyAssetSrc,
    islandLayout,
  ])

  const resetSelected = useCallback(() => {
    if (isPathCopySelected) onResetPathLayerCopy()
    else if (isPathSelected) onResetPathLayer()
    else if (isIslandSelected) onResetIsland()
    else onResetNode(selectedId)
  }, [
    isPathCopySelected,
    isPathSelected,
    isIslandSelected,
    onResetPathLayerCopy,
    onResetPathLayer,
    onResetIsland,
    onResetNode,
    selectedId,
  ])

  const resetLabel = isPathCopySelected
    ? 'Reset cópia'
    : isPathSelected
      ? 'Reset caminho'
      : isIslandSelected
        ? 'Reset casa'
        : 'Reset pedra'

  return (
    <div className="stone-editor-panel" role="dialog" aria-label="Editor do Vale">
      <div className="stone-editor-panel__header">
        <span className="stone-editor-panel__title">Editor do Vale</span>
        <button type="button" className="stone-editor-panel__close" onClick={onClose} aria-label="Fechar">
          ×
        </button>
      </div>

      <p className="stone-editor-panel__hint">
        <kbd>G</kbd> alterna · arraste = posição · <kbd>Shift</kbd>+arraste = offset px ·{' '}
        <kbd>Alt</kbd>+arraste ou scroll = profundidade Z
      </p>

      {isAnyPathSelected && (
        <div className="stone-editor-panel__asset">
          <label className="stone-editor-panel__asset-label">
            {isPathCopySelected ? 'Imagem da cópia (PNG/SVG)' : 'Imagem do caminho (PNG/SVG)'}
            <input
              type="text"
              className="stone-editor-panel__asset-input"
              value={activeAssetSrc}
              onChange={(e) =>
                isPathCopySelected
                  ? onCopyAssetSrcChange(e.target.value)
                  : onAssetSrcChange(e.target.value)
              }
              placeholder={
                isPathCopySelected
                  ? '/vale/path-stones/caminho-de-pedras.svg'
                  : '/vale/path-stones/caminho-de-pedras.png'
              }
            />
          </label>
          <div className="stone-editor-panel__asset-actions">
            <button
              type="button"
              className="stone-editor-panel__btn"
              onClick={isPathCopySelected ? onApplyCopyAsset : onApplyAsset}
            >
              Aplicar imagem
            </button>
            <button
              type="button"
              className="stone-editor-panel__btn stone-editor-panel__btn--ghost"
              onClick={isPathCopySelected ? onReloadCopyAsset : onReloadAsset}
            >
              Recarregar
            </button>
          </div>
        </div>
      )}

      <div className="stone-editor-panel__objects">
        <button
          type="button"
          className={`stone-editor-panel__obj stone-editor-panel__obj--path${isPathSelected ? ' is-active' : ''}${Object.keys(pathLayerOverride).length ? ' has-override' : ''}`}
          onClick={() => onSelect(PATH_LAYER_ID)}
        >
          🛤 Caminho
        </button>
        <button
          type="button"
          className={`stone-editor-panel__obj stone-editor-panel__obj--path${isPathCopySelected ? ' is-active' : ''}${Object.keys(pathLayerCopyOverride).length ? ' has-override' : ''}`}
          onClick={() => onSelect(PATH_LAYER_COPY_ID)}
        >
          🛤 Caminho 2
        </button>
        <button
          type="button"
          className={`stone-editor-panel__obj stone-editor-panel__obj--path${isIslandSelected ? ' is-active' : ''}${Object.keys(islandOverride).length ? ' has-override' : ''}`}
          onClick={() => onSelect(ISLAND_EDITOR_ID)}
        >
          🏡 Casa
        </button>
        {STONE_NODES.map((n) => (
          <button
            key={n.id}
            type="button"
            className={`stone-editor-panel__obj${selectedId === n.id ? ' is-active' : ''}${overrides[n.id] ? ' has-override' : ''}`}
            onClick={() => onSelect(n.id)}
          >
            {n.emoji} {n.id.replace('stone-', '#')}
          </button>
        ))}
      </div>

      {isIslandSelected && (
        <div className="stone-editor-panel__fields">
          <label className="stone-editor-panel__field">
            <span>offset X (esq/dir)</span>
            <input
              type="range"
              min={-6}
              max={6}
              step={0.05}
              value={Math.min(6, Math.max(-6, islandLayout.offsetX))}
              onChange={(e) => onPatchIsland({ offsetX: +e.target.value })}
            />
            <input
              type="number"
              step={0.05}
              value={islandLayout.offsetX}
              onChange={(e) => onPatchIsland({ offsetX: +e.target.value })}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>offset Y (cima/baixo)</span>
            <input
              type="range"
              min={-5}
              max={2}
              step={0.05}
              value={Math.min(2, Math.max(-5, islandLayout.offsetY))}
              onChange={(e) => onPatchIsland({ offsetY: +e.target.value })}
            />
            <input
              type="number"
              step={0.05}
              value={islandLayout.offsetY}
              onChange={(e) => onPatchIsland({ offsetY: +e.target.value })}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>offset Z (profundidade)</span>
            <input
              type="range"
              min={-15}
              max={6}
              step={0.05}
              value={Math.min(6, Math.max(-15, islandLayout.offsetZ))}
              onChange={(e) => onPatchIsland({ offsetZ: +e.target.value })}
            />
            <input
              type="number"
              step={0.05}
              value={islandLayout.offsetZ}
              onChange={(e) => onPatchIsland({ offsetZ: +e.target.value })}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>rotate Y (deg)</span>
            <input
              type="range"
              min={-45}
              max={45}
              step={0.5}
              value={islandLayout.rotationYDeg}
              onChange={(e) => onPatchIsland({ rotationYDeg: +e.target.value })}
            />
            <input
              type="number"
              step={0.5}
              value={islandLayout.rotationYDeg}
              onChange={(e) => onPatchIsland({ rotationYDeg: +e.target.value })}
            />
          </label>
          <code className="stone-editor-panel__readout">
            X: {islandLayout.offsetX} · Y: {islandLayout.offsetY} · Z: {islandLayout.offsetZ} · rot:{' '}
            {islandLayout.rotationYDeg}°
          </code>
          <p className="stone-editor-panel__subhint">
            Profundidade: Z mais negativo = mais ao fundo · Z positivo = mais perto. O campo numérico
            aceita qualquer valor (ex.: −8, −10).
          </p>
        </div>
      )}

      {isAnyPathSelected && (
        <div className="stone-editor-panel__fields">
          <label className="stone-editor-panel__field">
            <span>left (%)</span>
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={parsePercent(activePathLayer.left)}
              onChange={(e) => patchPath('left', +e.target.value)}
            />
            <input
              type="number"
              step={0.5}
              value={parsePercent(activePathLayer.left)}
              onChange={(e) => patchPath('left', +e.target.value)}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>bottom (%)</span>
            <input
              type="range"
              min={0}
              max={90}
              step={0.5}
              value={parsePercent(activePathLayer.bottom)}
              onChange={(e) => patchPath('bottom', +e.target.value)}
            />
            <input
              type="number"
              step={0.5}
              value={parsePercent(activePathLayer.bottom)}
              onChange={(e) => patchPath('bottom', +e.target.value)}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>offset X (px)</span>
            <input
              type="range"
              min={-400}
              max={400}
              step={1}
              value={activePathLayer.translateXPx ?? 0}
              onChange={(e) => patchPath('translateXPx', +e.target.value)}
            />
            <input
              type="number"
              step={1}
              value={activePathLayer.translateXPx ?? 0}
              onChange={(e) => patchPath('translateXPx', +e.target.value)}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>offset Y (px)</span>
            <input
              type="range"
              min={-400}
              max={400}
              step={1}
              value={activePathLayer.translateYPx ?? 0}
              onChange={(e) => patchPath('translateYPx', +e.target.value)}
            />
            <input
              type="number"
              step={1}
              value={activePathLayer.translateYPx ?? 0}
              onChange={(e) => patchPath('translateYPx', +e.target.value)}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>profundidade Z (px)</span>
            <input
              type="range"
              min={-500}
              max={500}
              step={1}
              value={activePathLayer.translateZPx ?? 0}
              onChange={(e) => patchPath('translateZPx', +e.target.value)}
            />
            <input
              type="number"
              step={1}
              value={activePathLayer.translateZPx ?? 0}
              onChange={(e) => patchPath('translateZPx', +e.target.value)}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>width (vw)</span>
            <input
              type="range"
              min={20}
              max={80}
              step={0.25}
              value={parseVw(activePathLayer.width)}
              onChange={(e) => patchPath('width', +e.target.value)}
            />
            <input
              type="number"
              step={0.25}
              value={parseVw(activePathLayer.width)}
              onChange={(e) => patchPath('width', +e.target.value)}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>rotate X (°)</span>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={activePathLayer.rotateXDeg ?? 0}
              onChange={(e) => patchPath('rotateXDeg', +e.target.value)}
            />
            <input
              type="number"
              step={1}
              value={activePathLayer.rotateXDeg ?? 0}
              onChange={(e) => patchPath('rotateXDeg', +e.target.value)}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>rotate Y (°)</span>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={activePathLayer.rotateYDeg ?? 0}
              onChange={(e) => patchPath('rotateYDeg', +e.target.value)}
            />
            <input
              type="number"
              step={1}
              value={activePathLayer.rotateYDeg ?? 0}
              onChange={(e) => patchPath('rotateYDeg', +e.target.value)}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>rotate Z (°)</span>
            <input
              type="range"
              min={-180}
              max={180}
              step={0.5}
              value={activePathLayer.rotateDeg}
              onChange={(e) => patchPath('rotateDeg', +e.target.value)}
            />
            <input
              type="number"
              step={0.5}
              value={activePathLayer.rotateDeg}
              onChange={(e) => patchPath('rotateDeg', +e.target.value)}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>z-index</span>
            <input
              type="range"
              min={0}
              max={12}
              step={1}
              value={activePathLayer.zIndex}
              onChange={(e) => patchPath('zIndex', +e.target.value)}
            />
            <input
              type="number"
              step={1}
              value={activePathLayer.zIndex}
              onChange={(e) => patchPath('zIndex', +e.target.value)}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>opacity</span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={activePathLayer.opacity}
              onChange={(e) => patchPath('opacity', +e.target.value)}
            />
            <input
              type="number"
              min={0.1}
              max={1}
              step={0.05}
              value={activePathLayer.opacity}
              onChange={(e) => patchPath('opacity', +e.target.value)}
            />
          </label>
          <code className="stone-editor-panel__readout">
            {isPathCopySelected ? 'Cópia · ' : ''}
            {activePathLayer.left} · {activePathLayer.bottom} · {activePathLayer.width} · off{' '}
            {activePathLayer.translateXPx ?? 0}/{activePathLayer.translateYPx ?? 0}/
            {activePathLayer.translateZPx ?? 0}px · rot {activePathLayer.rotateXDeg ?? 0}°/
            {activePathLayer.rotateYDeg ?? 0}°/{activePathLayer.rotateDeg}°
            {Object.keys(activePathOverride).length ? ' · editado' : ''}
          </code>
        </div>
      )}

      {!isIslandSelected && !isAnyPathSelected && selectedStone && (
        <div className="stone-editor-panel__fields">
          <label className="stone-editor-panel__field">
            <span>u — esquerda na imagem (%)</span>
            <input
              type="range"
              min={0}
              max={90}
              step={0.5}
              value={selectedStone.hitU}
              onChange={(e) => patchStone('hitU', +e.target.value)}
            />
            <input
              type="number"
              step={0.5}
              value={selectedStone.hitU}
              onChange={(e) => patchStone('hitU', +e.target.value)}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>v — topo na imagem (%)</span>
            <input
              type="range"
              min={0}
              max={90}
              step={0.5}
              value={selectedStone.hitV}
              onChange={(e) => patchStone('hitV', +e.target.value)}
            />
            <input
              type="number"
              step={0.5}
              value={selectedStone.hitV}
              onChange={(e) => patchStone('hitV', +e.target.value)}
            />
          </label>
          <label className="stone-editor-panel__field">
            <span>size (% da largura)</span>
            <input
              type="range"
              min={4}
              max={22}
              step={0.5}
              value={selectedStone.hitSize}
              onChange={(e) => patchStone('hitSize', +e.target.value)}
            />
            <input
              type="number"
              step={0.5}
              value={selectedStone.hitSize}
              onChange={(e) => patchStone('hitSize', +e.target.value)}
            />
          </label>
          <code className="stone-editor-panel__readout">
            u: {selectedStone.hitU}% · v: {selectedStone.hitV}% · size: {selectedStone.hitSize}%
          </code>
          <p className="stone-editor-panel__subhint">
            Clique dentro do PNG — cada hotspot segue a pedra na imagem do caminho.
          </p>
        </div>
      )}

      {message && <p className="stone-editor-panel__msg">{message}</p>}

      <div className="stone-editor-panel__actions">
        <button type="button" className="stone-editor-panel__btn" onClick={() => void copyExport()}>
          Copiar valores
        </button>
        <button
          type="button"
          className="stone-editor-panel__btn stone-editor-panel__btn--ghost"
          onClick={resetSelected}
        >
          {resetLabel}
        </button>
        <button
          type="button"
          className="stone-editor-panel__btn stone-editor-panel__btn--ghost"
          onClick={onResetAll}
        >
          Reset tudo
        </button>
      </div>
    </div>
  )
}

'use client'

import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ValeActionSheet } from '@/components/life/vale/ValeActionSheet'
import { useStoneNodeEditorMode } from '@/hooks/vale/useStoneNodeEditorMode'
import { childProfile } from '@/lib/mockChildProfile'
import { getValeAction, valeHubActions, type ValeAction } from '@/lib/valeHubData'
import { ISLAND_EDITOR_ID } from '@/lib/vale/islandEditorStorage'
import {
  DEFAULT_PATH_LAYER,
  DEFAULT_PATH_LAYER_COPY,
  PATH_LAYER_COPY_ID,
  PATH_LAYER_ID,
} from '@/lib/vale/pathLayer'
import {
  loadPathLayerAssetSrc,
  loadPathLayerCopyAssetSrc,
  loadPathLayerCopyOverride,
  loadPathLayerOverride,
  mergePathLayer,
  mergePathLayerCopy,
  PATH_LAYER_ASSET,
  PATH_LAYER_COPY_ASSET,
  savePathLayerAssetSrc,
  savePathLayerCopyAssetSrc,
  savePathLayerCopyOverride,
  savePathLayerOverride,
  type PathLayerOverride,
} from '@/lib/vale/pathLayerEditorStorage'
import {
  loadStoneNodeOverrides,
  mergeStoneNodes,
  saveStoneNodeOverrides,
  type StoneNodeOverrides,
} from '@/lib/vale/stoneNodeEditorStorage'
import { STONE_NODES } from '@/lib/vale/stoneNodes'
import { useValeIslandEditorStore } from '@/store/useValeIslandEditorStore'
import { CasaUrsoHubModal } from './CasaUrsoHubModal'
import { StonePathHotspot } from './StonePathHotspot'
import type { StoneNodeState } from '@/lib/vale/stoneNodes'
import { StoneNodeEditorPanel } from './StoneNodeEditorPanel'
import { ValePathLayer } from './ValePathLayer'

function getNodeState(index: number, actionId: string): StoneNodeState {
  if (actionId === 'casa-urso') {
    const prevDone =
      index > 0 && getNodeState(index - 1, STONE_NODES[index - 1].actionId) === 'completed'
    return prevDone ? 'current' : 'locked'
  }

  const action = valeHubActions.find((a) => a.id === actionId)
  if (action?.state === 'completed') return 'completed'
  if (action?.state === 'locked') return 'locked'

  const completed = childProfile.completedActivities
  const total = Math.max(childProfile.totalActivities, 1)
  const progressIndex = Math.min(
    STONE_NODES.length - 2,
    Math.floor((completed / total) * (STONE_NODES.length - 1)),
  )

  if (index < progressIndex) return 'completed'
  if (index === progressIndex) return 'current'
  return 'locked'
}

export function ValeProgressPath({
  heroMode = false,
  editorMode: editorModeProp,
  setEditorMode: setEditorModeProp,
  message: messageProp,
  setMessage: setMessageProp,
}: {
  heroMode?: boolean
  editorMode?: boolean
  setEditorMode?: (active: boolean) => void
  message?: string | null
  setMessage?: (msg: string | null) => void
}) {
  const internal = useStoneNodeEditorMode()
  const editorMode = editorModeProp ?? internal.editorMode
  const setEditorMode = setEditorModeProp ?? internal.setEditorMode
  const message = messageProp ?? internal.message
  const setMessage = setMessageProp ?? internal.setMessage
  const islandLayout = useValeIslandEditorStore((s) => s.layout)
  const islandOverride = useValeIslandEditorStore((s) => s.override)
  const hydrateIsland = useValeIslandEditorStore((s) => s.hydrate)
  const setIslandEditorActive = useValeIslandEditorStore((s) => s.setEditorActive)
  const patchIsland = useValeIslandEditorStore((s) => s.patch)
  const resetIsland = useValeIslandEditorStore((s) => s.reset)
  const [overrides, setOverrides] = useState<StoneNodeOverrides>(() => loadStoneNodeOverrides())
  const [pathLayerOverride, setPathLayerOverride] = useState<PathLayerOverride>(() =>
    loadPathLayerOverride(),
  )
  const [pathLayerCopyOverride, setPathLayerCopyOverride] = useState<PathLayerOverride>(() =>
    loadPathLayerCopyOverride(),
  )
  const [assetSrc, setAssetSrc] = useState(() => loadPathLayerAssetSrc())
  const [copyAssetSrc, setCopyAssetSrc] = useState(() => loadPathLayerCopyAssetSrc())
  const [assetVersion, setAssetVersion] = useState(0)
  const [copyAssetVersion, setCopyAssetVersion] = useState(0)
  const [selectedId, setSelectedId] = useState(PATH_LAYER_ID)
  const [activeActionId, setActiveActionId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [houseHubOpen, setHouseHubOpen] = useState(false)

  useEffect(() => {
    hydrateIsland()
  }, [hydrateIsland])

  useEffect(() => {
    setIslandEditorActive(editorMode)
  }, [editorMode, setIslandEditorActive])

  useEffect(() => {
    if (editorMode && heroMode) {
      setSelectedId(ISLAND_EDITOR_ID)
      setMessage('Editor ativo — aba 🏡 Casa para mover a Casa do Urso.')
    }
  }, [editorMode, heroMode, setMessage])

  const nodes = useMemo(
    () => (editorMode ? mergeStoneNodes(overrides) : STONE_NODES),
    [editorMode, overrides],
  )
  const pathLayer = useMemo(
    () => (editorMode ? mergePathLayer(pathLayerOverride) : DEFAULT_PATH_LAYER),
    [editorMode, pathLayerOverride],
  )
  const pathLayerCopy = useMemo(
    () => (editorMode ? mergePathLayerCopy(pathLayerCopyOverride) : DEFAULT_PATH_LAYER_COPY),
    [editorMode, pathLayerCopyOverride],
  )

  const nodeStates = useMemo(
    () => STONE_NODES.map((n, i) => getNodeState(i, n.actionId)),
    [],
  )

  const activeAction: ValeAction | null = activeActionId
    ? getValeAction(activeActionId) ?? null
    : null

  const persistOverrides = useCallback((next: StoneNodeOverrides) => {
    setOverrides(next)
    saveStoneNodeOverrides(next)
  }, [])

  const persistPathLayer = useCallback((next: PathLayerOverride) => {
    setPathLayerOverride(next)
    savePathLayerOverride(next)
  }, [])

  const persistPathLayerCopy = useCallback((next: PathLayerOverride) => {
    setPathLayerCopyOverride(next)
    savePathLayerCopyOverride(next)
  }, [])

  const patchNode = useCallback(
    (id: string, patch: StoneNodeOverrides[string]) => {
      persistOverrides({
        ...overrides,
        [id]: { ...overrides[id], ...patch },
      })
    },
    [overrides, persistOverrides],
  )

  const patchPathLayer = useCallback(
    (patch: PathLayerOverride) => {
      persistPathLayer({ ...pathLayerOverride, ...patch })
    },
    [pathLayerOverride, persistPathLayer],
  )

  const patchPathLayerCopy = useCallback(
    (patch: PathLayerOverride) => {
      persistPathLayerCopy({ ...pathLayerCopyOverride, ...patch })
    },
    [pathLayerCopyOverride, persistPathLayerCopy],
  )

  const handleMovePath = useCallback(
    (patch: PathLayerOverride) => {
      patchPathLayer(patch)
    },
    [patchPathLayer],
  )

  const handleMovePathCopy = useCallback(
    (patch: PathLayerOverride) => {
      patchPathLayerCopy(patch)
    },
    [patchPathLayerCopy],
  )

  const handleNodeClick = useCallback((actionId: string) => {
    if (actionId === 'casa-urso') {
      setHouseHubOpen(true)
      return
    }
    setActiveActionId(actionId)
    setFeedback(null)
  }, [])

  const handlePick = useCallback(
    (word: string) => {
      if (!activeAction) return
      setFeedback(activeAction.sheet.pickFeedback.replace('assim', `"${word}"`))
    },
    [activeAction],
  )

  if (heroMode && !editorMode) return null

  return (
    <>
      <div
        className="vale-stone-nodes stone-path-layer"
        aria-label="Caminho de pedras — jornada até a Casa do Urso"
      >
        <ValePathLayer
          layer={pathLayerCopy}
          assetSrc={copyAssetSrc}
          assetWidth={PATH_LAYER_COPY_ASSET.width}
          assetHeight={PATH_LAYER_COPY_ASSET.height}
          assetVersion={copyAssetVersion}
          editorMode={editorMode}
          selected={selectedId === PATH_LAYER_COPY_ID}
          onSelect={() => setSelectedId(PATH_LAYER_COPY_ID)}
          onMove={handleMovePathCopy}
        />
        <ValePathLayer
          layer={pathLayer}
          assetSrc={assetSrc}
          assetWidth={PATH_LAYER_ASSET.width}
          assetHeight={PATH_LAYER_ASSET.height}
          assetVersion={assetVersion}
          editorMode={editorMode}
          selected={selectedId === PATH_LAYER_ID}
          onSelect={() => setSelectedId(PATH_LAYER_ID)}
          onMove={handleMovePath}
        >
          {nodes.map((node, i) => (
            <StonePathHotspot
              key={node.id}
              node={node}
              state={nodeStates[i]}
              editorMode={editorMode}
              selected={selectedId === node.id}
              onSelect={() => setSelectedId(node.id)}
              onClick={() => handleNodeClick(node.actionId)}
            />
          ))}
        </ValePathLayer>
      </div>

      {editorMode &&
        typeof document !== 'undefined' &&
        createPortal(
          <StoneNodeEditorPanel
            nodes={nodes}
            pathLayer={pathLayer}
            pathLayerOverride={pathLayerOverride}
            pathLayerCopy={pathLayerCopy}
            pathLayerCopyOverride={pathLayerCopyOverride}
            islandLayout={islandLayout}
            islandOverride={islandOverride}
            selectedId={selectedId}
            overrides={overrides}
            assetSrc={assetSrc}
            copyAssetSrc={copyAssetSrc}
            onAssetSrcChange={setAssetSrc}
            onCopyAssetSrcChange={setCopyAssetSrc}
            onApplyAsset={() => {
              savePathLayerAssetSrc(assetSrc)
              setAssetVersion((v) => v + 1)
              setMessage(`Imagem aplicada: ${assetSrc}`)
            }}
            onApplyCopyAsset={() => {
              savePathLayerCopyAssetSrc(copyAssetSrc)
              setCopyAssetVersion((v) => v + 1)
              setMessage(`Imagem cópia aplicada: ${copyAssetSrc}`)
            }}
            onReloadAsset={() => {
              setAssetSrc(loadPathLayerAssetSrc())
              setAssetVersion((v) => v + 1)
              setMessage('Imagem recarregada.')
            }}
            onReloadCopyAsset={() => {
              setCopyAssetSrc(loadPathLayerCopyAssetSrc())
              setCopyAssetVersion((v) => v + 1)
              setMessage('Imagem cópia recarregada.')
            }}
            onSelect={setSelectedId}
            onPatch={patchNode}
            onPatchPathLayer={patchPathLayer}
            onPatchPathLayerCopy={patchPathLayerCopy}
            onPatchIsland={(patch) => {
              patchIsland(patch)
              setMessage('Casa do Urso atualizada.')
            }}
            onResetNode={(id) => {
              const next = { ...overrides }
              delete next[id]
              persistOverrides(next)
              setMessage('Hotspot resetado.')
            }}
            onResetPathLayer={() => {
              persistPathLayer({})
              setMessage('Caminho resetado.')
            }}
            onResetPathLayerCopy={() => {
              persistPathLayerCopy({})
              setMessage('Cópia do caminho resetada.')
            }}
            onResetIsland={() => {
              resetIsland()
              setMessage('Casa resetada.')
            }}
            onResetAll={() => {
              persistOverrides({})
              persistPathLayer({})
              persistPathLayerCopy({})
              resetIsland()
              setMessage('Tudo resetado.')
            }}
            onClose={() => {
              setEditorMode(false)
              setMessage(null)
            }}
            message={message}
          />,
          document.body,
        )}

      <AnimatePresence>
        {activeAction && !editorMode && !heroMode && (
          <ValeActionSheet
            action={activeAction}
            feedback={feedback}
            onPick={handlePick}
            onClose={() => {
              setActiveActionId(null)
              setFeedback(null)
            }}
          />
        )}
      </AnimatePresence>

      {houseHubOpen && !editorMode && !heroMode && (
        <CasaUrsoHubModal onClose={() => setHouseHubOpen(false)} />
      )}
    </>
  )
}

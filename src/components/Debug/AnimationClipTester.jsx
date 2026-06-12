import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { CADU_MODEL_URL } from '../../constants/characterModel'
import { CHARACTER_Y_OFFSET } from '../../constants/animations'
import {
  buildClipTesterCatalog,
  listRawGlbClipNames,
  logClipTesterAvailable,
  logClipTesterClick,
  logClipTesterPlaying,
  playClipFromActions,
  resolveFileClipNameForPlay,
} from '../../utils/glbClipTester'
import {
  loadEffectiveClipRenameMap,
  resetToVerifiedClipRenameMap,
  saveUserClipRenameMap,
} from '../../utils/clipRenameUserStorage'
import './animation-clip-tester.css'

const ClipTesterRig = forwardRef(function ClipTesterRig(
  { onCatalogReady, onActionsReady, fileToCanonicalRef },
  ref,
) {
  const modelRef = useRef()
  const { scene, animations: rawClips } = useGLTF(CADU_MODEL_URL)
  const { actions, mixer } = useAnimations(rawClips, modelRef)

  const groundedYOffset = useMemo(() => {
    const box = new THREE.Box3()
    const tmp = new THREE.Box3()
    scene.updateWorldMatrix(true, true)
    scene.traverse((obj) => {
      if (!obj?.isMesh || !obj.geometry) return
      const geom = obj.geometry
      if (!geom.boundingBox) geom.computeBoundingBox()
      if (!geom.boundingBox) return
      tmp.copy(geom.boundingBox)
      tmp.applyMatrix4(obj.matrixWorld)
      box.union(tmp)
    })
    if (!Number.isFinite(box.min.y)) return CHARACTER_Y_OFFSET
    return Math.max(0, -box.min.y) + CHARACTER_Y_OFFSET
  }, [scene])

  useEffect(() => {
    const fileNames = listRawGlbClipNames(rawClips)
    const map = fileToCanonicalRef.current ?? {}
    logClipTesterAvailable(fileNames, map)
    onCatalogReady(buildClipTesterCatalog(fileNames, map))
  }, [rawClips, onCatalogReady, fileToCanonicalRef])

  useEffect(() => {
    if (!mixer || !actions) return
    if (Object.keys(actions).some((k) => actions[k])) onActionsReady(true)
  }, [actions, mixer, onActionsReady])

  useImperativeHandle(
    ref,
    () => ({
      playClip(clipName, { isRawFile = false } = {}) {
        const fileToCanonical = fileToCanonicalRef.current ?? {}
        logClipTesterClick(clipName, { isRawFile, fileToCanonical })
        const fileClipName = isRawFile
          ? clipName
          : resolveFileClipNameForPlay(clipName, fileToCanonical)
        const ok = playClipFromActions(actions, mixer, fileClipName)
        if (!ok) {
          console.error('[AnimationClipTester] clip not found:', fileClipName)
          return null
        }
        logClipTesterPlaying(clipName)
        return clipName
      },
    }),
    [actions, mixer, fileToCanonicalRef],
  )

  return (
    <group position={[0, groundedYOffset, 0]}>
      <primitive ref={modelRef} object={scene} />
    </group>
  )
})

function ClipTesterViewport({ rigRef, onCatalogReady, onActionsReady, fileToCanonicalRef }) {
  return (
    <>
      <color attach="background" args={['#e8e4e0']} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[3, 48]} />
        <meshStandardMaterial color="#d4cfc8" />
      </mesh>
      <ClipTesterRig
        ref={rigRef}
        onCatalogReady={onCatalogReady}
        onActionsReady={onActionsReady}
        fileToCanonicalRef={fileToCanonicalRef}
      />
      <OrbitControls makeDefault target={[0, 0.9, 0]} />
    </>
  )
}

export function AnimationClipTester() {
  const rigRef = useRef(null)
  const fileToCanonicalRef = useRef(loadEffectiveClipRenameMap())
  const [fileToCanonical, setFileToCanonical] = useState(() => loadEffectiveClipRenameMap())
  const [catalog, setCatalog] = useState({
    canonicalNames: [],
    rawFileNames: [],
    conflicts: [],
    assignedCount: 0,
  })
  const [playingClip, setPlayingClip] = useState(null)
  const [playingMode, setPlayingMode] = useState(null)
  const [actionsReady, setActionsReady] = useState(false)
  const [nameOptions, setNameOptions] = useState([])

  useEffect(() => {
    fileToCanonicalRef.current = fileToCanonical
  }, [fileToCanonical])

  useEffect(() => {
    useGLTF.preload(CADU_MODEL_URL)
  }, [])

  const refreshCatalog = useCallback((rawFileNames, map) => {
    setCatalog(buildClipTesterCatalog(rawFileNames, map))
    setNameOptions([...new Set([...rawFileNames, ...Object.values(map)])].sort())
  }, [])

  const handleCatalogReady = useCallback(
    (nextCatalog) => {
      setCatalog(nextCatalog)
      setNameOptions((prev) => {
        const merged = new Set([...prev, ...nextCatalog.rawFileNames, ...nextCatalog.canonicalNames])
        return [...merged].sort()
      })
    },
    [],
  )

  const handleActionsReady = useCallback(() => {
    setActionsReady(true)
  }, [])

  const setCanonicalForFile = (fileName, canonicalName) => {
    const next = { ...fileToCanonical }
    const trimmed = canonicalName.trim()
    if (!trimmed) delete next[fileName]
    else next[fileName] = trimmed
    fileToCanonicalRef.current = next
    setFileToCanonical(next)
    saveUserClipRenameMap(next)
    refreshCatalog(catalog.rawFileNames, next)
    console.log('[AnimationClipTester] saved mapping:', fileName, '→', trimmed || '(removed)')
  }

  const playClip = (clipName, { isRawFile = false } = {}) => {
    if (!actionsReady) {
      console.warn('[AnimationClipTester] actions not ready yet — wait for model load')
      return
    }
    const played = rigRef.current?.playClip(clipName, { isRawFile })
    if (played) {
      setPlayingClip(played)
      setPlayingMode(isRawFile ? 'raw' : 'canonical')
    }
  }

  const copyMap = () => {
    const text = JSON.stringify(fileToCanonical, null, 2)
    try {
      navigator.clipboard.writeText(text)
      console.log('[AnimationClipTester] map copied to clipboard')
    } catch {
      console.log('[AnimationClipTester] map:', text)
    }
  }

  const resetMap = () => {
    const verified = resetToVerifiedClipRenameMap()
    fileToCanonicalRef.current = verified
    setFileToCanonical(verified)
    refreshCatalog(catalog.rawFileNames, verified)
  }

  return (
    <div className="cadu-clip-tester" aria-label="Animation clip tester">
      <aside className="cadu-clip-tester__panel">
        <header className="cadu-clip-tester__head">
          <h2 className="cadu-clip-tester__title">AnimationClipTester</h2>
          <p className="cadu-clip-tester__hint">
            {actionsReady
              ? `Edite: toque ▶ no raw, digite o nome correto. ${catalog.assignedCount}/${catalog.rawFileNames.length} mapeados.`
              : 'Loading model…'}
          </p>
        </header>

        {catalog.conflicts.length > 0 && (
          <p className="cadu-clip-tester__warn" role="alert">
            Nome corrigido duplicado: {catalog.conflicts.join(', ')}
          </p>
        )}

        <h3 className="cadu-clip-tester__section">Editar — raw → nome corrigido</h3>
        <ul className="cadu-clip-tester__edit-list">
          {catalog.rawFileNames.map((fileName) => (
            <li key={fileName} className="cadu-clip-tester__edit-row">
              <button
                type="button"
                className={`cadu-clip-tester__play${playingClip === fileName && playingMode === 'raw' ? ' is-active' : ''}`}
                disabled={!actionsReady}
                onClick={() => playClip(fileName, { isRawFile: true })}
                title={`Tocar ${fileName}`}
              >
                ▶
              </button>
              <div className="cadu-clip-tester__edit-fields">
                <span className="cadu-clip-tester__edit-file">{fileName}</span>
                <input
                  className="cadu-clip-tester__edit-input"
                  list="cadu-clip-name-options"
                  placeholder="nome corrigido (ex: Idle_11)"
                  value={fileToCanonical[fileName] ?? ''}
                  onChange={(e) =>
                    setFileToCanonical((prev) => ({ ...prev, [fileName]: e.target.value }))
                  }
                  onBlur={(e) => setCanonicalForFile(fileName, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      setCanonicalForFile(fileName, e.currentTarget.value)
                      e.currentTarget.blur()
                    }
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
        <datalist id="cadu-clip-name-options">
          {nameOptions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <div className="cadu-clip-tester__edit-actions">
          <button type="button" className="cadu-clip-tester__action" onClick={copyMap}>
            Copiar mapa
          </button>
          <button type="button" className="cadu-clip-tester__action" onClick={resetMap}>
            Resetar ao mapa verificado
          </button>
        </div>

        <h3 className="cadu-clip-tester__section">Nomes corrigidos (seu mapa)</h3>
        {catalog.canonicalNames.length === 0 ? (
          <p className="cadu-clip-tester__empty">Nenhum mapeamento ainda — edite acima.</p>
        ) : (
          <ul className="cadu-clip-tester__list">
            {catalog.canonicalNames.map((clipName) => (
              <li key={clipName}>
                <button
                  type="button"
                  className={`cadu-clip-tester__btn${playingClip === clipName && playingMode === 'canonical' ? ' is-active' : ''}`}
                  disabled={!actionsReady}
                  onClick={() => playClip(clipName)}
                >
                  {clipName}
                </button>
              </li>
            ))}
          </ul>
        )}

        {playingClip && (
          <p className="cadu-clip-tester__status">
            playing ({playingMode}): <code>{playingClip}</code>
          </p>
        )}
      </aside>
      <div className="cadu-clip-tester__viewport">
        <Canvas
          shadows
          camera={{ position: [0, 1.2, 2.8], fov: 42, near: 0.1, far: 100 }}
          gl={{ antialias: true }}
        >
          <ClipTesterViewport
            rigRef={rigRef}
            onCatalogReady={handleCatalogReady}
            onActionsReady={handleActionsReady}
            fileToCanonicalRef={fileToCanonicalRef}
          />
        </Canvas>
      </div>
    </div>
  )
}

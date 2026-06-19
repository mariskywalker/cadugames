import { SCENE_FLOOR_Y } from './sceneLayout'
import { CADU_CHARACTER_SCALE } from './sceneComposition'

/** `background.height` = 20 cobre a tela inteira (modo cover). */
export const OPENING_BACKDROP_COVER_BASE = 20

/** Limites do FOV no editor (maior = mais aberto / menos zoom). */
export const OPENING_CAMERA_FOV_MIN = 20
export const OPENING_CAMERA_FOV_MAX = 65

export function clampOpeningCameraFov(fov: number) {
  return Math.min(OPENING_CAMERA_FOV_MAX, Math.max(OPENING_CAMERA_FOV_MIN, fov))
}

export const OPENING_SCENE_OBJECT_IDS = [
  'podium',
  'bubbleColumn',
  'ballPit',
  'sensoryCocoon',
  'activityBars',
  'cadu',
] as const

export type OpeningSceneObjectId = (typeof OPENING_SCENE_OBJECT_IDS)[number]

/** Objetos interativos — renderizados acima da camada de fundo (background + palco). */
export const OPENING_INTERACTIVE_OBJECT_IDS: OpeningSceneObjectId[] = [
  'bubbleColumn',
  'ballPit',
  'sensoryCocoon',
  'activityBars',
  'cadu',
]

export interface OpeningObjectLayout {
  x: number
  y: number
  z: number
  rotX: number
  rotY: number
  rotZ: number
  scaleX: number
  scaleY: number
  scaleZ: number
}

export interface OpeningBackgroundLayout {
  imageUrl: string
  distance: number
  height: number
  opacity: number
  offsetY: number
  showProceduralSky: boolean
  proceduralSkyOpacity: number
}

export interface OpeningCameraLayout {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
}

export interface OpeningSceneLayout {
  background: OpeningBackgroundLayout
  camera: OpeningCameraLayout
  objects: Record<OpeningSceneObjectId, OpeningObjectLayout>
}

export type OpeningSceneLayoutOverride = {
  background?: Partial<OpeningBackgroundLayout>
  camera?: Partial<OpeningCameraLayout>
  objects?: Partial<Record<OpeningSceneObjectId, Partial<OpeningObjectLayout>>>
}

export const DEFAULT_OPENING_SCENE_LAYOUT: OpeningSceneLayout = {
  background: {
    imageUrl: '/opening/scene-frame.png',
    distance: 2,
    height: 20.5,
    opacity: 1,
    offsetY: 0.7,
    showProceduralSky: true,
    proceduralSkyOpacity: 0.26,
  },
  camera: {
    position: [0.5, 3.05, 10.65],
    target: [0, 1.7, 0],
    fov: 24.55,
  },
  objects: {
    podium: {
      x: -0.32,
      y: -3.34,
      z: -4.05,
      rotX: 0,
      rotY: 0.04,
      rotZ: 0,
      scaleX: 1.28,
      scaleY: 1.08,
      scaleZ: 0.2,
    },
    bubbleColumn: {
      x: -0.25,
      y: 0.78,
      z: -6,
      rotX: 0,
      rotY: -2.52,
      rotZ: 0,
      scaleX: 0.78,
      scaleY: 0.76,
      scaleZ: 0.75,
    },
    ballPit: {
      x: -2.85,
      y: 0,
      z: -7,
      rotX: 0,
      rotY: 1.2,
      rotZ: 0,
      scaleX: 1.32,
      scaleY: 1.28,
      scaleZ: 1.38,
    },
    sensoryCocoon: {
      x: 1.1,
      y: 0.73,
      z: -8.15,
      rotX: 0,
      rotY: -0.1,
      rotZ: 0,
      scaleX: 1.02,
      scaleY: 1.02,
      scaleZ: 1.03,
    },
    activityBars: {
      x: 3.01,
      y: 0.79,
      z: -6,
      rotX: 0,
      rotY: -1,
      rotZ: 0,
      scaleX: 0.96,
      scaleY: 0.89,
      scaleZ: 0.71,
    },
    cadu: {
      x: 0.8,
      y: 1.17,
      z: 1.95,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      scaleX: CADU_CHARACTER_SCALE,
      scaleY: CADU_CHARACTER_SCALE,
      scaleZ: CADU_CHARACTER_SCALE,
    },
  },
}

export const OPENING_OBJECT_LABELS: Record<OpeningSceneObjectId, string> = {
  podium: 'Palco',
  bubbleColumn: 'Tubo de bolhas',
  ballPit: 'Piscina de bolinhas',
  sensoryCocoon: 'Balanço',
  activityBars: 'Barras',
  cadu: 'CADU',
}

export function mergeOpeningSceneLayout(
  override: OpeningSceneLayoutOverride = {},
): OpeningSceneLayout {
  const base = DEFAULT_OPENING_SCENE_LAYOUT
  const objects = { ...base.objects }
  if (override.objects) {
    for (const id of OPENING_SCENE_OBJECT_IDS) {
      const patch = override.objects[id]
      if (patch) {
        objects[id] = { ...objects[id], ...sanitizeObject(patch, objects[id]) }
      }
    }
  }
  return {
    background: { ...base.background, ...sanitizeBackground(override.background) },
    camera: { ...base.camera, ...sanitizeCamera(override.camera, base.camera) },
    objects,
  }
}

function finite(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function clampFov(value: unknown, fallback: number) {
  return clampOpeningCameraFov(finite(value, fallback))
}

function sanitizeObject(
  patch: Partial<OpeningObjectLayout>,
  fallback: OpeningObjectLayout,
): Partial<OpeningObjectLayout> {
  return {
    x: finite(patch.x, fallback.x),
    y: finite(patch.y, fallback.y),
    z: finite(patch.z, fallback.z),
    rotX: finite(patch.rotX, fallback.rotX),
    rotY: finite(patch.rotY, fallback.rotY),
    rotZ: finite(patch.rotZ, fallback.rotZ),
    scaleX: finite(patch.scaleX, fallback.scaleX),
    scaleY: finite(patch.scaleY, fallback.scaleY),
    scaleZ: finite(patch.scaleZ, fallback.scaleZ),
  }
}

function sanitizeBackground(patch?: Partial<OpeningBackgroundLayout>) {
  if (!patch) return {}
  const base = DEFAULT_OPENING_SCENE_LAYOUT.background
  return {
    imageUrl: typeof patch.imageUrl === 'string' ? patch.imageUrl : base.imageUrl,
    distance: finite(patch.distance, base.distance),
    height: finite(patch.height, base.height),
    opacity: finite(patch.opacity, base.opacity),
    offsetY: finite(patch.offsetY, base.offsetY),
    showProceduralSky:
      typeof patch.showProceduralSky === 'boolean' ? patch.showProceduralSky : base.showProceduralSky,
    proceduralSkyOpacity: finite(patch.proceduralSkyOpacity, base.proceduralSkyOpacity),
  }
}

function sanitizeCamera(
  patch?: Partial<OpeningCameraLayout>,
  base = DEFAULT_OPENING_SCENE_LAYOUT.camera,
) {
  if (!patch) return {}
  const position = Array.isArray(patch.position)
    ? ([
        finite(patch.position[0], base.position[0]),
        finite(patch.position[1], base.position[1]),
        finite(patch.position[2], base.position[2]),
      ] as [number, number, number])
    : base.position
  const target = Array.isArray(patch.target)
    ? ([
        finite(patch.target[0], base.target[0]),
        finite(patch.target[1], base.target[1]),
        finite(patch.target[2], base.target[2]),
      ] as [number, number, number])
    : base.target
  return {
    position,
    target,
    fov: clampFov(patch.fov, base.fov),
  }
}

export function resolvePodiumWorldZ(layout: OpeningSceneLayout): number {
  const zs = OPENING_INTERACTIVE_OBJECT_IDS.map((id) => layout.objects[id]?.z).filter(
    (z): z is number => typeof z === 'number' && Number.isFinite(z),
  )
  const deepest = zs.length ? Math.min(...zs) : -5
  const behindObjects = deepest - 1.2
  const inFrontOfBackdrop = resolveBackdropWorldZ(layout) + OPENING_PODIUM_BACKDROP_GAP
  return Math.max(inFrontOfBackdrop, behindObjects)
}

/** Z base do background — sempre o mais distante da câmera. */
export const OPENING_BACKDROP_BASE_Z = -16

/** Distância mínima entre background e palco no eixo Z. */
export const OPENING_PODIUM_BACKDROP_GAP = 7

/** Background sempre atrás do palco (Z mais negativo). */
export function resolveBackdropWorldZ(layout: OpeningSceneLayout): number {
  return OPENING_BACKDROP_BASE_Z - Math.max(layout.background.distance - 5, 0)
}

export function openingObjectToWorld(
  obj: OpeningObjectLayout,
  id?: OpeningSceneObjectId,
  sceneLayout?: OpeningSceneLayout,
) {
  const z = id === 'podium' && sceneLayout ? resolvePodiumWorldZ(sceneLayout) : obj.z
  return {
    position: [obj.x, SCENE_FLOOR_Y + obj.y, z] as [number, number, number],
    rotation: [obj.rotX, obj.rotY, obj.rotZ] as [number, number, number],
    scale: [obj.scaleX, obj.scaleY, obj.scaleZ] as [number, number, number],
  }
}

/** Ordem de pintura no canvas — palco atrás dos objetos interativos. */
export const OPENING_PODIUM_RENDER_ORDER = -1

export const OPENING_INTERACTIVE_RENDER_ORDER = 10

export function formatOpeningSceneExport(layout: OpeningSceneLayout): string {
  const lines = OPENING_SCENE_OBJECT_IDS.map((id) => {
    const o = layout.objects[id]
    return `  ${id}: { x: ${o.x}, y: ${o.y}, z: ${o.z}, rotY: ${o.rotY}, scale: [${o.scaleX}, ${o.scaleY}, ${o.scaleZ}] },`
  })
  return `// Cole em lib/opening/openingSceneEditorLayout.ts (DEFAULT_OPENING_SCENE_LAYOUT.objects)
objects: {
${lines.join('\n')}
},
background: ${JSON.stringify(layout.background, null, 2)},
camera: ${JSON.stringify(layout.camera, null, 2)},`
}

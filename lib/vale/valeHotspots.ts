import { VALE_BEAR_HERO, VALE_HOUSE_ENTRY, VALE_LANDMARKS } from './valeWorld'
import { VALE_HOTSPOT_ARRIVE_THRESHOLD } from './valeGameplay'

/** Marcadores de destino — desligados em produção */
export const VALE_BEAR_TARGET_DEBUG = false

/** Waypoint 3D fixo — urso no canvas principal (ValeCharacter) */
export interface ValeWorldWaypoint {
  x: number
  z: number
  /** Radianos — só eixo Y */
  rotationY: number
}

export type ValeBearTarget = ValeWorldWaypoint
export type ValeHotspotWaypoint = ValeWorldWaypoint

/** Onde a criança clica — só UI 2D */
export interface ValeHotspotHitArea {
  screenX: number
  screenY: number
  radius: number
}

export type ValeHotspotArriveAction = 'open-card' | 'open-hub' | 'open-sheet'

export interface ValeHotspot {
  id: string
  label: string
  emoji: string
  interactionTitle: string
  interactionDescription: string
  /** Rótulo do botão principal do card */
  actionLabel: string
  /** ID da atividade enviada ao Cadu Life */
  activityId: string
  hitArea: ValeHotspotHitArea
  /** Índice no VALE_MAIN_PATH onde a ramificação começa */
  mainJoinIndex: number
  /** Ponto 3D onde a ramificação sai do caminho principal */
  pathStart: ValeBearTarget
  /** Ramificação 3D após pathStart — último ponto = arriveTarget */
  path: ValeHotspotWaypoint[]
  /** Onde o urso para — frente ao objeto, nunca em cima */
  arriveTarget: ValeBearTarget
  /** @deprecated alias — use arriveTarget (mantido para store legado) */
  bearTarget: ValeBearTarget
  onArrive: ValeHotspotArriveAction
  sheetId?: string
}

function wp(x: number, z: number, rotationY: number): ValeHotspotWaypoint {
  return { x, z, rotationY }
}

function hit(screenX: number, screenY: number, radius: number): ValeHotspotHitArea {
  return { screenX, screenY, radius }
}

function rotToward(ax: number, az: number, bx: number, bz: number) {
  return Math.atan2(bx - ax, bz - az)
}

/** Para em frente a um ponto (objeto), recuando stopBefore unidades na direção de chegada */
function stopBefore(
  objectX: number,
  objectZ: number,
  approachX: number,
  approachZ: number,
  stopBeforeDist = 0.55,
): ValeBearTarget {
  const dx = objectX - approachX
  const dz = objectZ - approachZ
  const len = Math.hypot(dx, dz) || 1
  const x = objectX - (dx / len) * stopBeforeDist
  const z = objectZ - (dz / len) * stopBeforeDist
  return wp(x, z, rotToward(x, z, objectX, objectZ))
}

function branch(points: Array<[number, number]>, fromX: number, fromZ: number): ValeHotspotWaypoint[] {
  const route: ValeHotspotWaypoint[] = []
  let px = fromX
  let pz = fromZ
  for (const [x, z] of points) {
    route.push(wp(x, z, rotToward(px, pz, x, z)))
    px = x
    pz = z
  }
  return route
}

/** Garante arriveTarget e sincroniza último waypoint da ramificação */
export function applyArriveTargetToHotspot(
  hotspot: ValeHotspot,
  arriveTarget: ValeBearTarget,
): ValeHotspot {
  const target = { ...arriveTarget }
  const path = hotspot.path.map((p) => ({ ...p }))
  if (path.length > 0) {
    path[path.length - 1] = { ...target }
  }
  return {
    ...hotspot,
    arriveTarget: target,
    bearTarget: target,
    path,
  }
}

export function finalizeHotspotPath(hotspot: ValeHotspot): ValeHotspot {
  return applyArriveTargetToHotspot(hotspot, { ...hotspot.arriveTarget })
}

export function patchHotspotPathWaypoint(
  hotspot: ValeHotspot,
  index: number,
  patch: Partial<ValeBearTarget>,
): ValeHotspot {
  const path = hotspot.path.map((p) => ({ ...p }))
  if (index < 0 || index >= path.length) return hotspot
  path[index] = { ...path[index]!, ...patch }
  const next = { ...hotspot, path }
  if (index === path.length - 1) {
    return applyArriveTargetToHotspot(next, path[index]!)
  }
  return finalizeHotspotPath(next)
}

export function addHotspotPathWaypoint(hotspot: ValeHotspot): ValeHotspot {
  const path = hotspot.path.map((p) => ({ ...p }))
  const target = { ...hotspot.arriveTarget }
  if (path.length === 0) {
    return finalizeHotspotPath({ ...hotspot, path: [target] })
  }
  const last = path[path.length - 1]!
  const prev = path.length >= 2 ? path[path.length - 2]! : { ...target }
  const mid: ValeBearTarget = {
    x: (prev.x + last.x) / 2,
    z: (prev.z + last.z) / 2,
    rotationY: last.rotationY,
  }
  path.splice(path.length - 1, 0, mid)
  return finalizeHotspotPath({ ...hotspot, path })
}

export function removeHotspotPathWaypoint(hotspot: ValeHotspot, index: number): ValeHotspot {
  if (hotspot.path.length <= 1) return hotspot
  if (index < 0 || index >= hotspot.path.length) return hotspot
  const path = hotspot.path.filter((_, i) => i !== index).map((p) => ({ ...p }))
  return finalizeHotspotPath({ ...hotspot, path })
}

export function patchHotspotMainJoinIndex(
  hotspot: ValeHotspot,
  mainJoinIndex: number,
  mainPath: Array<{ x: number; z: number }> = VALE_MAIN_PATH,
): ValeHotspot {
  const max = mainPath.length - 1
  const idx = Math.min(max, Math.max(0, mainJoinIndex))
  const join = mainPath[idx]!
  const toward = hotspot.path[0] ?? hotspot.pathStart
  return {
    ...hotspot,
    mainJoinIndex: idx,
    pathStart: wp(join.x, join.z, rotToward(join.x, join.z, toward.x, toward.z)),
  }
}

export function patchHotspotPathStart(
  hotspot: ValeHotspot,
  patch: Partial<ValeBearTarget>,
): ValeHotspot {
  return { ...hotspot, pathStart: { ...hotspot.pathStart, ...patch } }
}

export function pathStartFromJoin(
  joinIndex: number,
  towardX: number,
  towardZ: number,
  mainPath: Array<{ x: number; z: number }> = VALE_MAIN_PATH,
): ValeBearTarget {
  const join = mainPath[Math.min(Math.max(0, joinIndex), mainPath.length - 1)]!
  return wp(join.x, join.z, rotToward(join.x, join.z, towardX, towardZ))
}

export function buildMainPathWaypoints(
  mainPath: Array<{ x: number; z: number }> = VALE_MAIN_PATH,
): ValeHotspotWaypoint[] {
  return mainPath.map((p, i) => {
    const prev = mainPath[Math.max(0, i - 1)]!
    return wp(p.x, p.z, rotToward(prev.x, prev.z, p.x, p.z))
  })
}

function defineHotspot(
  base: Omit<ValeHotspot, 'bearTarget' | 'pathStart'> & {
    arriveTarget: ValeBearTarget
    pathStart?: ValeBearTarget
  },
): ValeHotspot {
  const toward = base.path[0] ?? base.arriveTarget
  const pathStart =
    base.pathStart ??
    pathStartFromJoin(base.mainJoinIndex, toward.x, toward.z)
  return finalizeHotspotPath({ ...base, pathStart, bearTarget: base.arriveTarget })
}

/** Caminho principal compartilhado — caminho de pedras até a casa */
export const VALE_MAIN_PATH: Array<{ x: number; z: number }> = [
  { x: -3.15, z: 0.52 },
  { x: -3.15, z: 0.16 },
  { x: -3.15, z: -0.38 },
  { x: -3.15, z: -1.08 },
  { x: -3.15, z: -2.08 },
  { x: -3.15, z: -3.18 },
  { x: -3.15, z: -4.28 },
  { x: -3.15, z: -5.28 },
  { x: -3.15, z: -6.02 },
  { x: -5.39, z: -21.88 },
]

const MAIN_PATH_WPS: ValeHotspotWaypoint[] = buildMainPathWaypoints(VALE_MAIN_PATH)

const DOOR_X = VALE_HOUSE_ENTRY[0]
const DOOR_Z = VALE_HOUSE_ENTRY[1]
const MAIN_LAST = VALE_MAIN_PATH[VALE_MAIN_PATH.length - 1]!

// ─── 1. Casa do Urso — ramificação final até frente da porta ───
const CASA_ARRIVE = stopBefore(DOOR_X, DOOR_Z, MAIN_LAST.x, MAIN_LAST.z, 0.58)
const CASA_BRANCH = branch(
  [
    [-4.62, -14.2],
    [CASA_ARRIVE.x, CASA_ARRIVE.z],
  ],
  MAIN_LAST.x,
  MAIN_LAST.z,
)

// ─── 2. Diário/mochila — área à esquerda do caminho (hit 2D no cenário) ───
const DIARIO_OBJECT = { x: -2.05, z: 0.28 }
const DIARIO_BRANCH = branch(
  [
    [0.12, 0.34],
    [-0.55, 0.3],
    [-1.35, 0.28],
  ],
  VALE_MAIN_PATH[1]!.x,
  VALE_MAIN_PATH[1]!.z,
)
const DIARIO_ARRIVE = stopBefore(
  DIARIO_OBJECT.x,
  DIARIO_OBJECT.z,
  DIARIO_OBJECT.x + 0.55,
  DIARIO_OBJECT.z,
  0.62,
)

// ─── 3. Árvore das Palavras — ramificação a partir do ponto 3 ───
const ARVORE_OBJECT = VALE_LANDMARKS.find((l) => l.id === 'arvore-palavras')!.position
const ARVORE_BRANCH = branch(
  [
    [0.38, -0.72],
    [-0.42, -0.58],
  ],
  VALE_MAIN_PATH[3]!.x,
  VALE_MAIN_PATH[3]!.z,
)
const ARVORE_ARRIVE = stopBefore(
  ARVORE_OBJECT[0],
  ARVORE_OBJECT[1],
  ARVORE_OBJECT[0] + 0.48,
  ARVORE_OBJECT[1] + 0.35,
  0.55,
)

// ─── 4. Jardim — ramificação inferior a partir do ponto 1 ───
const JARDIM_OBJECT = { x: -0.62, z: 0.78 }
const JARDIM_BRANCH = branch(
  [
    [0.22, 0.62],
    [-0.08, 0.74],
  ],
  VALE_MAIN_PATH[1]!.x,
  VALE_MAIN_PATH[1]!.z,
)
const JARDIM_ARRIVE = stopBefore(
  JARDIM_OBJECT.x,
  JARDIM_OBJECT.z,
  JARDIM_OBJECT.x + 0.5,
  JARDIM_OBJECT.z,
  0.52,
)

// ─── 5. Portal da Comunicação — ramificação a partir do ponto 3 ───
const PORTAL_OBJECT = VALE_LANDMARKS.find((l) => l.id === 'portal-comunicacao')!.position
const PORTAL_BRANCH = branch(
  [
    [0.78, -1.35],
    [0.92, -1.85],
  ],
  VALE_MAIN_PATH[3]!.x,
  VALE_MAIN_PATH[3]!.z,
)
const PORTAL_ARRIVE = stopBefore(
  PORTAL_OBJECT[0],
  PORTAL_OBJECT[1],
  PORTAL_OBJECT[0] - 0.45,
  PORTAL_OBJECT[1] + 0.35,
  0.58,
)

const SPAWN = VALE_MAIN_PATH[0]!
const CAMINHO_ARRIVE = wp(
  SPAWN.x,
  SPAWN.z,
  rotToward(SPAWN.x, SPAWN.z, VALE_MAIN_PATH[1]!.x, VALE_MAIN_PATH[1]!.z),
)

export const VALE_HOTSPOTS: ValeHotspot[] = [
  defineHotspot({
    id: 'caminho-pedras',
    label: 'Caminho de pedras',
    emoji: '🪨',
    interactionTitle: 'Caminho de pedras',
    interactionDescription: 'Por aqui começa a jornada do Cadu pelo Vale.',
    actionLabel: 'Explorar',
    activityId: 'caminho-pedras',
    hitArea: hit(0.44, 0.72, 72),
    mainJoinIndex: 0,
    path: [],
    arriveTarget: CAMINHO_ARRIVE,
    onArrive: 'open-card',
  }),
  defineHotspot({
    id: 'casa-do-urso',
    label: 'Casa do Urso',
    emoji: '🏡',
    interactionTitle: 'Começar brincadeira',
    interactionDescription: 'Cadu vai te acompanhar em uma atividade de comunicação.',
    actionLabel: 'Começar',
    activityId: 'comunicacao-inicial',
    hitArea: hit(0.58, 0.38, 80),
    mainJoinIndex: 9,
    path: CASA_BRANCH,
    arriveTarget: CASA_ARRIVE,
    onArrive: 'open-card',
  }),
  defineHotspot({
    id: 'diario-mochila',
    label: 'Diário/mochila',
    emoji: '🎒',
    interactionTitle: 'Diário e mochila',
    interactionDescription: 'O Cadu deixou uma cartinha com a missão de hoje.',
    actionLabel: 'Abrir',
    activityId: 'diario-mochila',
    hitArea: hit(0.14, 0.58, 64),
    mainJoinIndex: 1,
    path: DIARIO_BRANCH,
    arriveTarget: DIARIO_ARRIVE,
    onArrive: 'open-card',
  }),
  defineHotspot({
    id: 'arvore-palavras',
    label: 'Árvore rosa',
    emoji: '🌳',
    interactionTitle: 'Árvore rosa',
    interactionDescription: 'Palavras e descobertas ficam guardadas nos galhos.',
    actionLabel: 'Olhar',
    activityId: 'arvore-rosa',
    hitArea: hit(0.34, 0.48, 68),
    mainJoinIndex: 3,
    path: ARVORE_BRANCH,
    arriveTarget: ARVORE_ARRIVE,
    onArrive: 'open-card',
  }),
  defineHotspot({
    id: 'jardim-flores',
    label: 'Flor/plantinha',
    emoji: '🌸',
    interactionTitle: 'Flor/plantinha',
    interactionDescription: 'Cada flor guarda uma habilidade que você vem cultivando.',
    actionLabel: 'Cuidar',
    activityId: 'jardim-flores',
    hitArea: hit(0.22, 0.62, 64),
    mainJoinIndex: 1,
    path: JARDIM_BRANCH,
    arriveTarget: JARDIM_ARRIVE,
    onArrive: 'open-card',
  }),
  defineHotspot({
    id: 'portal-comunicacao',
    label: 'Portal mágico',
    emoji: '✨',
    interactionTitle: 'Portal mágico',
    interactionDescription: 'Um lugar especial para praticar palavras e gestos.',
    actionLabel: 'Entrar',
    activityId: 'portal-comunicacao',
    hitArea: hit(0.52, 0.52, 64),
    mainJoinIndex: 3,
    path: PORTAL_BRANCH,
    arriveTarget: PORTAL_ARRIVE,
    onArrive: 'open-card',
  }),
]

export const VALE_DEFAULT_HOTSPOT_ID = 'caminho-pedras'

export function getHotspotById(id: string): ValeHotspot | undefined {
  return VALE_HOTSPOTS.find((h) => h.id === id)
}

function distXZ(ax: number, az: number, bx: number, bz: number) {
  return Math.hypot(ax - bx, az - bz)
}

function isSameXZ(a: ValeHotspotWaypoint, b: ValeHotspotWaypoint, eps = 0.06) {
  return distXZ(a.x, a.z, b.x, b.z) < eps
}

function appendUnique(route: ValeHotspotWaypoint[], points: ValeHotspotWaypoint[]) {
  for (const point of points) {
    const last = route[route.length - 1]
    if (last && isSameXZ(last, point)) {
      route[route.length - 1] = { ...point }
    } else {
      route.push({ ...point })
    }
  }
}

export type BuildHotspotPathContext = {
  mainPath?: Array<{ x: number; z: number }>
}

function resolveMainPathWaypoints(context?: BuildHotspotPathContext) {
  const mainPath = context?.mainPath ?? VALE_MAIN_PATH
  return buildMainPathWaypoints(mainPath)
}

export function getNearestMainPathIndex(
  x: number,
  z: number,
  mainPathWps: ValeHotspotWaypoint[] = MAIN_PATH_WPS,
): number {
  let nearestIdx = 0
  let nearestDist = Infinity
  for (let i = 0; i < mainPathWps.length; i++) {
    const p = mainPathWps[i]!
    const d = distXZ(x, z, p.x, p.z)
    if (d < nearestDist) {
      nearestDist = d
      nearestIdx = i
    }
  }
  return nearestIdx
}

/** Trecho do caminho principal entre dois índices (suporta retrocesso) */
export function getMainPathSegment(
  fromIdx: number,
  toIdx: number,
  mainPathWps: ValeHotspotWaypoint[] = MAIN_PATH_WPS,
): ValeHotspotWaypoint[] {
  if (fromIdx === toIdx) return [{ ...mainPathWps[fromIdx]! }]
  if (fromIdx < toIdx) {
    return mainPathWps.slice(fromIdx, toIdx + 1).map((p) => ({ ...p }))
  }
  return mainPathWps.slice(toIdx, fromIdx + 1)
    .reverse()
    .map((p, i, arr) => {
      const prev = arr[i - 1] ?? mainPathWps[fromIdx]!
      return wp(p.x, p.z, rotToward(prev.x, prev.z, p.x, p.z))
    })
}

export function getBestConnectionToMainPath(
  x: number,
  z: number,
  joinIndex: number,
  context?: BuildHotspotPathContext,
): ValeHotspotWaypoint[] {
  const mainPathWps = resolveMainPathWaypoints(context)
  const nearest = getNearestMainPathIndex(x, z, mainPathWps)
  return getMainPathSegment(nearest, joinIndex, mainPathWps)
}

/**
 * Monta rota completa: posição atual → caminho principal → pathStart → ramificação → arriveTarget.
 * Não altera rig/GLB — só waypoints de gameplay.
 */
export function buildHotspotPath(
  fromX: number,
  fromZ: number,
  hotspot: ValeHotspot,
  context?: BuildHotspotPathContext,
): ValeHotspotWaypoint[] {
  const target = hotspot.arriveTarget
  const mainPathWps = resolveMainPathWaypoints(context)

  if (isBearAtTarget(target, fromX, fromZ)) {
    return [{ ...target }]
  }

  const joinIdx = Math.min(Math.max(0, hotspot.mainJoinIndex), mainPathWps.length - 1)
  const route: ValeHotspotWaypoint[] = []

  const nearest = getNearestMainPathIndex(fromX, fromZ, mainPathWps)
  const nearestWp = mainPathWps[nearest]!

  if (distXZ(fromX, fromZ, nearestWp.x, nearestWp.z) > 0.22) {
    route.push(wp(fromX, fromZ, rotToward(fromX, fromZ, nearestWp.x, nearestWp.z)))
  }

  appendUnique(route, getMainPathSegment(nearest, joinIdx, mainPathWps))
  appendUnique(route, [{ ...hotspot.pathStart }])

  if (hotspot.path.length > 0) {
    appendUnique(route, hotspot.path.map((p) => ({ ...p })))
  }

  const last = route[route.length - 1]
  if (!last || distXZ(last.x, last.z, target.x, target.z) > 0.08) {
    route.push({ ...target })
  } else {
    route[route.length - 1] = { ...target }
  }

  return route
}

export function applyBearTargetToHotspot(hotspot: ValeHotspot, bearTarget: ValeBearTarget): ValeHotspot {
  return applyArriveTargetToHotspot(hotspot, bearTarget)
}

export function cloneHotspotPath(hotspot: ValeHotspot): ValeHotspotWaypoint[] {
  return buildHotspotPath(hotspot.arriveTarget.x, hotspot.arriveTarget.z, hotspot)
}

/** @deprecated use buildHotspotPath */
export function prepareHotspotPath(
  hotspot: ValeHotspot,
  fromX: number,
  fromZ: number,
  context?: BuildHotspotPathContext,
): ValeHotspotWaypoint[] {
  return buildHotspotPath(fromX, fromZ, hotspot, context)
}

export function isBearAtTarget(
  bearTarget: ValeBearTarget,
  x: number,
  z: number,
  threshold = VALE_HOTSPOT_ARRIVE_THRESHOLD,
): boolean {
  return Math.hypot(bearTarget.x - x, bearTarget.z - z) < threshold
}

export function applyHitAreaToHotspot(
  hotspot: ValeHotspot,
  hitArea: ValeHotspotHitArea,
): ValeHotspot {
  return {
    ...hotspot,
    hitArea: { ...hitArea },
  }
}

/** Trecho pronto para colar em valeHotspots.ts — só hitArea 2D */
export function formatHotspotHitAreaExport(hotspot: Pick<ValeHotspot, 'id' | 'label' | 'emoji' | 'hitArea'>) {
  const { id, label, emoji, hitArea } = hotspot
  return [
    '{',
    `  id: "${id}",`,
    `  label: "${label}",`,
    `  icon: "${emoji}",`,
    '  hitArea: {',
    `    screenX: ${hitArea.screenX.toFixed(3)},`,
    `    screenY: ${hitArea.screenY.toFixed(3)},`,
    `    radius: ${Math.round(hitArea.radius)},`,
    '  }',
    '}',
  ].join('\n')
}

export function formatHotspotHitAreaInline(hotspot: Pick<ValeHotspot, 'id' | 'label' | 'emoji' | 'hitArea'>) {
  const { hitArea } = hotspot
  return `hit(${hitArea.screenX.toFixed(3)}, ${hitArea.screenY.toFixed(3)}, ${Math.round(hitArea.radius)})`
}

export function formatHotspotPathExport(hotspot: ValeHotspot) {
  const finalized = finalizeHotspotPath(hotspot)
  const pathLines = finalized.path
    .map(
      (p) =>
        `    { x: ${p.x.toFixed(3)}, z: ${p.z.toFixed(3)}, rotationY: ${p.rotationY.toFixed(3)} },`,
    )
    .join('\n')
  const t = finalized.arriveTarget
  const s = finalized.pathStart
  return [
    `{`,
    `  id: "${hotspot.id}",`,
    `  mainJoinIndex: ${hotspot.mainJoinIndex},`,
    `  pathStart: { x: ${s.x.toFixed(3)}, z: ${s.z.toFixed(3)}, rotationY: ${s.rotationY.toFixed(3)} },`,
    `  path: [`,
    pathLines || '    // ramificação vazia — só caminho principal',
    `  ],`,
    `  arriveTarget: { x: ${t.x.toFixed(3)}, z: ${t.z.toFixed(3)}, rotationY: ${t.rotationY.toFixed(3)} },`,
    `}`,
  ].join('\n')
}

/** Export do caminho principal compartilhado */
export function formatMainPathExport(mainPath: Array<{ x: number; z: number }>) {
  const lines = mainPath
    .map((p) => `  { x: ${p.x.toFixed(3)}, z: ${p.z.toFixed(3)} },`)
    .join('\n')
  return `export const VALE_MAIN_PATH = [\n${lines}\n]`
}

/** Export completo — hitArea 2D + path 3D + arriveTarget */
export function formatHotspotFullExport(hotspot: ValeHotspot) {
  return `${formatHotspotHitAreaExport(hotspot)}\n\n${formatHotspotPathExport(hotspot)}`
}

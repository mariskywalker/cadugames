import * as THREE from 'three'
import {
  VALE_BEAR_HERO,
  VALE_CHARACTER_SCALE,
  VALE_HOUSE_ENTRY,
  VALE_PATH_GROUND_Y,
  getValeHeroGroundY,
} from './valeWorld'

/** Layer reservada para superfícies caminháveis (raycast) */
export const WALKABLE_LAYER = 1

export interface ValeWalkPathPoint {
  id: string
  x: number
  z: number
  halfWidth?: number
}

/** Curva principal: centro da cena → caminho de pedras do GLB → porta da casa */
export const DEFAULT_VALE_WALK_PATH_POINTS: ValeWalkPathPoint[] = [
  { id: 'walk-spawn', x: -3.15, z: 0.52 },
  { id: 'walk-1', x: -3.15, z: 0.16 },
  { id: 'walk-2', x: -3.15, z: -0.38 },
  { id: 'walk-3', x: -3.15, z: -1.08 },
  { id: 'walk-4', x: -3.15, z: -2.08 },
  { id: 'walk-5', x: -3.15, z: -3.18 },
  { id: 'walk-6', x: -3.15, z: -4.28 },
  { id: 'walk-7', x: -3.15, z: -5.28 },
  { id: 'walk-8', x: -3.15, z: -6.02 },
  { id: 'walk-9', x: -5.39, z: -21.88, halfWidth: 0.35 },
]

/** @deprecated Use getValeWalkPathPoints() em runtime */
export const VALE_WALK_PATH_POINTS = DEFAULT_VALE_WALK_PATH_POINTS

let activeWalkPathPoints: ValeWalkPathPoint[] = DEFAULT_VALE_WALK_PATH_POINTS.map((p) => ({ ...p }))

export function getValeWalkPathPoints(): ReadonlyArray<ValeWalkPathPoint> {
  return activeWalkPathPoints
}

export function setValeWalkPathPoints(points: ValeWalkPathPoint[]) {
  activeWalkPathPoints = points.map((p) => ({ ...p }))
  rebuildPathMetrics()
}

function halfWidthAtSegment(segIndex: number, u: number, t: number): number {
  const points = activeWalkPathPoints
  const a = points[segIndex]
  const b = points[segIndex + 1]
  if (!a || !b) return getValePathHalfWidth(t)
  const wa = a.halfWidth ?? getValePathHalfWidth(t)
  const wb = b.halfWidth ?? getValePathHalfWidth(Math.min(1, t + 1 / Math.max(points.length, 2)))
  return THREE.MathUtils.lerp(wa, wb, u)
}

/** Progresso máximo no path — impede entrar na casa */
export const VALE_MAX_PATH_T = 0.995

/** Debug visual temporário — path verde, bloqueio vermelho, raycast amarelo */
export const VALE_WALK_DEBUG = false

export interface ValeGroundSample {
  y: number
  hitX: number
  hitY: number
  hitZ: number
  didHit: boolean
}

export const valeWalkDebug = {
  sample: null as ValeGroundSample | null,
}

/** Objetos com userData.walkable = true — única fonte de altura de chão */
export const valeWalkable: { objects: THREE.Object3D[] } = { objects: [] }

const groundRay = new THREE.Raycaster()
const rayOrigin = new THREE.Vector3()
const RAY_DOWN = new THREE.Vector3(0, -1, 0)

let lastValidGroundY = VALE_PATH_GROUND_Y

const pathSegLens: number[] = []
let pathTotalLen = 0

function rebuildPathMetrics() {
  pathSegLens.length = 0
  pathTotalLen = 0
  const points = activeWalkPathPoints
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const len = Math.hypot(b.x - a.x, b.z - a.z)
    pathSegLens.push(len)
    pathTotalLen += len
  }
}

rebuildPathMetrics()

function smoothstep(t: number) {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

/** Largura da faixa caminhável — mais larga na frente, estreita perto da casa */
export function getValePathHalfWidth(t: number): number {
  const near = 1.28
  const far = 0.52
  return THREE.MathUtils.lerp(near, far, smoothstep(t))
}

export function getBearSpawnFromWalkPath(): { x: number; z: number; rotationY: number } {
  const pts = getValeWalkPathPoints()
  const spawn = pts[0] ?? { x: -3.15, z: 0.52, id: 'walk-spawn' }
  const next = pts[1] ?? spawn
  return {
    x: spawn.x,
    z: spawn.z,
    rotationY: Math.atan2(next.x - spawn.x, next.z - spawn.z),
  }
}

/** Altura do chão no hero — rampa analítica na posição atual (sem lerp entre waypoints) */
export function getHeroBearGroundY(x: number, z: number): number {
  return getValeHeroGroundY(x, z)
}

export interface WalkPathProjection {
  x: number
  z: number
  t: number
  lateral: number
  halfWidth: number
  segIndex: number
}

export function getPathPointAtT(t: number): { x: number; z: number } {
  const points = activeWalkPathPoints
  const capped = Math.min(VALE_MAX_PATH_T, Math.max(0, t))
  if (pathTotalLen < 1e-5) return { x: points[0]?.x ?? 0, z: points[0]?.z ?? 0 }

  let target = capped * pathTotalLen
  for (let i = 0; i < points.length - 1; i++) {
    const segLen = pathSegLens[i] ?? 0
    if (target <= segLen || i === points.length - 2) {
      const a = points[i]
      const b = points[i + 1]
      const u = segLen > 1e-5 ? Math.min(1, target / segLen) : 0
      return { x: a.x + (b.x - a.x) * u, z: a.z + (b.z - a.z) * u }
    }
    target -= segLen
  }

  const end = points[points.length - 1]
  return { x: end.x, z: end.z }
}

export function projectOntoWalkPath(x: number, z: number): WalkPathProjection {
  const points = activeWalkPathPoints
  let bestDist = Infinity
  let best: WalkPathProjection = {
    x: points[0]?.x ?? 0,
    z: points[0]?.z ?? 0,
    t: 0,
    lateral: 0,
    halfWidth: getValePathHalfWidth(0),
    segIndex: 0,
  }

  let accumulated = 0
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const abx = b.x - a.x
    const abz = b.z - a.z
    const segLen = pathSegLens[i] ?? 1
    const segLenSq = segLen * segLen
    const u = segLenSq > 1e-6 ? Math.max(0, Math.min(1, ((x - a.x) * abx + (z - a.z) * abz) / segLenSq)) : 0
    const px = a.x + abx * u
    const pz = a.z + abz * u
    const offX = x - px
    const offZ = z - pz
    const lateralDist = Math.hypot(offX, offZ)
    const sign = Math.sign(abx * offZ - abz * offX) || 1

    if (lateralDist < bestDist) {
      bestDist = lateralDist
      const t = pathTotalLen > 0 ? (accumulated + segLen * u) / pathTotalLen : 0
      best = {
        x: px,
        z: pz,
        t,
        lateral: lateralDist * sign,
        halfWidth: halfWidthAtSegment(i, u, t),
        segIndex: i,
      }
    }
    accumulated += segLen
  }

  return best
}

function perpendicularAtProjection(proj: WalkPathProjection): [number, number] {
  const points = activeWalkPathPoints
  const i = proj.segIndex
  const a = points[i]
  const b = points[Math.min(i + 1, points.length - 1)]
  const abx = b.x - a.x
  const abz = b.z - a.z
  const segLen = Math.hypot(abx, abz) || 1
  const sign = proj.lateral >= 0 ? 1 : -1
  return [(-abz / segLen) * sign, (abx / segLen) * sign]
}

export function isInsideValeWalkCorridor(x: number, z: number): boolean {
  const proj = projectOntoWalkPath(x, z)
  if (proj.t > VALE_MAX_PATH_T + 0.01) return false
  return Math.abs(proj.lateral) <= proj.halfWidth * 1.02
}

export function clampToValeWalkPath(x: number, z: number): [number, number] {
  const proj = projectOntoWalkPath(x, z)

  if (proj.t > VALE_MAX_PATH_T) {
    const end = getPathPointAtT(VALE_MAX_PATH_T)
    return [end.x, end.z]
  }

  if (Math.abs(proj.lateral) <= proj.halfWidth) return [x, z]

  const [perpX, perpZ] = perpendicularAtProjection(proj)
  return [proj.x + perpX * proj.halfWidth, proj.z + perpZ * proj.halfWidth]
}

/** Bloqueia direção fora do corredor — velocidade constante, sem desacelerar */
export function tryValeWalkMove(
  x: number,
  z: number,
  dx: number,
  dz: number,
  step: number,
): [number, number] {
  const nx = x + dx * step
  const nz = z + dz * step
  if (isInsideValeWalkCorridor(nx, nz)) return [nx, nz]
  if (isInsideValeWalkCorridor(nx, z)) return [nx, z]
  if (isInsideValeWalkCorridor(x, nz)) return [x, nz]
  return [x, z]
}

/** Escala visual — maior na frente (câmera), menor perto da casa */
export function getValeHeroPerspectiveScale(z: number): number {
  const nearZ = VALE_BEAR_HERO.position[2]
  const farZ = VALE_HOUSE_ENTRY[1]
  const span = nearZ - farZ
  const t = span > 1e-5 ? (nearZ - z) / span : 0
  const scaleNear = VALE_CHARACTER_SCALE * 1.1
  const scaleFar = VALE_CHARACTER_SCALE * 0.82
  return THREE.MathUtils.lerp(scaleNear, scaleFar, smoothstep(t))
}

function isWalkableHit(obj: THREE.Object3D): boolean {
  let current: THREE.Object3D | null = obj
  while (current) {
    if (current.userData?.walkable === true) return true
    if (current.userData?.walkable === false) return false
    current = current.parent
  }
  return false
}

/** Altura do chão — só superfícies walkable; mantém última altura válida */
export function sampleValeGroundY(x: number, z: number): ValeGroundSample {
  const rampY = getValeHeroGroundY(x, z)
  const objects = valeWalkable.objects.filter((obj) => obj.userData?.walkable !== false)

  if (objects.length === 0) {
    lastValidGroundY = rampY
    const sample = { y: rampY, hitX: x, hitY: rampY, hitZ: z, didHit: false }
    if (VALE_WALK_DEBUG) valeWalkDebug.sample = sample
    return sample
  }

  groundRay.layers.set(WALKABLE_LAYER)
  groundRay.layers.enable(0)

  let best: number | null = null
  let hitX = x
  let hitZ = z

  for (const [dx, dz] of [
    [0, 0],
    [0.08, 0],
    [-0.08, 0],
    [0, 0.08],
    [0, -0.08],
  ] as [number, number][]) {
    rayOrigin.set(x + dx, 12, z + dz)
    groundRay.set(rayOrigin, RAY_DOWN)
    const hits = groundRay.intersectObjects(objects, true).filter((hit) => isWalkableHit(hit.object))
    if (hits.length > 0) {
      const y = hits[0].point.y
      if (best === null || y > best) {
        best = y
        hitX = hits[0].point.x
        hitZ = hits[0].point.z
      }
    }
  }

  if (best !== null) {
    lastValidGroundY = best
    const sample = { y: best, hitX, hitY: best, hitZ, didHit: true }
    if (VALE_WALK_DEBUG) valeWalkDebug.sample = sample
    return sample
  }

  const sample = { y: lastValidGroundY, hitX: x, hitY: lastValidGroundY, hitZ: z, didHit: false }
  if (VALE_WALK_DEBUG) valeWalkDebug.sample = sample
  return sample
}

export function getValeGroundY(x: number, z: number): number {
  return getHeroBearGroundY(x, z)
}

export function resetValeGroundY(y = VALE_PATH_GROUND_Y) {
  lastValidGroundY = y
}

export function markValeObjectNonWalkable(root: THREE.Object3D) {
  root.traverse((obj) => {
    obj.userData.walkable = false
    obj.layers.disable(WALKABLE_LAYER)
  })
}

export function registerValeWalkable(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (obj.userData?.walkable === true) {
      obj.layers.enable(WALKABLE_LAYER)
    }
  })
  if (!valeWalkable.objects.includes(root)) {
    valeWalkable.objects.push(root)
  }
}

export function unregisterValeWalkable(root: THREE.Object3D) {
  const idx = valeWalkable.objects.indexOf(root)
  if (idx >= 0) valeWalkable.objects.splice(idx, 1)
}

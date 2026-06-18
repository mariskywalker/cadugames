export type ValeScreenWaypoint = {
  screenX: number
  screenY: number
  scale: number
  rotationY: number
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

export const VALE_SCREEN_SPAWN: ValeScreenWaypoint = {
  screenX: 0.5,
  screenY: 0.72,
  scale: 1,
  rotationY: 0,
}

export function clampScreenWaypoint(pose: ValeScreenWaypoint): ValeScreenWaypoint {
  return {
    screenX: clamp01(pose.screenX),
    screenY: clamp01(pose.screenY),
    scale: Number.isFinite(pose.scale) ? Math.min(2, Math.max(0.4, pose.scale)) : 1,
    rotationY: Number.isFinite(pose.rotationY) ? pose.rotationY : 0,
  }
}

export type ValeScreenRoute = {
  id: string
  arrivePose: ValeScreenWaypoint
  mainJoinIndex: number
  path: ValeScreenWaypoint[]
}

// Observação: o modo 2.5D está desligado (VALE_STATIC_SCENE=false). Estas rotas
// existem só para manter o build/tsc consistente quando o modo é reativado.
const ROUTES: Record<string, ValeScreenRoute> = {
  'caminho-pedras': {
    id: 'caminho-pedras',
    mainJoinIndex: 0,
    path: [],
    arrivePose: { ...VALE_SCREEN_SPAWN, rotationY: 0 },
  },
  'casa-do-urso': {
    id: 'casa-do-urso',
    mainJoinIndex: 0,
    path: [],
    arrivePose: clampScreenWaypoint({ screenX: 0.58, screenY: 0.38, scale: 1, rotationY: Math.PI }),
  },
  'diario-mochila': {
    id: 'diario-mochila',
    mainJoinIndex: 0,
    path: [],
    arrivePose: clampScreenWaypoint({ screenX: 0.14, screenY: 0.58, scale: 1, rotationY: -Math.PI / 2 }),
  },
  'arvore-palavras': {
    id: 'arvore-palavras',
    mainJoinIndex: 0,
    path: [],
    arrivePose: clampScreenWaypoint({ screenX: 0.34, screenY: 0.48, scale: 1, rotationY: Math.PI / 2 }),
  },
  'jardim-flores': {
    id: 'jardim-flores',
    mainJoinIndex: 0,
    path: [],
    arrivePose: clampScreenWaypoint({ screenX: 0.22, screenY: 0.62, scale: 1, rotationY: 0 }),
  },
  'portal-comunicacao': {
    id: 'portal-comunicacao',
    mainJoinIndex: 0,
    path: [],
    arrivePose: clampScreenWaypoint({ screenX: 0.52, screenY: 0.52, scale: 1, rotationY: 0 }),
  },
}

export function getScreenRoute(id: string): ValeScreenRoute | undefined {
  return ROUTES[id]
}

export function isBearAtScreenPose(a: ValeScreenWaypoint, b: ValeScreenWaypoint, threshold = 0.03) {
  return Math.hypot(a.screenX - b.screenX, a.screenY - b.screenY) < threshold
}

/** Monta rota 2.5D simples: pose atual → arrivePose */
export function buildScreenPath(fromPose: ValeScreenWaypoint, id: string): ValeScreenWaypoint[] {
  const route = getScreenRoute(id)
  if (!route) return [clampScreenWaypoint({ ...fromPose })]
  const a = clampScreenWaypoint({ ...fromPose })
  const b = clampScreenWaypoint({ ...route.arrivePose })
  return [a, b]
}

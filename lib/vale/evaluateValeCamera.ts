import * as THREE from 'three'
import type { ValeCameraLayout } from './valeCameraLayout'
import {
  computeIslandTargetSize,
  computeValeFovForLayout,
} from './valeComposition'
import { VALE_BEAR_HERO, VALE_ISLAND_OFFSET } from './valeWorld'

const NATIVE_MAX_XZ = 0.20635
const NATIVE_Y = 0.12

const _camera = new THREE.PerspectiveCamera()
const _point = new THREE.Vector3()

export interface CameraCheck {
  id: string
  label: string
  pass: boolean
  hint?: string
}

export interface CameraEvaluation {
  ok: boolean
  score: number
  islandSize: number
  checks: CameraCheck[]
}

function projectWithLayout(
  layout: ValeCameraLayout,
  aspect: number,
  fov: number,
  world: THREE.Vector3,
) {
  _camera.fov = fov
  _camera.aspect = aspect
  _camera.position.set(layout.posX, layout.posY, layout.posZ)
  _camera.lookAt(layout.targetX, layout.targetY, layout.targetZ)
  _camera.updateProjectionMatrix()
  _camera.updateMatrixWorld(true)
  return world.clone().project(_camera)
}

/** Avalia se a câmera enquadra bem casa + Cadu para o viewport atual. */
export function evaluateValeCamera(
  layout: ValeCameraLayout,
  width: number,
  height: number,
): CameraEvaluation {
  const aspect = width / Math.max(height, 1)
  const fov = computeValeFovForLayout(aspect, layout.fov)
  const islandSize = computeIslandTargetSize(aspect, fov, layout)

  const [ox, oy] = VALE_ISLAND_OFFSET
  const scale = islandSize / NATIVE_MAX_XZ
  const houseHeight = NATIVE_Y * scale

  const houseBase = projectWithLayout(layout, aspect, fov, new THREE.Vector3(ox, oy, -1.35))
  const houseTop = projectWithLayout(
    layout,
    aspect,
    fov,
    new THREE.Vector3(ox, houseHeight + oy, -1.35),
  )
  const houseCenter = projectWithLayout(
    layout,
    aspect,
    fov,
    new THREE.Vector3(ox, houseHeight * 0.55 + oy, -1.35),
  )
  const houseScreenH = (houseTop.y - houseBase.y) / 2

  const bear = projectWithLayout(
    layout,
    aspect,
    fov,
    new THREE.Vector3(...VALE_BEAR_HERO.position),
  )

  const checks: CameraCheck[] = [
    {
      id: 'house-top',
      label: 'Telhado visível (sem cortar)',
      pass: houseTop.y <= 0.92,
      hint: houseTop.y > 0.92 ? 'Afaste ou suba a câmera — o telhado está cortado.' : undefined,
    },
    {
      id: 'house-center',
      label: 'Casa centrada na altura',
      pass: houseCenter.y >= 0.08 && houseCenter.y <= 0.56,
      hint:
        houseCenter.y < 0.08
          ? 'Aponte mais para cima (target Y).'
          : houseCenter.y > 0.56
            ? 'Aponte mais para baixo (target Y).'
            : undefined,
    },
    {
      id: 'house-size',
      label: 'Casa grande o suficiente',
      pass: houseScreenH >= 0.22,
      hint: houseScreenH < 0.22 ? 'Aproxime a câmera ou aumente o zoom da cena.' : undefined,
    },
    {
      id: 'house-on-screen',
      label: 'Casa dentro da tela',
      pass: houseBase.x >= -1.05 && houseTop.x <= 1.05,
      hint: 'Desloque a câmera ou o alvo para trazer a casa ao centro.',
    },
    {
      id: 'bear-visible',
      label: 'Cadu visível no caminho',
      pass: bear.y >= -0.95 && bear.y <= 0.92 && bear.x >= -1.05 && bear.x <= 0.75,
      hint: 'Ajuste posição/alvo para manter o urso no quadro inferior.',
    },
    {
      id: 'island-scale',
      label: 'Ilha em escala ideal',
      pass: islandSize >= 10.2,
      hint:
        islandSize < 10.2
          ? 'A câmera está apertada demais — afaste um pouco ou abra o FOV.'
          : undefined,
    },
    {
      id: 'scene-zoom',
      label: 'Zoom da cena equilibrado',
      pass: layout.sceneScale >= 1.12 && layout.sceneScale <= 1.58,
      hint:
        layout.sceneScale < 1.12
          ? 'Aumente o zoom da cena para mostrar mais a casa.'
          : layout.sceneScale > 1.58
            ? 'Diminua o zoom — está cortando demais.'
            : undefined,
    },
  ]

  const passed = checks.filter((c) => c.pass).length
  const score = Math.round((passed / checks.length) * 100)
  const ok = checks.every((c) => c.pass)

  return { ok, score, islandSize, checks }
}

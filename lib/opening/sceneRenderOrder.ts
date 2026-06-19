import type { Object3D } from 'three'

export function applyMeshRenderOrder(root: Object3D, order: number) {
  root.traverse((child) => {
    if ('isMesh' in child && child.isMesh) {
      child.renderOrder = order
    }
  })
}

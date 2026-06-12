import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'

const STUMP_BASE =
  '/models/cenario/stylized-cartoon-tree-stump-2026-02-06-15-16-55-utc'
const STUMP_FOLDER = '%5BOBJ%5D%20cartoon_stump_v6'

export const STUMP_OBJ_PATH = `${STUMP_BASE}/${STUMP_FOLDER}/cartoon_stump_v6.obj`
export const STUMP_MTL_PATH = `${STUMP_BASE}/${STUMP_FOLDER}/cartoon_stump_v6.mtl`
export const STUMP_RESOURCE_PATH = `${STUMP_BASE}/${STUMP_FOLDER}/`

export const STUMP_LOADER_KEY = 'vale-cartoon-stump'

let stumpScenePromise: Promise<THREE.Group> | null = null

async function fetchStumpScene() {
  const mtlLoader = new MTLLoader()
  mtlLoader.setResourcePath(STUMP_RESOURCE_PATH)
  const materials = await mtlLoader.loadAsync(STUMP_MTL_PATH)
  materials.preload()

  const objLoader = new OBJLoader()
  objLoader.setMaterials(materials)
  return objLoader.loadAsync(STUMP_OBJ_PATH)
}

export function preloadSceneStump() {
  if (!stumpScenePromise) stumpScenePromise = fetchStumpScene()
  return stumpScenePromise
}

/** Loader singleton para useLoader — chave fixa, URL ignorada. */
export class ValeStumpObjLoader extends THREE.Loader<THREE.Group> {
  load(_url: string, onLoad: (group: THREE.Group) => void, _onProgress?, onError?) {
    preloadSceneStump()
      .then(onLoad)
      .catch((err) => onError?.(err))
  }
}

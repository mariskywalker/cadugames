import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'

export const FERN_OBJ_PATH =
  '/models/cenario/stylized-fern-plant-2025-05-02-09-18-18-utc/%5BOBJ%5D%20carton_fern/carton_fern.obj'
export const FERN_MTL_PATH =
  '/models/cenario/stylized-fern-plant-2025-05-02-09-18-18-utc/%5BOBJ%5D%20carton_fern/carton_fern.mtl'
export const FERN_RESOURCE_PATH =
  '/models/cenario/stylized-fern-plant-2025-05-02-09-18-18-utc/%5BOBJ%5D%20carton_fern/'

export const FERN_LOADER_KEY = 'vale-carton-fern'

let fernScenePromise: Promise<THREE.Group> | null = null

async function fetchFernScene() {
  const mtlLoader = new MTLLoader()
  mtlLoader.setResourcePath(FERN_RESOURCE_PATH)
  const materials = await mtlLoader.loadAsync(FERN_MTL_PATH)
  materials.preload()

  const objLoader = new OBJLoader()
  objLoader.setMaterials(materials)
  return objLoader.loadAsync(FERN_OBJ_PATH)
}

export function preloadSceneFern() {
  if (!fernScenePromise) fernScenePromise = fetchFernScene()
  return fernScenePromise
}

/** Loader singleton para useLoader — chave fixa, URL ignorada. */
export class ValeFernObjLoader extends THREE.Loader<THREE.Group> {
  load(_url: string, onLoad: (group: THREE.Group) => void, _onProgress?, onError?) {
    preloadSceneFern()
      .then(onLoad)
      .catch((err) => onError?.(err))
  }
}

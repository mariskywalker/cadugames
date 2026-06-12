import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'

const LILAC_BASE =
  '/models/cenario/lilac-bush-syringa-vulgaris-with-blossoms-and-gr-2026-02-06-05-48-57-utc'
const LILAC_FOLDER = '%5BOBJ%5D%20Lilac_Natural_Group_001'

export const LILAC_OBJ_PATH = `${LILAC_BASE}/${LILAC_FOLDER}/Lilac_Natural_Group_001.obj`
export const LILAC_MTL_PATH = `${LILAC_BASE}/${LILAC_FOLDER}/Lilac_Natural_Group_001.mtl`
export const LILAC_RESOURCE_PATH = `${LILAC_BASE}/${LILAC_FOLDER}/`

export const LILAC_LOADER_KEY = 'vale-lilac-natural'

let lilacScenePromise: Promise<THREE.Group> | null = null

async function fetchLilacScene() {
  const mtlLoader = new MTLLoader()
  mtlLoader.setResourcePath(LILAC_RESOURCE_PATH)
  const materials = await mtlLoader.loadAsync(LILAC_MTL_PATH)
  materials.preload()

  const objLoader = new OBJLoader()
  objLoader.setMaterials(materials)
  return objLoader.loadAsync(LILAC_OBJ_PATH)
}

export function preloadSceneLilac() {
  if (!lilacScenePromise) lilacScenePromise = fetchLilacScene()
  return lilacScenePromise
}

/** Loader singleton para useLoader — chave fixa, URL ignorada. */
export class ValeLilacObjLoader extends THREE.Loader<THREE.Group> {
  load(
    _url: string,
    onLoad: (group: THREE.Group) => void,
    _onProgress?: (event: ProgressEvent<EventTarget>) => void,
    onError?: (err: unknown) => void,
  ) {
    preloadSceneLilac()
      .then(onLoad)
      .catch((err) => onError?.(err))
  }
}

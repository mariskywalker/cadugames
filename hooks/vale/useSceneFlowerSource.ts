'use client'

import { useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import type { Object3D } from 'three'
import { ValeFernObjLoader, FERN_LOADER_KEY } from '@/lib/vale/loadSceneFern'
import { ValeStumpObjLoader, STUMP_LOADER_KEY } from '@/lib/vale/loadSceneStump'
import { VALE_FLOWER_ASSETS } from '@/lib/vale/sceneFlowerAssets'

export function useGltfFlowerSource(): Object3D {
  const { scene } = useGLTF(VALE_FLOWER_ASSETS.lavender.url)
  return scene
}

export function useFernFlowerSource(): Object3D {
  return useLoader(ValeFernObjLoader, FERN_LOADER_KEY)
}

export function useLilacFlowerSource(): Object3D {
  const { scene } = useGLTF(VALE_FLOWER_ASSETS.lilac.url)
  return scene
}

export function useStumpFlowerSource(): Object3D {
  return useLoader(ValeStumpObjLoader, STUMP_LOADER_KEY)
}

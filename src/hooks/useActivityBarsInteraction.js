import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CHARACTER_STATES, MOVE_SPEED, ROTATION_SPEED } from '../constants/animations'
import {
  BARS_ARRIVAL_THRESHOLD,
  rotationYToFacePoint,
} from '../constants/activityBarsInteraction'
import { copyAnimationAnchor } from '../constants/activityBarsDefaults'
import { playAnimationCommand } from '../utils/animationCommandPlay'
import {
  assertActivityBarsConfig,
  assertConfigPointUsed,
  logBarsFacingTarget,
  logBarsPlayingCommand,
  logBarsSnapToAnchor,
  logBarsArrived,
  debugSnapToAnimationAnchor,
  resolveCommandClipName,
} from '../utils/activityBarsDebug'
import {
  applyAnimationAnchor,
  lockGroupToConfigAnimationAnchor,
  pinGroupToPoint,
  resetModelRoot,
} from '../utils/activityBarsNav'
import { useCADUStore } from '../store/useCADUStore'

const ORIENT_THRESHOLD = 0.045
const ANCHOR_LOCK_PRIORITY = -50

/**
 * Barra: approach → orient → snap (animationAnchor) → sequence.
 * Locomoção usa interactionPoint; animações usam somente animationAnchor.
 */
export function useActivityBarsInteraction({ groupRef, modelRef, actions, mixer, clipsReady }) {
  const activityBarsPhase = useCADUStore((s) => s.activityBarsPhase)
  const barAnimPending = useCADUStore((s) => s.barAnimPending)
  const targetPosition = useCADUStore((s) => s.targetPosition)
  const activityBarsInteractionPoint = useCADUStore((s) => s.activityBarsInteractionPoint)
  const activityBarsConfig = useCADUStore((s) => s.activityBarsConfig)
  const setCharacterState = useCADUStore((s) => s.setCharacterState)
  const finishActivityBarsInteraction = useCADUStore((s) => s.finishActivityBarsInteraction)
  const setAnimationError = useCADUStore((s) => s.setAnimationError)
  const setCurrentPlayingClip = useCADUStore((s) => s.setCurrentPlayingClip)

  const playingRef = useRef(false)
  const orientLoggedRef = useRef(false)
  const snapDoneRef = useRef(false)
  const lockedAnchorRef = useRef(null)
  const qTargetRef = useRef(new THREE.Quaternion())
  const eulerRef = useRef(new THREE.Euler())
  const vToTargetRef = useRef(new THREE.Vector3())
  const vDirRef = useRef(new THREE.Vector3())
  const vForwardRef = useRef(new THREE.Vector3(0, 0, 1))
  const qWalkRef = useRef(new THREE.Quaternion())

  const getLockedAnchor = () => {
    if (lockedAnchorRef.current) return lockedAnchorRef.current
    const config = assertActivityBarsConfig(useCADUStore.getState().activityBarsConfig)
    return copyAnimationAnchor(config.animationAnchor)
  }

  const snapGroupToLockedAnchor = () => {
    const group = groupRef.current
    const anchor = getLockedAnchor()
    if (!group || !anchor) return false
    applyAnimationAnchor(group, anchor)
    resetModelRoot(modelRef.current)
    return true
  }

  useFrame((_, delta) => {
    const st = useCADUStore.getState()
    if (st.activityBarsPhase !== 'approach') return
    const group = groupRef.current
    const point = st.activityBarsInteractionPoint
    if (!group || !point) return

    const tx = point[0]
    const ty = point[1] ?? 0
    const tz = point[2]

    const vToTarget = vToTargetRef.current
    vToTarget.set(tx, ty, tz).sub(group.position)
    vToTarget.y = 0
    const dist = vToTarget.length()

    if (dist < BARS_ARRIVAL_THRESHOLD) {
      group.position.set(tx, ty, tz)
      logBarsArrived(group)
      useCADUStore.setState({
        activityBarsPhase: 'orient',
        targetPosition: null,
        characterState: CHARACTER_STATES.IDLE,
      })
      return
    }

    const vDir = vDirRef.current.copy(vToTarget).normalize()
    const step = Math.min(dist, MOVE_SPEED * delta)
    group.position.x += vDir.x * step
    group.position.y = ty
    group.position.z += vDir.z * step

    qWalkRef.current.setFromUnitVectors(vForwardRef.current, vDir)
    group.quaternion.slerp(qWalkRef.current, 1 - Math.exp(-ROTATION_SPEED * delta))
    resetModelRoot(modelRef.current)

    if (st.characterState !== CHARACTER_STATES.WALK) {
      setCharacterState(CHARACTER_STATES.WALK)
    }
  })

  useFrame(() => {
    const st = useCADUStore.getState()
    const phase = st.activityBarsPhase
    const group = groupRef.current
    if (!group || phase !== 'orient') return

    const point = st.activityBarsInteractionPoint
    if (!point) return
    pinGroupToPoint(group, point)
    resetModelRoot(modelRef.current)
  })

  useFrame((_, delta) => {
    const st = useCADUStore.getState()
    if (st.activityBarsPhase !== 'orient') return
    const group = groupRef.current
    if (!group) return

    const config = assertActivityBarsConfig(st.activityBarsConfig)
    const [tx, , tz] = config.faceTarget
    const targetY = rotationYToFacePoint(group.position.x, group.position.z, tx, tz)
    qTargetRef.current.setFromEuler(eulerRef.current.set(0, targetY, 0))
    group.quaternion.slerp(qTargetRef.current, 1 - Math.exp(-ROTATION_SPEED * delta))

    const currentY = eulerRef.current.setFromQuaternion(group.quaternion, 'YXZ').y
    let diff = Math.abs(targetY - currentY)
    if (diff > Math.PI) diff = 2 * Math.PI - diff

    if (diff < ORIENT_THRESHOLD) {
      group.quaternion.copy(qTargetRef.current)
      group.rotation.set(0, targetY, 0)
      useCADUStore.setState({ activityBarsPhase: 'snap' })
    }
  })

  useFrame(() => {
    const phase = useCADUStore.getState().activityBarsPhase
    if (phase !== 'snap' && phase !== 'sequence') return
    snapGroupToLockedAnchor()
  }, ANCHOR_LOCK_PRIORITY)

  useEffect(() => {
    if (activityBarsPhase !== 'orient') {
      orientLoggedRef.current = false
      return
    }
    if (orientLoggedRef.current) return
    orientLoggedRef.current = true

    try {
      const config = assertActivityBarsConfig(activityBarsConfig)
      assertConfigPointUsed(
        'orient interactionPoint',
        activityBarsInteractionPoint,
        config.interactionPoint,
      )
      logBarsFacingTarget(config.faceTarget)
    } catch (err) {
      console.error(err)
      setAnimationError(err.message)
      finishActivityBarsInteraction({ failed: true })
    }
  }, [
    activityBarsPhase,
    activityBarsConfig,
    activityBarsInteractionPoint,
    setAnimationError,
    finishActivityBarsInteraction,
  ])

  useEffect(() => {
    if (activityBarsPhase !== 'snap') {
      snapDoneRef.current = false
      return
    }
    if (snapDoneRef.current) return
    snapDoneRef.current = true

    try {
      const config = assertActivityBarsConfig(activityBarsConfig)
      const anchor = copyAnimationAnchor(config.animationAnchor)
      if (!anchor) throw new Error('[CADU Bars] animationAnchor missing from config')

      lockedAnchorRef.current = anchor
      logBarsSnapToAnchor(anchor)

      const characterGroup = groupRef.current
      if (!characterGroup) throw new Error('[CADU Bars] character group missing at snap')

      if (!lockGroupToConfigAnimationAnchor(characterGroup, config)) {
        throw new Error('[CADU Bars] failed to snap group to animationAnchor')
      }
      resetModelRoot(modelRef.current)

      useCADUStore.setState({
        activityBarsPhase: 'sequence',
        targetPosition: null,
        characterState: CHARACTER_STATES.IDLE,
      })
    } catch (err) {
      console.error(err)
      setAnimationError(err.message)
      finishActivityBarsInteraction({ failed: true })
    }
  }, [
    activityBarsPhase,
    activityBarsConfig,
    groupRef,
    modelRef,
    setAnimationError,
    finishActivityBarsInteraction,
  ])

  useEffect(() => {
    if (activityBarsPhase !== 'sequence') return
    if (!barAnimPending || targetPosition || !clipsReady || !actions) return
    if (useCADUStore.getState().manualClipName) return
    if (playingRef.current) return

    let config
    try {
      config = assertActivityBarsConfig(activityBarsConfig)
    } catch (err) {
      console.error(err)
      setAnimationError(err.message)
      finishActivityBarsInteraction({ failed: true })
      return
    }

    const anchor = copyAnimationAnchor(config.animationAnchor)
    if (!anchor) {
      setAnimationError('[CADU Bars] animationAnchor missing — cannot play bar clips')
      finishActivityBarsInteraction({ failed: true })
      return
    }
    lockedAnchorRef.current = anchor

    const characterGroup = groupRef.current
    if (!characterGroup) {
      setAnimationError('[CADU Bars] character group missing before animation sequence')
      finishActivityBarsInteraction({ failed: true })
      return
    }

    const snapped = debugSnapToAnimationAnchor(config, characterGroup, () =>
      lockGroupToConfigAnimationAnchor(characterGroup, config),
    )
    if (!snapped) {
      setAnimationError('[CADU Bars] failed to lock group at animationAnchor before sequence')
      finishActivityBarsInteraction({ failed: true })
      return
    }
    resetModelRoot(modelRef.current)

    const { animationClips } = useCADUStore.getState()
    const steps = config.animationSequence.filter((k) => k !== 'idle')
    playingRef.current = true

    const finishSequence = () => {
      playingRef.current = false
      snapGroupToLockedAnchor()

      logBarsPlayingCommand('idle', resolveCommandClipName('idle'))
      const idleResult = playAnimationCommand(actions, 'idle', animationClips, {
        mixer,
        loop: true,
      })
      if (idleResult.ok) setCurrentPlayingClip(idleResult.clipName)
      else setAnimationError(idleResult.error)

      setCharacterState(CHARACTER_STATES.IDLE)
      lockedAnchorRef.current = null
      finishActivityBarsInteraction()
    }

    const playStep = (index) => {
      snapGroupToLockedAnchor()

      const commandKey = steps[index]
      if (!commandKey) {
        finishSequence()
        return
      }

      if (!config.animationSequence.includes(commandKey)) {
        const err = new Error(
          `[CADU Bars] animationSequence config not used — missing command "${commandKey}"`,
        )
        console.error(err)
        setAnimationError(err.message)
        playingRef.current = false
        lockedAnchorRef.current = null
        finishActivityBarsInteraction({ failed: true })
        return
      }

      let clipName
      try {
        clipName = resolveCommandClipName(commandKey)
      } catch (err) {
        console.error(err)
        setAnimationError(err.message)
        playingRef.current = false
        lockedAnchorRef.current = null
        finishActivityBarsInteraction({ failed: true })
        return
      }

      logBarsPlayingCommand(commandKey, clipName)

      const result = playAnimationCommand(actions, commandKey, animationClips, {
        mixer,
        loop: false,
        onFinished: () => {
          snapGroupToLockedAnchor()
          playStep(index + 1)
        },
      })

      if (!result.ok) {
        setAnimationError(result.error)
        playingRef.current = false
        lockedAnchorRef.current = null
        finishActivityBarsInteraction({ failed: true })
        return
      }

      setCurrentPlayingClip(result.clipName)
    }

    playStep(0)

    return () => {
      playingRef.current = false
    }
  }, [
    activityBarsPhase,
    barAnimPending,
    targetPosition,
    clipsReady,
    actions,
    mixer,
    activityBarsConfig,
    groupRef,
    modelRef,
    setCharacterState,
    finishActivityBarsInteraction,
    setAnimationError,
    setCurrentPlayingClip,
  ])

  useEffect(() => {
    if (activityBarsPhase) return
    lockedAnchorRef.current = null
    playingRef.current = false
  }, [activityBarsPhase])
}

export function isBarAnimActive(barAnimPending, targetPosition, activityBarsPhase) {
  const phase = activityBarsPhase ?? useCADUStore.getState().activityBarsPhase
  if (!barAnimPending || targetPosition) return false
  return phase === 'orient' || phase === 'snap' || phase === 'sequence'
}

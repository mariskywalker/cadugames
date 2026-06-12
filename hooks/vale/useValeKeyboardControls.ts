'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { RefObject } from 'react'
import type { Group } from 'three'
import { useValeStore } from '@/store/useValeStore'

const MOVE_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])
const LOOK_AHEAD = 4.5

function isTypingInField(target: EventTarget | null) {
  const el = target as HTMLElement | null
  if (!el?.tagName) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable
}

/** Setas do teclado — define destino contínuo para a locomoção do urso */
export function useValeKeyboardControls({
  groupRef,
  enabled = true,
}: {
  groupRef: RefObject<Group | null>
  enabled?: boolean
}) {
  const pressedRef = useRef(new Set<string>())
  const shiftRef = useRef(false)
  const setWalkTarget = useValeStore((s) => s.setWalkTarget)
  const clearTarget = useValeStore((s) => s.clearTarget)

  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingInField(e.target)) return
      if (e.key === 'Shift') {
        shiftRef.current = true
        return
      }
      if (!MOVE_KEYS.has(e.key)) return
      e.preventDefault()
      e.stopPropagation()
      pressedRef.current.add(e.key)
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        shiftRef.current = false
        return
      }
      if (!MOVE_KEYS.has(e.key)) return
      e.preventDefault()
      pressedRef.current.delete(e.key)
      if (pressedRef.current.size === 0) clearTarget()
    }

    const onBlur = () => {
      pressedRef.current.clear()
      shiftRef.current = false
      clearTarget()
    }

    window.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('keyup', onKeyUp, true)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('keyup', onKeyUp, true)
      window.removeEventListener('blur', onBlur)
    }
  }, [clearTarget, enabled])

  useFrame(() => {
    if (!enabled) return

    const group = groupRef.current
    const pressed = pressedRef.current
    if (!group || pressed.size === 0) return

    let dx = 0
    let dz = 0
    if (pressed.has('ArrowUp')) dz -= 1
    if (pressed.has('ArrowDown')) dz += 1
    if (pressed.has('ArrowLeft')) dx -= 1
    if (pressed.has('ArrowRight')) dx += 1

    const len = Math.hypot(dx, dz)
    if (len < 0.01) return

    dx /= len
    dz /= len

    setWalkTarget(
      group.position.x + dx * LOOK_AHEAD,
      group.position.z + dz * LOOK_AHEAD,
      { run: shiftRef.current },
    )
  })
}

import { RoundedBox } from '@react-three/drei'

// Minimal, Spline-inspired cozy room shell (rounded + matte).
export function Room() {
  return (
    <group>
      {/* Back wall */}
      <RoundedBox args={[9.2, 4.4, 0.5]} radius={0.45} smoothness={8} position={[0, 2.1, -4.1]}>
        <meshStandardMaterial color="#f1f5f9" roughness={1} metalness={0} />
      </RoundedBox>

      {/* Side walls */}
      <RoundedBox
        args={[0.5, 4.1, 7.8]}
        radius={0.45}
        smoothness={8}
        position={[-4.3, 2.05, -0.25]}
      >
        <meshStandardMaterial color="#f8fafc" roughness={1} metalness={0} />
      </RoundedBox>
      <RoundedBox
        args={[0.5, 4.1, 7.8]}
        radius={0.45}
        smoothness={8}
        position={[4.3, 2.05, -0.25]}
      >
        <meshStandardMaterial color="#f8fafc" roughness={1} metalness={0} />
      </RoundedBox>

      {/* Soft baseboard / ledge */}
      <RoundedBox args={[9.2, 0.35, 0.55]} radius={0.18} smoothness={8} position={[0, 0.15, -3.85]}>
        <meshStandardMaterial color="#e2e8f0" roughness={1} metalness={0} />
      </RoundedBox>

      {/* Window-like panel (just a matte pastel inset) */}
      <RoundedBox
        args={[3.8, 2.2, 0.18]}
        radius={0.5}
        smoothness={10}
        position={[0, 2.35, -3.86]}
      >
        <meshStandardMaterial color="#e0f2fe" roughness={1} metalness={0} />
      </RoundedBox>
    </group>
  )
}


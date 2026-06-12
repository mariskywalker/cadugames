/**
 * Floating world card — labels live in the scene, not the HUD.
 */
export function WorldLabel({ children, variant = 'default', className = '', as = 'div' }) {
  const Tag = as
  return (
    <Tag className={`cadu-world-card cadu-world-card--${variant} ${className}`.trim()}>{children}</Tag>
  )
}

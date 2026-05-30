/** Nuvem widget — balanço autônomo, tamanho compacto. */
export function CloudWidget({ className = '', style, delay = 0, duration = 5.5, scale = 1 }) {
  return (
    <div
      className={`cadu-cloud-widget ${className}`.trim()}
      style={{
        ...style,
        '--cloud-delay': `${delay}s`,
        '--cloud-duration': `${duration}s`,
        '--cloud-scale': scale,
      }}
      aria-hidden
    >
      <div className="cadu-cloud-widget__body">
        <span className="cadu-cloud-widget__puff cadu-cloud-widget__puff--a" />
        <span className="cadu-cloud-widget__puff cadu-cloud-widget__puff--b" />
        <span className="cadu-cloud-widget__puff cadu-cloud-widget__puff--c" />
      </div>
    </div>
  )
}

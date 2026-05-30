const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

/** Ícones outline — substitua ou adicione chaves aqui. */
const ICONS = {
  home: (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <path {...stroke} d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <path {...stroke} d="M7 4v2M17 4v2M5 8h14M6 6h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  document: (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <path {...stroke} d="M8 4h6l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
      <path {...stroke} d="M14 4v4h4M9 12h6M9 16h4" />
    </svg>
  ),
  mascot: (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <path {...stroke} d="M6 10a6 6 0 1 1 12 0c0 2.2-1.2 4.1-3 5.2V18H9v-2.8C7.2 14.1 6 12.2 6 10Z" />
      <circle {...stroke} cx="10" cy="9" r="0.75" fill="currentColor" stroke="none" />
      <circle {...stroke} cx="14" cy="9" r="0.75" fill="currentColor" stroke="none" />
      <path {...stroke} d="M10.5 12.5c.8.6 1.7.9 2.5.9s1.7-.3 2.5-.9" />
    </svg>
  ),
  video: (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <path {...stroke} d="M4 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
      <path {...stroke} d="m16 10 5-3v10l-5-3v-4Z" />
    </svg>
  ),
}

export function LandingDockIcon({ name }) {
  return ICONS[name] ?? ICONS.home
}

'use client'

export function MusicIslandThumbnail({ large = false }: { large?: boolean }) {
  return (
    <svg
      className={large ? 'music-island-thumb music-island-thumb--large' : 'music-island-thumb'}
      viewBox="0 0 240 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse cx="120" cy="154" rx="86" ry="10" fill="rgba(180, 140, 255, 0.18)" />
      <path
        d="M36 118C44 78 82 52 120 50C158 52 196 78 204 118C204 134 168 146 120 146C72 146 36 134 36 118Z"
        fill="#D4BCFF"
      />
      <path
        d="M68 124L120 144L172 124C162 108 142 98 120 96C98 98 78 108 68 124Z"
        fill="#C4A6FF"
      />
      <circle cx="92" cy="108" r="14" fill="#9B7AE8" opacity="0.7" />
      <circle cx="148" cy="104" r="18" fill="#9B7AE8" opacity="0.55" />
      <path
        d="M108 92C112 84 128 84 132 92"
        stroke="#FFE8A3"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M120 92V108" stroke="#FFE8A3" strokeWidth="4" strokeLinecap="round" />
      <text x="120" y="78" textAnchor="middle" fontSize="22">
        🎵
      </text>
    </svg>
  )
}

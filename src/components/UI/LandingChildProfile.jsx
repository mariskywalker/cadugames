import { useState } from 'react'

const GREETINGS = [
  'Oi! Eu sou o Lucas 👋',
  'Hoje estou tranquilo ✨',
  'Vamos explorar juntos?',
]

export function LandingChildProfile() {
  const [open, setOpen] = useState(false)
  const [greetIndex, setGreetIndex] = useState(0)
  const [waving, setWaving] = useState(false)

  const onActivate = () => {
    setOpen((v) => !v)
    setGreetIndex((i) => (i + 1) % GREETINGS.length)
    setWaving(true)
    window.setTimeout(() => setWaving(false), 700)
  }

  return (
    <article className={`cadu-landing-profile${open ? ' is-open' : ''}${waving ? ' is-wave' : ''}`}>
      <button
        type="button"
        className="cadu-landing-profile__main"
        onClick={onActivate}
        aria-expanded={open}
        aria-label="Perfil do Lucas — toque para interagir"
      >
        <span className="cadu-landing-profile__ring" aria-hidden />
        <span className="cadu-landing-profile__avatar" aria-hidden>
          <span className="cadu-landing-profile__face">😊</span>
        </span>
        <span className="cadu-landing-profile__copy">
          <span className="cadu-landing-profile__name">Lucas</span>
          <span className="cadu-landing-profile__meta">7 anos · Explorador</span>
        </span>
        <span className="cadu-landing-profile__wave" aria-hidden>
          👋
        </span>
      </button>

      {open && (
        <div className="cadu-landing-profile__popover cadu-glass-card" role="status">
          <p className="cadu-landing-profile__greet">{GREETINGS[greetIndex]}</p>
          <p className="cadu-landing-profile__hint">Toque de novo para outra mensagem</p>
        </div>
      )}
    </article>
  )
}

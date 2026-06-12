import { CHARACTER_STATES } from '../../constants/animations'
import { useCADUStore } from '../../store/useCADUStore'

const MOODS = [
  { state: CHARACTER_STATES.HAPPY, emoji: '😊', label: 'Feliz' },
  { state: CHARACTER_STATES.SAD, emoji: '😢', label: 'Triste' },
  { state: CHARACTER_STATES.ANGRY, emoji: '😡', label: 'Bravo' },
  { state: CHARACTER_STATES.SCARED, emoji: '😨', label: 'Assustado' },
]

export function CharacterMoodPicker({ onClose }) {
  const characterState = useCADUStore((s) => s.characterState)
  const triggerEmotion = useCADUStore((s) => s.triggerEmotion)
  const resetToIdle = useCADUStore((s) => s.resetToIdle)

  return (
    <div className="cadu-mood-picker" role="menu" aria-label="Como o CADU está se sentindo?">
      <p className="cadu-mood-picker__title">Como você está?</p>
      <div className="cadu-mood-picker__grid">
        {MOODS.map((m) => (
          <button
            key={m.state}
            type="button"
            role="menuitem"
            className={`cadu-mood-picker__btn ${characterState === m.state ? 'is-active' : ''}`}
            onClick={() => {
              triggerEmotion(m.state)
              onClose?.()
            }}
            title={m.label}
          >
            <span className="cadu-mood-picker__emoji" aria-hidden>
              {m.emoji}
            </span>
            <span className="cadu-mood-picker__label">{m.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="cadu-mood-picker__calm"
        onClick={() => {
          resetToIdle()
          onClose?.()
        }}
      >
        Voltar ao calmo
      </button>
    </div>
  )
}

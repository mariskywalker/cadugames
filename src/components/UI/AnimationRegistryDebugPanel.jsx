import { useState } from 'react'
import { getRolesForClipName, validateAnimationRegistry } from '../../utils/animationRegistry'
import { getPlayableAnimationClips } from '../../utils/registryOverridesStorage'
import { useCADUStore } from '../../store/useCADUStore'
import './animation-registry-debug.css'

export function AnimationRegistryDebugPanel() {
  const [collapsed, setCollapsed] = useState(false)

  const animationClips = useCADUStore((s) => s.animationClips)
  const registryOverrides = useCADUStore((s) => s.registryOverrides)
  const modelStatus = useCADUStore((s) => s.modelStatus)
  const currentPlayingClip = useCADUStore((s) => s.currentPlayingClip)
  const selectedClipName = useCADUStore((s) => s.selectedClipName)
  const animationError = useCADUStore((s) => s.animationError)
  const setManualClip = useCADUStore((s) => s.setManualClip)
  const setRegistryClipOverride = useCADUStore((s) => s.setRegistryClipOverride)
  const clearRegistryClipOverride = useCADUStore((s) => s.clearRegistryClipOverride)
  const resetRegistryOverrides = useCADUStore((s) => s.resetRegistryOverrides)

  const registryStatus = validateAnimationRegistry(animationClips, registryOverrides)
  const playableClips = getPlayableAnimationClips(animationClips)

  return (
    <aside
      className={`cadu-anim-debug${collapsed ? ' is-collapsed' : ''}`}
      aria-label="Debug do Animation Registry"
    >
      <div className="cadu-anim-debug__head">
        <h2 className="cadu-anim-debug__title">Animation Registry</h2>
        <button
          type="button"
          className="cadu-anim-debug__toggle"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? '▸' : '▾'}
        </button>
      </div>

      {!collapsed && (
        <div className="cadu-anim-debug__body">
          <p className="cadu-anim-debug__hint">
            O GLB Meshy pode rotular clips errado — teste ▶ e escolha o <code>clip.name</code> correto
            no dropdown de cada função.
          </p>

          {animationError && (
            <p className="cadu-anim-debug__error" role="alert">
              {animationError}
            </p>
          )}

          <dl className="cadu-anim-debug__status">
            <div>
              <dt>Selecionado</dt>
              <dd>{selectedClipName ?? '—'}</dd>
            </div>
            <div>
              <dt>Tocando</dt>
              <dd>{currentPlayingClip ?? '—'}</dd>
            </div>
          </dl>

          <div className="cadu-anim-debug__table-wrap">
            <table className="cadu-anim-debug__table">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>clip.name</th>
                  <th>Role</th>
                  <th>GLB</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {registryStatus.map(
                  ({ role, label, clipName, defaultClipName, isOverridden, exists }) => (
                    <tr key={role} className={exists ? '' : 'is-missing'}>
                      <td>{label}</td>
                      <td>
                        <select
                          className="cadu-anim-debug__select"
                          value={clipName}
                          onChange={(e) => {
                            const next = e.target.value
                            if (next === defaultClipName) clearRegistryClipOverride(role)
                            else setRegistryClipOverride(role, next)
                          }}
                        >
                          {playableClips.map((name) => (
                            <option key={name} value={name}>
                              {name}
                              {name === defaultClipName ? ' (default)' : ''}
                            </option>
                          ))}
                        </select>
                        {isOverridden && (
                          <span className="cadu-anim-debug__override-tag">override</span>
                        )}
                      </td>
                      <td>
                        <code>{role}</code>
                      </td>
                      <td>{exists ? '✓' : '✗'}</td>
                      <td>
                        <button
                          type="button"
                          className="cadu-anim-debug__play"
                          disabled={!exists}
                          onClick={() => setManualClip(clipName)}
                          title={`Tocar ${clipName}`}
                        >
                          ▶
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            className="cadu-anim-debug__reset"
            onClick={() => resetRegistryOverrides()}
          >
            Resetar overrides
          </button>

          <h3 className="cadu-anim-debug__subtitle">Clips ativos do GLB</h3>
          <ul className="cadu-anim-debug__glb-list">
            {playableClips.map((clipName) => {
              const roles = getRolesForClipName(clipName, registryOverrides)
              return (
                <li key={clipName}>
                  <code className="cadu-anim-debug__clip-id">{clipName}</code>
                  {roles.length > 0 && (
                    <span className="cadu-anim-debug__clip-roles">
                      {roles.map((r) => r.label).join(', ')}
                    </span>
                  )}
                  <button
                    type="button"
                    className="cadu-anim-debug__play"
                    onClick={() => setManualClip(clipName)}
                    title={`Tocar ${clipName}`}
                  >
                    ▶
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </aside>
  )
}

import { useCADUStore } from '../../store/useCADUStore'

export function ScenePickOverlay() {
  const scenePickMode = useCADUStore((s) => s.scenePickMode)
  const lastScenePick = useCADUStore((s) => s.lastScenePick)
  const scenePickMessage = useCADUStore((s) => s.scenePickMessage)
  const setScenePickMode = useCADUStore((s) => s.setScenePickMode)

  if (!scenePickMode) return null

  const pos = lastScenePick?.position

  return (
    <div className="scene-pick-overlay" role="status" aria-live="polite">
      <div className="scene-pick-overlay__card">
        <div className="scene-pick-overlay__title">Modo marcação na cena</div>
        <p className="scene-pick-overlay__hint">
          Clique onde quer reposicionar algo. As coordenadas são copiadas — cole no chat para eu ajustar.
        </p>
        <ul className="scene-pick-overlay__keys">
          <li>
            <kbd>L</kbd> sair
          </li>
          <li>Botão direito: girar câmera</li>
          <li>Scroll: zoom</li>
        </ul>
        {pos && (
          <code className="scene-pick-overlay__coords">
            position: [{pos[0].toFixed(2)}, {pos[1].toFixed(2)}, {pos[2].toFixed(2)}]
          </code>
        )}
        {scenePickMessage && <p className="scene-pick-overlay__msg">{scenePickMessage}</p>}
        <button type="button" className="scene-pick-overlay__exit" onClick={() => setScenePickMode(false)}>
          Concluir marcação
        </button>
      </div>
    </div>
  )
}

import { useCADUStore } from '../../store/useCADUStore'

/**
 * Botões de ferramentas da sala 3D (câmera + editor de layout).
 */
export function CameraControlsBar() {
  const viewMode = useCADUStore((s) => s.viewMode)
  const freeCameraMode = useCADUStore((s) => s.freeCameraMode)
  const scenePickMode = useCADUStore((s) => s.scenePickMode)
  const sceneEditorMode = useCADUStore((s) => s.sceneEditorMode)
  const setFreeCameraMode = useCADUStore((s) => s.setFreeCameraMode)
  const toggleSceneEditorMode = useCADUStore((s) => s.toggleSceneEditorMode)
  const toggleActivityBarsEditMode = useCADUStore((s) => s.toggleActivityBarsEditMode)

  if (viewMode !== '3d' || scenePickMode || sceneEditorMode) return null

  if (!freeCameraMode) {
    return (
      <div className="scene-dev-tools">
        <button
          type="button"
          className="camera-unlock-btn scene-dev-tools__btn"
          aria-label="Editor da barra de atividades"
          title="Ajustar hotspot e pontos da barra (atalho B)"
          onClick={() => toggleActivityBarsEditMode()}
        >
          <span className="camera-unlock-btn__icon" aria-hidden>
            ⧉
          </span>
          Barras
        </button>
        <button
          type="button"
          className="camera-unlock-btn scene-dev-tools__btn"
          aria-label="Abrir editor de cena"
          title="Mover objetos da sala (atalho G)"
          onClick={() => toggleSceneEditorMode()}
        >
          <span className="camera-unlock-btn__icon" aria-hidden>
            ▦
          </span>
          Editor de cena
        </button>
        <button
          type="button"
          className="camera-unlock-btn scene-dev-tools__btn"
          aria-label="Ajustar câmera da sala"
          title="Girar e dar zoom na cena"
          onClick={() => setFreeCameraMode(true)}
        >
          <span className="camera-unlock-btn__icon" aria-hidden>
            ◎
          </span>
          Ajustar câmera
        </button>
      </div>
    )
  }

  return (
    <div className="free-camera-hint" role="status">
      <span>Câmera livre — arraste · scroll · botão direito para mover</span>
      <button type="button" className="free-camera-hint__lock" onClick={() => setFreeCameraMode(false)}>
        Salvar posição
      </button>
    </div>
  )
}

/** @deprecated use CameraControlsBar */
export const FreeCameraHint = CameraControlsBar

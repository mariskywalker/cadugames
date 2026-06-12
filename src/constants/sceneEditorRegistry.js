import { SCENE_OBJECTS, sceneObjectDefaults } from './sceneComposition'

/** Objetos editáveis na cena 3D (GLBs + tubo + âncoras). */
export const SCENE_EDITOR_OBJECTS = [
  {
    id: 'bubbleColumn',
    label: 'Coluna de bolhas',
    defaults: sceneObjectDefaults(SCENE_OBJECTS.bubbleColumn),
  },
  {
    id: 'ballPit',
    label: 'Piscina de bolinhas',
    defaults: sceneObjectDefaults(SCENE_OBJECTS.ballPit),
  },
  {
    id: 'activityBars',
    label: 'Barras de atividades',
    defaults: sceneObjectDefaults(SCENE_OBJECTS.activityBars),
  },
  {
    id: 'sensoryCocoon',
    label: 'Casulo sensorial',
    defaults: sceneObjectDefaults(SCENE_OBJECTS.sensoryCocoon),
  },
  {
    id: 'emotionPanel',
    label: 'Painel emocional (âncora)',
    defaults: sceneObjectDefaults(SCENE_OBJECTS.emotionPanel),
    anchorOnly: true,
  },
]

export const SCENE_EDITOR_OBJECT_MAP = Object.fromEntries(
  SCENE_EDITOR_OBJECTS.map((o) => [o.id, o]),
)

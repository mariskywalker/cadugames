/**
 * Re-exporta dados do vertical slice CADU LIFE.
 * Fonte canonica: lifeSliceData.ts
 */
export * from './lifeSliceData'

export {
  lifeMarcos as lifeSkills,
  lifeConquistas as lifeAchievements,
  getMarcosByDimension as getSkillsByDimension,
  getConquistasByDimension as getAchievementsByDimension,
} from './lifeSliceData'

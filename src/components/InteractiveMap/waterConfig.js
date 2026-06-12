/**
 * Water region mask — tune `clipPath` to match your background illustration.
 * Coordinates are percentages of the scene box (polygon points: x y pairs).
 *
 * Optional: set `maskImage` to `/interactive-map/water-mask.png` (white = visible)
 * and leave clipPath null to use image mask instead.
 */
export const WATER_REGION = {
  // Curved shoreline (default placeholder art)
  clipPath:
    'polygon(0% 58%, 12% 54%, 28% 57%, 48% 51%, 68% 54%, 88% 49%, 100% 52%, 100% 100%, 0% 100%)',
  maskImage: null,

  /** Vertical extent hint for fallback layout (not used when clip-path is set) */
  bottomPercent: 0,
  heightPercent: 46,
}

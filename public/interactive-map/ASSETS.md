# Interactive map assets

Replace these placeholder files with your illustrated art (same filenames).

| File | Purpose |
|------|---------|
| `background.webp` or `background.png` | Full-scene illustrated background (static) |
| `foreground.webp` or `foreground.png` | Optional props in front (pier, barrels, etc.) — omit if unused |
| `water.mp4` | Looping water animation (muted, plays only inside water mask). Falls back to `water-fallback.svg` |
| `water-fallback.svg` | Static water when video fails or is not provided |
| `water-mask.png` | Optional grayscale mask (white = water). Set `maskImage` in `src/components/InteractiveMap/waterConfig.js` |

Tune the shoreline shape in **`src/components/InteractiveMap/waterConfig.js`** (`clipPath` polygon) so motion stays only on the water area.

Recommended export sizes: **1920×1080** (16:9). Keep important content inside the center 80% for mobile crop.

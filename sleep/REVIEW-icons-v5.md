# Sleep Transparent Icons v5 — Human Visual Review

## Scope
- P1-027 noncanonical, dummy-only visual prototype; not product implementation or Visual Contract.
- Product canonical checked on latest main `3e8fec70b2f85993874c6b5a0358a2469e9f168e`; Migration State `ACTIVE`.
- Preview parent: `1b13111be786fb10e52e392e5623c636cd28a008`. Only four card icons plus their CSS, markup reference, Hub label and this review record changed.
- Original v3 landscape thumbnails and all existing image assets are kept for comparison/rollback.

## Design
- Replace each square landscape illustration with an independent transparent SVG motif: crescent moon (bedtime), warm sun (wakeup), twin leaves (deep sleep), single cloud (REM).
- No colored square icon background, white rectangle, decorative stars on icons, or separate icon border.
- Keep the outer card surfaces in Day/Night, their live text and compare tap affordance.
- The SVGs are original vector interpretations of the already discussed watercolor icon direction; they are **not** pixel-identical crops from the prior generated concept image.

## Verification and limits
- Local visual fixture used v4 CSS and original v3 WebP assets plus v5 SVG and CSS.
- Chromium/Playwright at 320, 360, 390, 411, 430 CSS px × Day/Night: 10/10 PASS for no horizontal scroll, transparent icon CSS/no borders, 1:1 sizing, no card text/right-side overflow and preserving document-scrolling background.
- The smoke fixture is a **visual/layout approximation**, not a full test of the actual deployed HTML/JS and the live Google Fonts pipeline. Existing JS was unchanged.
- Pixel device scrolling, tapping comparison sheet, and long copy still require Human verification. Do not mark Visual PASS on automated checks alone.

## Human check
1. Day/Night: all four motifs are visible and sufficiently distinct without background tiles.
2. Durations and "比較を見る" remain readable, including on narrow widths.
3. Existing theme toggle, chart tap, sheet drag and scrolling still feel natural.
4. Compare to v4, give feedback before design adoption or `specs/sleep/`.

Notion Sync: Required NO — temporary noncanonical visual iteration. AI Usage: Unverified — usage telemetry unavailable.

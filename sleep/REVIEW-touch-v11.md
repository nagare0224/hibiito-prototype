# Sleep touch gestures v11 — bounded mobile bugfix checkpoint

## Reported failure
- Human on Pixel 11: "長押しスライドが効いてません" after v10.
- v10 code used Pointer Events only, `touch-action:pan-y` on the SVG, and cancelled the 330ms hold after just 12px of pre-hold movement. In mobile browsers native scrolling can cancel the Pointer Event stream. **Likely cause; no remote Pixel diagnostic traces, so not proven for this specific report**.
- The absence of real-device traces makes exact failure cause **Unverified**. No Android production implementation undertaken.

## v11 limited fix
- Use actual Touch Events for touch (passive start/end, **non-passive move**) while Pointer Events remain for pen/mouse; ignore touch-pointer compatibility events.
- Hold 300ms to begin transient preview **or** move horizontally 9px to begin it earlier; perform touchmove preventDefault only after a horizontal scrub is recognized. Vertical movement before scrub remains normal browser scrolling.
- Movement across whole graph selects intervals by source elapsed duration. Release/cancel removes preview and restores any prior fixed selection. Tap remains fixed detail; `‹/›`, outside, Escape and keyboard stay unchanged.
- Suppress long-press native context menu inside graph.
- No changes to dummy stage data, Stage colors, C comparison sheet, Day/Night visuals, v9 exceptional states, the product repo, or 7/30/90 spec-change candidate.
- `v11` is **only** a public-safe static prototype improvement. Pixel 11 Human proof remains pending; don't mark gesture PASS based on static review or Pages deployment.

## Verification design
1. Pixel 11 Day/Night: hold >300ms then move left/right; popover follows and says 確認中. Release returns to fixed selection if present or closes.
2. Start horizontal movement before long hold: also scrub, no stuck fixed marker.
3. Normal vertical swipe within graph should scroll page, without creating a fixed selection.
4. Tap stage fixed, navigation ‹/›, outside tap/Escape, stage boundary, small segments.
5. Rapid swipe/reverse direction and touchcancel; no lingering highlight.
6. Four v9 error/empty states and the six v8 comparisons unaffected.
7. JavaScript event-flow and markup assertions before updating; no browser/Pixel PASS claimed.

**Notion Sync: Required NO** — transient Prototype-only bugfix, no canonical change. **AI Usage: Unverified — usage telemetry unavailable.**

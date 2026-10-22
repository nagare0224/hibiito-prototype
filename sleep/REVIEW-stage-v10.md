# Sleep Stage gestures v10 — Visual-only experiment

## Source / status
- Prototype preview baseline `2fd7e07d91064cd6c0f378596c2fad9ca4682af7`. Human requested: no 7/30/90 range switch in Sleep; personal recent-average comparison covers current need. Preserve day navigation as a separate consideration.
- Human asked for a Steps-like small anchored stage detail, press-and-drag interval preview, and no thick black focus border.
- This conflicts with historical `docs/decision-log.md` 2026-09-11 Sleep **trend 7/30/90**. This remains **pre-DoR proposed change**, not a product main canonical decision until Human-reviewed docs PR merges. No Android implementation.
- Keep all dummy data, chart shapes, v8 C comparison, v9 missing/loading/unsupported/error, Day/Night assets unchanged. Do not put private screenshots into this public repository.

## Interaction candidate
- Tap / keyboard Enter/Space: fixed callout anchored near segment, stage label, time interval, duration, Previous/Next buttons; highlight only a light 1.6px contour. Click outside/Escape closes.
- Long hold ~330ms then move horizontally: live transient preview follows x-axis intervals, not merely the exact narrow rectangle; release/cancel removes transient preview. Existing fixed selection can remain behind and returns after drag.
- Pointer moved >12px before hold: don't hijack scrolling. Graph SVG touch-action pan-y to keep vertical scroll.
- Segment boundary mapping uses original synthetic elapsed durations: x fraction → intervals, no interpolated stages or new sample.
- Popover clamps horizontally to component bounds and tries above then below. This is web prototype; Pixel Human interaction and actual Compose UX evidence are PENDING.
- Do not add period selector. Date arrows remain **unimplemented prototype demo controls** rather than pretend multi-day sample.

## Test design / verification
- 20 interval items with dataset.start, minutes; 4 stage types, remain genuine SVG; 6 compare keys & all v9 states unchanged.
- Keyboard focus uses light stroke, no 4px dark ring. Hit/focus accessibility in real Compose needs independent verification.
- Tap fixed, stage prev/next, transient long-hold + lateral movement, release/cancel restore, outside tap/Escape, return from missing, Day/Night, edge clipping, insets, scroll conflict on Pixel.
- No live browser test or Android PASS claimed.
- Notion Sync: Required NO for public prototype-only visual trial; product spec decision in Draft PR requires reassessment.

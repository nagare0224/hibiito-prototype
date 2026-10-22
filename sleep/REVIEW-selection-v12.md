# Sleep Stage focus/selection v12 — Visual-only polish

## Human findings
- Pixel 11 v11: 「スライドいい感じに遷移しました！」— mobile Stage scrub transition **observed working** for the user; this does not certify all gesture cases.
- Screenshot: thick dark outline around selected light Stage segment despite v10 attempting 1.6px teal SVG stroke.
- Source finding: `shared/prototype.css` defines a dark 4px `.stage-segment:focus-visible` and the rect is `tabindex=0`; v10 only removed outline for `:focus-visible`, not `:focus`/`:active`. Browser-native focus/tap styling remains a likely contributor. Exact Pixel computed CSS unavailable; avoid claiming confirmed root cause.

## Small bounded change
- CSS-only v12 cascade layer **after** v10; no changes to Stage interval data, v11 touch/Pointer handlers, v8 comparison sheet, backgrounds, or component hierarchy.
- Clear browser focus outline on Stage rect for `:focus`, `:focus-visible`, and `:active`, and suppress Android touch highlight. Preserve distinct quiet keyboard focus (teal stroke + faint glow).
- Fixed selection Day sea-glass outline 1.1 SVG units with subtle mint bloom; preview lighter 1.2 units. Night uses brighter cyan-mint for visibility against deep blue.
- Selection is always detectable by stroke in addition to popover state; no bold black frame.

## Verification plan and gates
- CSS source checks: specific selectors override v7/v10 and legacy UA states for Day/Night, no new conflicting Stage JS selectors, touch JS file unchanged.
- Human Pixel: Day/Night tap to fixed, long-hold drag with preview, keyboard focus if applicable, outside dismissal, vertical scroll, narrow segments, 6 compare sheet cases unaffected.
- Static CSS and Pages deployment do **not** constitute real-device visual PASS.
- Noncanonical dummy-only Prototype; P1-027 Android implementation and product main are untouched.
- Notion Sync: Required NO — prototype-only focus-frame cosmetic fix.
- AI Usage: Unverified — usage telemetry unavailable.

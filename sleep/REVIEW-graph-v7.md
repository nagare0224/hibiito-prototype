# Sleep graph v7 — Human review checkpoint

## Scope & provenance
- Only the noncanonical public dummy-data Prototype Hub has been changed. Product Source of Truth is `nagare0224/life-dashboard`.
- Canonical main `3e8fec70b2f85993874c6b5a0358a2469e9f168e`; checked `docs/chat-handoff.md`, `AGENTS.md`, `docs/development-automation.md`, `docs/development-automation-prompts.md`, `docs/tasks.md`, `docs/decision-log.md`; Migration State is ACTIVE. `specs/sleep/` is still absent.
- Baseline Prototype preview commit: `a3b3344107333c30469bbd6ec2a5a219e8954bdb`.
- No production main push, product specs, Android implementation, images, private information, assets, or credentials changed.

## Visual decision being trialed
- Human chose option 2, **softened discrete blocks**, not option 3's interpolated area/wave.
- Keep all 20 original stage segments, their order, widths, positions, transition points, accessibility descriptions, graph taps, and comparison sheet behavior unchanged.
- Append `sleep/visual-graph-v7.js` *after* `shared/prototype.js` to add four SVG gradients and change existing rectangles' radius from 3 to 5; original JS code remains untouched.
- Append `sleep/visual-graph-v7.css` after v6 styles for mild vertical top-to-bottom color shifts, subtle outlines and softer connectors. No glow-heavy, blurred, or fabricated transition states.
- Existing Hero, 4 icon cards, backgrounds, and note mascot are unchanged.

## Evidence / boundaries
- The stand-alone v7 enhancement code passed `node --check` and a local DOM-stub test for four gradients, eight stops, 20 rounded segments and idempotent rerun.
- Chromium display from both file URL and local HTTP was blocked by environment policy (ERR_BLOCKED_BY_ADMINISTRATOR); therefore **no local real-render/browser-interaction PASS** is claimed.
- Required Human verification: open GitHub Pages on Pixel; check Day/Night stage distinction, gradient softness, block borders and connectors, no apparent slopes/curves, scroll stability, individual stage taps, sheet opening/downward closing, long copy and alternative states. Visual PASS is PENDING.
- GitHub Pages result should be checked on exact deployed HEAD after publishing.

Notion Sync Required: NO — noncanonical visual experiment only; no product spec adoption. AI Usage: Unverified — usage telemetry unavailable.

# Sleep Compare C v8 — Visual Prototype review checkpoint

## Status and source of truth
- Noncanonical, public-safe, dummy-only Prototype Hub update. Not product implementation or DoR/Visual Contract approval.
- Product GitHub main: `3e8fec70b2f85993874c6b5a0358a2469e9f168e`, Migration State `ACTIVE`.
- Read `docs/chat-handoff.md`, `AGENTS.md`, `docs/development-automation.md`, `docs/development-automation-prompts.md`, `docs/tasks.md`, `docs/decision-log.md`. `specs/sleep/` remains absent.
- Baseline Preview: `7bb05bb5cb19522913230a4f9db3da4a29c48d40`.

## Changes
- Chosen Human visual direction: **C, soft chart-centered bottom sheet**, with gentler colors and less explanation than the original.
- Changes limited to the comparison sheet markup, a CSS layer, display-only comparison values/positions in existing `shared/prototype.js`, and Hub status.
- Keep the original dummy comparison data, all six keys (total, bedtime, wakeup, deep, rem, awake), sheet drag/dismiss and focus-return handlers, graph segments, Hero, images, and other screens unchanged.
- Small title and strong current value; subtle status pill; static gentle band and two markers (30-day average and current value); labeled lower/average/upper values; two understated stat cards; one-sentence comparison; brief demo/medical caution.
- **Meaning**: chart band denotes the supplied typical range only. Its curved filling is decoration **not a measured distribution**, and the dots are not movable controls. Time-of-day data uses minutes over midnight (`bedtime` 23:10–00:10 represented 1390–1450).
- Awake demo value 42 exceeds its usual range 15–35, so its marker appears right of the band and uses a neutral caution pill rather than 'within range'.

## Test design / evidence
- Check each of six compare keys for correct current/average/range, short axis labels, marker ordering including over-midnight and out-of-range; no data number changes.
- Test Day/Night, 320/360/390/411/430 CSS px, long copy, zero/missing/unsupported states and 6 comparison sheets.
- Verify dragging the handle down tracks the finger, resets on upward movement, and closes at threshold, with keyboard and backdrop close available; no close X.
- JavaScript mutation kept inside `openComparison` and mapping; interaction handlers outside unchanged.
- **Human Pixel test pending**. Do not mark a browser or visual PASS without live evidence.
- Notion Sync Required: NO; noncanonical prototype visual trial only, Source of Truth product GitHub main. AI Usage: Unverified — usage telemetry unavailable.

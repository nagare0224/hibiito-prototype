# Sleep v9 — Exception state visual candidate / Human verification

## Scope / Grounding
- Noncanonical public static prototype, dummy-only. Product Source of Truth `nagare0224/life-dashboard` unchanged.
- Product main `3e8fec70b2f85993874c6b5a0358a2469e9f168e`; migration `ACTIVE`.
- Canonical files read: `docs/chat-handoff.md`, `AGENTS.md`, `docs/development-automation.md`, `docs/development-automation-prompts.md`, `docs/tasks.md`, `docs/decision-log.md`; `specs/sleep/` not yet present.
- Prototype baseline: `637da4030b937af9a06672849b6015de0ee4a010`.
- Scope: add state design CSS, rework state-panel markup and prototype-only state controller, Hub label. No Hero/graph/card/sheet design or underlying dummy sleep intervals changed; no raw health information or new external assets.

## Human design direction
- Existing Day/Night background maintained.
- Reuse public-safe original watercolor-like SVGs (`sleep-icon-*-v6.svg`) in centered quiet cards.
- Visual hierarchy: small stage label → calm headline → one concise description → one muted secondary note.
- **Loading**: gentle nonflashing skeleton, never show guessed duration.
- **Missing**: clearly distinguish unavailable record from 0 minutes.
- **Unsupported**: explain detail availability without asserting actual device/vendor compatibility.
- **Error**: gentle explanation and functioning demo retry, explicitly disclosed. It transitions Loading → Normal *sample* after ~950 ms, not real network access.
- All five control states: Normal → Loading → Missing → Unsupported → Error → Normal. No production decision implied.

## Validation / remaining gates
- Programmatic source assertions: 5 states, uniqueness of IDs, no missing-as-zero, reduced-motion loading skeleton, retry timer cancelled on state switch; v8 comparison and sheet handlers preserved; external assets already exist.
- Required browser/Pixel checks: 320/360/390/411/430 CSS widths × Day/Night, typography & art, state cycle, reduced-motion, retry while state changes, graph taps, all comparison sheets, drag-down dismissal, scrolling.
- This text is **not evidence of browser/Pixel PASS**. Human Visual Verification is PENDING.
- Product `specs/sleep/` Visual Contract / acceptance / test design and DoR must be established later after Human approval.

Notion Sync: Required NO — no product requirement or durable design decision newly accepted; noncanonical prototype iteration only.
AI Usage: Unverified — usage telemetry unavailable.

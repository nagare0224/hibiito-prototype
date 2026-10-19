# Sleep calm v2 — Human確認用

## 範囲

P1-027の非canonical・dummy-only Visual Prototype更新。Dayは朝の湖と淡い空、Nightは光彩・街明かりを抑えた月夜の湖。Hero内にキャラクターなし。眠るマスコットはひとことカードだけに配置。数字・グラフ・カードの文字をlive textで維持し、主要interaction JSは変更していない。

## 開始時確認

- canonical main: `3e8fec70b2f85993874c6b5a0358a2469e9f168e`
- `docs/chat-handoff.md`、`AGENTS.md`、`docs/development-automation.md`、`docs/development-automation-prompts.md`、`docs/tasks.md`、`docs/decision-log.md`のP1-027 / prototype境界を確認。
- Migration State: ACTIVE。`specs/sleep/` はlatest mainに未作成。製品実装DoRとは分けて今回のprototypeだけを更新。
- prototype preview base: `c3078cccd9227ef5cb2e204bdbf3fe252c888148`。clean checkout、HEADとorigin/previewのmerge-base一致。
- `sleep/index.html`、`shared/prototype.css`、`shared/prototype.js`、既存Sleep SVG、Hub `index.html`、README公開方針を確認。prototype側AGENTS.mdはなし。

## 変更ファイル

- `sleep/index.html`: 新素材・局所stylesheet・バージョンを参照。
- `sleep/visual-calm.css`: 円形Hero、Day/Night色、読みやすい文字サイズ、カード・ひとことの余白。320px時の装飾はみ出し修正。
- `index.html`: HubのステータスをHuman確認待ちへ。
- `assets/sleep-hero-day-morning-v2.webp`
- `assets/sleep-hero-night-lake-v2.webp`
- `assets/sleep-note-mascot-resting-v2.webp`
- `assets/sleep-calm-v2-manifest.json`: 生成由来・指示要約・SHA-256。
- `assets/SLEEP-ASSETS.md`: 再利用時の役割。
- `sleep/REVIEW.md`: 本記録。

## 確認結果

- `node --check shared/prototype.js`: PASS。
- `git diff --check`: PASS。
- Chromium / Playwright smoke: 320 / 360 / 390 / 430 CSS px × Day/Night、通常・長文で横overflowとfit checks PASS。
- Hero画像読み込み、テーマ切替、Normal / Missing / Loading / Unsupported切替、6種類の比較sheet、Escape閉じ、下スワイプ閉じ、グラフ帯タップ: PASS。JS pageerrorなし。
- 指定フォントがこの実行環境の外部Google Fontsから取得できなかったため、同じKiwi Maru / Zen Maru Gothicのfontsource版を検証用HTTP経由で読み込んで再検証。productionは既存のGoogle Fonts指定とsystem fallbackを維持。検証用依存はrepoへ追加しない。
- 390px Day/Nightの描画を目視確認。Nightの月が円で切れない構図へ調整。ひとこと画像のalpha保持を確認。
- 私的スクリーンショット、実health data、認証情報、productコードは追加なし。埋め込み画像は今回新規生成したoriginal候補のみ。既存garden SVGを補助装飾に継続利用。

## Human確認

スマホでDay/Nightの穏やかさ、数字・グラフの読みやすさ、ひとことのキャラクターサイズ、長文時の密度を確認してください。Pixel実機・Android Composeの品質確認は今回の対象外。

## Notion Sync

- Required: NO
- Reason: 非canonical prototypeの視覚調整であり、製品仕様・採用技術・phase・運用ルールの新規確定なし。
- Target / Summary: 該当なし。
- Source of Truth: product canonicalはGitHub。今回のvisual候補はこのpreview履歴。

Usage: Unverified — usage telemetry unavailable。sub-agent使用なし。

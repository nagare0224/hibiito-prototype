# Sleep Visual Asset v3 — 組み込み・確認記録

## 範囲と開始時確認

- 添付ZIPの `WORK_HANDOFF.md`、`QA.md`、manifest、CSS、apply scriptを確認。同梱apply scriptを変更せず実行。
- canonical latest main: `3e8fec70b2f85993874c6b5a0358a2469e9f168e`。指定6ファイルとP1-027/Sleep関連記述を再取得。Migration State ACTIVE、`specs/sleep/`未作成。
- prototype preview baseline: `cb92522f51d5f701f11c49c0058b3b2149890348`。local HEAD / origin/preview / merge-base一致、staged / unstaged / untrackedなし。
- dummy-only / 非canonicalのprototype画像組み込みのみ。product repositoryやmainの変更なし。shared JS/CSSと旧素材を保持。

## 素材と調整

- 同梱10 WebPをそのまま配置。全SHA-256がbundle manifestと一致。再生成・再圧縮なし。
- ページ全体背景 Day/Night、円形Hero Day/Night、4カード挿絵、ひとことの双葉見出し・眠るマスコットを組み込み。
- 背景素材のNight月は下寄せcropで画面外にし、Heroの主月と重複させない。カード内の月の挿絵は独立した指標アイコンとして維持。
- 実フォント390pxで時間表示が4–5px内容幅を超えたため、381–400pxのみカード挿絵幅と左余白を6px調整。
- Heroの月が円で切れないようNight画像slotだけ110% / left -10%へ調整。元画像byteは不変。

## 検証

- `node --check shared/prototype.js`: PASS。
- `git diff --check`: PASS。
- Chromium / PlaywrightでCSS幅320 / 360 / 390 / 411 / 430 × Day/Nightを確認。
- 各幅・テーマで通常、Long copy、Missing、Loading、Unsupportedを確認。fit checksと横スクロールなし、カード時間・hint内容幅を確認。
- 各幅・テーマで比較sheet6種の表示とEscape閉じを確認。グラフ帯タップ、下スワイプ閉じ、テーマ切替もPASS。JS pageerrorなし。
- ローカルHTTPで同梱10素材のHTTP 200、decode、CSS背景参照を確認。mascot / sproutのalphaを保持。
- Google Fonts配信をこの確認環境で利用できないため、QAブラウザーでは既存と同じKiwi Maru / Zen Maru Gothicのfontsource版をlocal HTTP経由で読み込み、実フォントで検証。検証用依存はrepoに追加していない。
- Day/Nightの411px全画面、320pxの描画を目視確認。live textとカード絵の重なり、Heroの月のclip、背景の二重月なしを確認。
- 411px screenshotは `review-art3/day-411.webp` / `night-411.webp`。実HTML/CSS/JSをrenderした画像で、synthetic fixtureではない。全画面キャプチャではfixed背景は先頭viewportの範囲に描画される。実ページではスクロール中も背景が固定表示される。

## Human確認

窓辺の背景、カード挿絵、ひとことの双葉とマスコット、Nightの穏やかさ、スマホ実機での文字サイズ・操作感を確認してください。最終Human Visual Verificationは未実施。production Visual Contract確定やAndroid本実装許可にはしない。

## Notion / Usage

Notion Sync Required: NO — 非canonical prototype更新のみ。GitHubがproductのSource of Truth。
Usage: Unverified — usage telemetry unavailable。sub-agent使用なし。

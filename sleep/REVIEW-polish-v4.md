# Sleep Visual Prototype v4 — Human確認用

## Scope / Source of Truth
- 対象: P1-027 Sleepの**非canonical / dummy-only** Visual Prototypeのみ。
- product repo `nagare0224/life-dashboard` 最新main確認: `3e8fec70b2f85993874c6b5a0358a2469e9f168e`、Migration State: `ACTIVE`。
- `docs/chat-handoff.md` / `AGENTS.md` / `docs/development-automation.md` / `docs/development-automation-prompts.md` / `docs/tasks.md` / `docs/decision-log.md`を確認。製品版Sleepの`specs/sleep/`は未作成。
- prototype開始時preview SHA: `f3472c0b68d2b7067b577bcec91e966222f97a37`。今回はpreviewへの直接更新が許可された軽量経路で実施し、product mainには変更なし。

## v4変更
- `sleep/visual-polish-v4.css`: v3 CSSの末尾へレイヤーとして追加。
- `sleep/index.html`: 上記CSSリンクとバージョン更新のみ。
- `index.html`: Hubのステータス更新。
- データ入りUI・SVG睡眠グラフ・比較sheet / 下スワイプを提供する共有JavaScriptは一切変更しない。
- 画像はv3の10点をそのまま再利用し、再生成・再圧縮・転載なし。

### 見た目の調整
1. 背景を`position:fixed`からdocument内`position:absolute`へ。スマホの動的viewport変更での固定背景の視覚的ジャンプを避け、コンテンツに合わせて自然にスクロールさせる。
2. カード左の縦長風景挿絵を、同一画像を使った小さな角丸正方形アイコン（標準52px）へ。時間と比較リンクを圧迫しない余白。
3. 睡眠段階ラベル/時刻/凡例をやや拡大し、ガイド線とカード面のコントラストを整理。
4. 「ひとこと」のマスコット表示枠を縮めて文章領域を拡張。文言・双葉アイコンは維持。
5. Day下部の風景画像の主張を抑え、Nightは二重月と画面端の輝度を避けて、静かな背景へフェード。

## 実施した検証
- CSS/HTML簡易fixture + 同一v3 WebPをChromium/Playwrightで320/360/390/411/430 CSS px × Day/Night = 10条件。
- 各条件で横スクロールなし、正方形画像、時間・比較ラベルがカード外にはみ出さない、背景画像読込、および400pxスクロール後の背景レイヤー座標追従を確認: **PASS（fixture静的描画）**。
- v3共有JavaScriptは未変更。v3時点の実HTML / JS比較sheet 6種類・テーマ切替・スワイプのPASS記録は`sleep/REVIEW-art3.md`を参照。**本変更後の実ページ操作について再実行未確認**。
- このfixtureは本番HTMLと共通の全CSS / JSを再現したものではない。公開GitHub PagesデプロイとPixel実機の動作は別に確認すること。

## Human Visual Verification (PENDING)
- PixelでDay/Nightを切替え、上下スクロール中の背景が**突然ジャンプしない**こと。
- 各4カードのイラストが正方形で、時間・「比較を見る」が読みやすいこと。
- 長文モード・比較sheet・グラフタップ・下スワイプ操作が従来どおりであること。
- Day/Nightのグラフ文字が読みやすく、Nightが寝る前に穏やかなこと。
- いずれかFAILならvisual方向を再評価してから次の更新へ。Human承認までVisual Contract/Android本実装は進めない。

## Notion Sync / AI usage
- Required: NO — 非canonical prototypeの視覚調整のみ。Source of Truthはproduct GitHub main。
- Usage: Unverified — usage telemetry unavailable。

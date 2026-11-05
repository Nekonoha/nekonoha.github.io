# 針の筵

ネコノハの音楽・ゲーム・イラストのサイト。Nuxt 3 / GitHub Pages。

## 開発

```powershell
cd frontend
npm ci
npm run dev
```

## 音楽の自動更新

TuneCore の公開アーティストページから、公開済みの作品名・英語名・配信日・ジャケット・LinkCore URL を取得します。Spotify のアルバムが取得できた場合は試聴ボタンも表示します。API キーは不要です。

- `main` への push、手動実行、**毎日午前8時半ごろ（日本時間）**に更新・ビルド・GitHub Pages へのデプロイを実行します。
- GitHub Actions の実行時刻には遅延が発生することがあります。スケジュールは既定ブランチにこの変更が入ってから有効です。
- 手動更新: `cd frontend; npm run sync:releases`
- データ: `frontend/data/releases.json`
- ジャケット: `frontend/public/images/releases/`
- 検証: `cd frontend; npm test`

取得処理は TuneCore ページ内の構造化データを検証し、重複を除外して配信日の新しい順に並べます。未来の配信日は掲載しません。画像URLには有効期限があるため、画像をサイト側に保存します。

取得や検証に失敗した場合は JSON を更新しません。失敗したときの公開の扱いは、下の「取り込みに失敗したとき」を参照してください。TuneCore 側のページ構造が変わった際には `scripts/sync-releases.mjs` を調整してください。GitHub の仕様により、公開リポジトリで60日間活動がないと定期実行が無効になる場合があります。その場合は Actions 画面で再有効化します。

定期実行で取得したデータはその回の公開成果物に含まれ、リポジトリへの自動コミットは行いません。ローカルで最新データを見る場合は手動更新してください。

## イラストと頒布物の自動更新

音楽と同じタイミング（push、手動実行、毎日午前8時半ごろ）で、次の2つも取り込みます。どちらも API キーは不要です。

- pixiv：公開中の一般向けイラストの新しい6点。データは `frontend/data/illustrations.json`、画像は `frontend/public/images/illustrations/`。手動更新は `npm run sync:illustrations`。
- BOOTH（ショップ「みかん箱」）：公開中の一般向け商品の新しい6点。売り切れ・販売終了の商品は印を付けて表示します。データは `frontend/data/booth.json`、画像は `frontend/public/images/booth/`。手動更新は `npm run sync:booth`。

商品が0件のあいだは、トップと作品ページの「頒布物」は表示されません。前回は商品があったのに急に0件になった場合は、ページの形が変わったとみなして更新しません。

## トップの「最新の更新」と「新着」

トップの右側には、音楽・ショップ・イラスト・小説のうち、いちばん新しい更新を1件大きく出します。その下の「新着」には、残りのジャンルの最新を1件ずつ、新しい順に並べます。

- 音楽：配信日（TuneCore）
- ショップ：商品の公開日時（BOOTH の商品ページから取得）
- イラスト：投稿日時（pixiv）
- 小説：いちばん新しい話のファイルをコミットした日時

日付が取れなかったものは出しません。小説の日付を正しく読むため、Actions では履歴をすべて取得しています（`fetch-depth: 0`）。

## 取り込みに失敗したとき

TuneCore・pixiv・BOOTH のどれかの取り込みに失敗しても、残りの取り込みは続けます。失敗したものは、リポジトリに前回コミットしたデータのままになります。

- 定期実行（毎日午前8時半ごろ）: 古いデータで公開中のサイトを上書きしないよう、その回は公開しません。翌日の実行で取り込めれば元に戻ります。
- push と手動実行: 自分で入れた変更を止めないよう、公開は続けます。失敗した分だけ、前回コミットしたデータで公開されます。
- どちらの場合も実行は「失敗」として終わり、GitHub から通知が届きます。実行画面の最後の report ジョブに、どの取り込みが失敗したかが出ます。

pixiv などが一時的に GitHub のサーバーからの取得を断ることがあります。1回だけの失敗なら、実行画面の「Re-run jobs」でやり直すか、翌日の定期実行を待てば十分です。何日も続く場合は、取り込みのスクリプト（`frontend/scripts/`）の見直しが必要です。

## 小説

`frontend/content/novels/` に作品フォルダを置くと、ビルド時に一覧・目次・各話のページが作られます。

```
frontend/content/novels/
  my-story/                 ← URL になるので半角英数字で（/novels/my-story）
    novel.json              ← { "title": "作品名", "description": "あらすじ" }
    001 第1話 はじまり.txt   ← 先頭の数字が順番、その後ろが話のタイトル
    002 第2話 つづき.txt
```

- 本文はカクヨム記法のまま置けます（`｜漢字《かんじ》`、`漢字《かんじ》`、`《《傍点》》`、`｜《` で《をそのまま表示）。文字コードは UTF-8。
- `novel.json` に `"chapters": [{ "from": 1, "title": "第一章　…" }, { "from": 22, "title": "第二章　…" }]` を入れると、目次が章ごとに分かれて見出しが出ます。`from` は、その章が始まる話の番号（ファイル名の先頭の数字）です。入れなければ、今までどおり一つの一覧です。
- `novel.json` に `"draft": true` を入れると、`npm run dev` では見えますが公開サイトには出ません。書きかけの作品に使えます。
- `guide` フォルダは、ビューワーの操作を説明する案内です。いまは `"draft": true` で非公開にしています（`npm run dev` では見えます）。不要なら、フォルダごと削除してください。
- トップの「最新の更新」と「新着」には、作品ごとにいちばん新しい話が、そのファイルをコミットした日時で出ます（git の記録から読みます）。`novel.json` に `"updates": false` を入れた作品は出ません（`guide` はこの設定）。
- 公開中の作品が1つ以上あると、トップと作品ページに「小説」の一覧が出ます。
- 記法の変換は `frontend/utils/kakuyomu.mjs`、検証は `npm test`。

## 公開用ビルド

```powershell
cd frontend
npm run sync:releases
npm test
npm run generate
```

生成物は `frontend/.output/public/`。トップ、作品一覧、プロフィール、2つのゲーム詳細を静的生成します。`build-all.ps1` でも実行できます。

## 新デザイン（redesign/）

公開しているサイトは `redesign/` の新デザインです（Actions が `node redesign/build.mjs` で書き出して公開）。手元では `node redesign/serve.mjs` で http://localhost:5180 に開きます（npm の準備は不要）。
`frontend/` の Nuxt のサイトは、データの取り込み（`frontend/scripts/`・`frontend/data/`）と小説の置き場（`frontend/content/novels/`）として使い続けています。前のサイトに戻すときは、`deploy.yml` の `SITE` を `nuxt` にします。くわしくは `redesign/README.md`。

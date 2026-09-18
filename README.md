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

- `main` への push、手動実行、**毎日午前9時（日本時間）**に更新・ビルド・GitHub Pages へのデプロイを実行します。
- GitHub Actions の実行時刻には遅延が発生することがあります。スケジュールは既定ブランチにこの変更が入ってから有効です。
- 手動更新: `cd frontend; npm run sync:releases`
- データ: `frontend/data/releases.json`
- ジャケット: `frontend/public/images/releases/`
- 検証: `cd frontend; npm test`

取得処理は TuneCore ページ内の構造化データを検証し、重複を除外して配信日の新しい順に並べます。未来の配信日は掲載しません。画像URLには有効期限があるため、画像をサイト側に保存します。

取得や検証に失敗した場合は JSON を更新せず、Actions を失敗として終了します。公開中のサイトはそのまま残ります。Actions の失敗通知を確認し、TuneCore 側のページ構造が変わった際には `scripts/sync-releases.mjs` を調整してください。GitHub の仕様により、公開リポジトリで60日間活動がないと定期実行が無効になる場合があります。その場合は Actions 画面で再有効化します。

定期実行で取得したデータはその回の公開成果物に含まれ、リポジトリへの自動コミットは行いません。ローカルで最新データを見る場合は手動更新してください。

## 公開用ビルド

```powershell
cd frontend
npm run sync:releases
npm test
npm run generate
```

生成物は `frontend/.output/public/`。トップ、作品一覧、プロフィール、2つのゲーム詳細を静的生成します。`build-all.ps1` でも実行できます。

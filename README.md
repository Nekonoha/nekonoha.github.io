# 針の筵

Nuxt製のポートフォリオサイトです。`main` ブランチへのプッシュ時に、GitHub ActionsからGitHub Pagesへ自動デプロイされます。

## プロジェクト構成

- `frontend/`: ポートフォリオサイト本体
- `.github/workflows/deploy.yml`: GitHub Pagesのデプロイ設定
- `build-all.ps1`: ローカル静的ビルド用スクリプト

## ローカル開発

```powershell
cd frontend
npm install
npm run dev
```

## 静的ビルド

リポジトリルートで次を実行します。

```powershell
.\build-all.ps1
```

生成物は `frontend/dist/` に出力されます。

## 技術スタック

- Nuxt 3
- TypeScript
- Scoped CSS
- GitHub Actions / GitHub Pages

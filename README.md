# 針の筵 - GitHub Pages デプロイ手順

## 概要
このプロジェクトはNuxt.js製のポートフォリオサイトで、GitHub Pagesで自動公開されます。
auto-battlerプロジェクトをサブモジュールとして含み、一緒にデプロイされます。

## プロジェクト構成
- **frontend/**: メインポートフォリオサイト
- **auto-battler/**: テキストベース・オートバトラー (サブモジュール)

## GitHub Pagesでの公開手順

### 1. GitHubリポジトリの設定
1. このプロジェクトをGitHubリポジトリにプッシュ
2. リポジトリの「Settings」→「Pages」に移動
3. Source を「GitHub Actions」に設定

### 2. 自動デプロイ
- `main` ブランチにプッシュすると自動的にビルド・デプロイされます
- GitHub Actions ワークフローが実行され、静的サイトが生成されます
- frontendとauto-battlerの両方がビルドされ、統合されます

### 3. アクセスURL
デプロイ後は以下のURLでアクセス可能です：
```
https://[ユーザー名].github.io/           # メインサイト
https://[ユーザー名].github.io/auto-battler/  # Auto Battler
```

## ローカル開発

### 開発サーバー起動（frontend）
```bash
cd frontend
npm install
npm run dev
```

### 開発サーバー起動（auto-battler）
```bash
cd auto-battler
npm install
npm run dev
```

### 統合ビルド（両方をビルドしてテスト）
```powershell
# PowerShellスクリプトを実行
.\build-all.ps1

# または手動で：
cd frontend
npm run generate

cd ../auto-battler
$env:NUXT_APP_BASE_URL="/auto-battler/"
npm run generate

cd ..
mkdir -p frontend/dist/auto-battler
cp -r auto-battler/.output/public/* frontend/dist/auto-battler/

# プレビュー
cd frontend/dist
npx serve
```

## 主な機能
- **インタラクティブな背景アニメーション**: マウス操作に反応する動的な背景
- **多言語対応**: 日本語・英語対応
- **レスポンシブデザイン**: PC・スマートフォン対応
- **ライトボックス機能**: スクリーンショット画像の拡大表示
- **不気味な背景エフェクト**: ゲームページ専用の特別な背景アニメーション

## 技術スタック
- **フレームワーク**: Nuxt 3.20.2
- **言語**: TypeScript
- **スタイリング**: Scoped CSS
- **フォント**: Google Fonts (Inter, Orbitron, Noto Sans JP)
- **デプロイ**: GitHub Actions + GitHub Pages

## ファイル構成
```
frontend/
├── components/          # Vueコンポーネント
│   ├── BackgroundAnimation.vue    # メイン背景アニメーション
│   ├── EerieBackground.vue        # ゲーム用背景アニメーション
│   ├── Header.vue                 # ヘッダー
│   └── Footer.vue                 # フッター
├── pages/              # ページコンポーネント
│   ├── index.vue       # トップページ
│   ├── about.vue       # アバウトページ
│   ├── product.vue     # 作品一覧
│   ├── link.vue        # リンク集
│   ├── trial.vue       # TRIALゲーム詳細
│   └── unrequited.vue  # UnRequitedゲーム詳細
├── layouts/            # レイアウト
├── composables/        # 共通ロジック
└── locales/           # 多言語翻訳ファイル
```

## 更新履歴
- 2026/01/03: auto-battlerをサブモジュールとして統合
- 2025/12/28: GitHub Pages対応、ライトボックス機能追加
- 2025/12/28: 不気味背景アニメーション実装
- 2025/12/28: 多言語対応、レスポンシブデザイン実装
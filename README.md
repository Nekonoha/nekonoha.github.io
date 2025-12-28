# 針の筵 - GitHub Pages デプロイ手順

## 概要
このプロジェクトはNuxt.js製のポートフォリオサイトで、GitHub Pagesで自動公開されます。

## GitHub Pagesでの公開手順

### 1. GitHubリポジトリの設定
1. このプロジェクトをGitHubリポジトリにプッシュ
2. リポジトリの「Settings」→「Pages」に移動
3. Source を「GitHub Actions」に設定

### 2. 自動デプロイ
- `main` ブランチにプッシュすると自動的にビルド・デプロイされます
- GitHub Actions ワークフローが実行され、静的サイトが生成されます

### 3. アクセスURL
デプロイ後は以下のURLでアクセス可能です：
```
https://[ユーザー名].github.io/nekonoha-web/
```

## リポジトリ名の推奨設定
URLをより美しくするため、以下のいずれかの方法をお勧めします：

### 方法1: リポジトリ名を変更
- リポジトリ名を `nekonoha-web` に変更
- URL: `https://[ユーザー名].github.io/nekonoha-web/`

### 方法2: ユーザーページとして公開
- リポジトリ名を `[ユーザー名].github.io` に変更
- URL: `https://[ユーザー名].github.io/` （最もシンプル）
- この場合、`nuxt.config.ts` の `baseURL` を `'/'` に変更

## ローカル開発

### 開発サーバー起動
```bash
cd frontend
npm install
npm run dev
```

### 静的サイト生成（本番用）
```bash
cd frontend
npm run generate
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
- 2025/12/28: GitHub Pages対応、ライトボックス機能追加
- 2025/12/28: 不気味背景アニメーション実装
- 2025/12/28: 多言語対応、レスポンシブデザイン実装
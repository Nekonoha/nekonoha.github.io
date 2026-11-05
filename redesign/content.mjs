// サイトの中で、自動では取り込まない固定の内容（ゲームの説明・プロフィール・リンク）。
// いまのサイト（frontend/composables/useLocale.ts、pages/about.vue、components/ExternalLinks.vue）と同じ内容。
// 言語で変わる文は { ja, en } の形で書く。

const yumeNikki = { ja: 'ゆめにっきの二次創作ゲームです。', en: 'A fan game based on Yume Nikki.' }

export const games = [
  {
    slug: 'trial',
    title: 'TRIAL',
    description: yumeNikki,
    cover: '/images/trial/5.png',
    background: '/images/trial/back.png',
    screenshots: [1, 2, 3, 4, 5, 6].map(n => `/images/trial/${n}.png`),
    facts: [
      { label: { ja: '実装エフェクト数', en: 'Effects' }, value: '22 / 28' },
      { label: { ja: 'ED', en: 'Endings' }, value: '6 / 8' }
    ],
    howToPlay: [
      { ja: '夢の中を歩き回るゲームです。', en: 'This is a game where you walk around in a dream.' },
      { ja: 'ベッドを調べると夢に入ることが出来ます。', en: 'You can enter the dream by examining the bed.' },
      { ja: 'セーブは机のパソコンから。', en: 'You can save from the computer on the desk.' },
      { ja: '夢の中で特定のオブジェクトを調べることで、落し物（エフェクト）を入手することができます。', en: 'You can get items (effects) by examining specific objects in the dream.' }
    ],
    controls: [
      [{ ja: '移動', en: 'Move' }, { ja: '方向キー、またはテンキー', en: 'Arrow Keys or Numpad' }],
      [{ ja: '決定', en: 'Decide' }, { ja: 'Zキー、スペースキー、またはエンターキー', en: 'Z Key, Space Key, or Enter Key' }],
      [{ ja: 'キャンセル、メニュー', en: 'Cancel, Menu' }, { ja: 'Xキー、またはEscキー', en: 'X Key or Esc Key' }],
      [{ ja: 'お気に入りエフェクト', en: 'Favorite Effect' }, { ja: 'サブキー（Cキー、Shiftキー）', en: 'Sub Key (C Key, Shift Key)' }],
      [{ ja: 'エフェクト動作', en: 'Effect Action' }, { ja: 'Aキー', en: 'A Key' }],
      [{ ja: 'エフェクト解除', en: 'Release Effect' }, { ja: 'Sキー、またはエフェクトを再選択', en: 'S Key, or re-select effect' }],
      [{ ja: 'エフェクト廃棄', en: 'Discard Effect' }, { ja: '扉部屋でDキー', en: 'D Key in the door room' }]
    ],
    // lang: その言語で表示しているとき、いちばん目立つボタンにする版
    downloads: [
      { label: 'ver.0.8.0a', note: { ja: '最新版', en: 'Latest' }, url: 'https://www1.axfc.net/u/3511483' }
    ]
  },
  {
    slug: 'unrequited',
    title: 'UnRequited',
    description: yumeNikki,
    cover: '/images/unrequited/3.png',
    background: '/images/unrequited/back.png',
    screenshots: [1, 2, 3, 4].map(n => `/images/unrequited/${n}.png`),
    facts: [
      { label: { ja: '実装エフェクト数', en: 'Effects' }, value: '14 / 18' }
    ],
    howToPlay: [
      { ja: '夢の中を歩き回るゲームです。', en: 'This is a game where you walk around in a dream.' },
      { ja: 'ベッドを調べると夢に入ることが出来ます。', en: 'You can enter the dream by examining the bed.' },
      { ja: 'セーブは机のパソコンから。', en: 'You can save from the computer on the desk.' },
      { ja: '夢の中で特定のオブジェクトを調べることで、Scar（エフェクト）を入手することができます。', en: 'You can get Scars (effects) by examining specific objects in the dream.' }
    ],
    controls: [
      [{ ja: '移動', en: 'Move' }, { ja: '方向キー、またはテンキー', en: 'Arrow Keys or Numpad' }],
      [{ ja: '決定', en: 'Decide' }, { ja: 'Zキー、スペースキー、またはエンターキー', en: 'Z Key, Space Key, or Enter Key' }],
      [{ ja: 'キャンセル、メニュー', en: 'Cancel, Menu' }, { ja: 'Xキー、またはEscキー', en: 'X Key or Esc Key' }],
      [{ ja: 'お気に入りエフェクト', en: 'Favorite Effect' }, { ja: 'Fキー', en: 'F Key' }],
      [{ ja: 'エフェクト動作', en: 'Effect Action' }, { ja: 'サブキー（Cキー、Shiftキー）', en: 'Sub Key (C Key, Shift Key)' }],
      [{ ja: 'エフェクト解除', en: 'Release Effect' }, { ja: 'Aキー、またはエフェクトを再選択', en: 'A Key, or re-select effect' }],
      [{ ja: 'エフェクト廃棄', en: 'Discard Effect' }, { ja: '未実装', en: 'Not implemented' }]
    ],
    downloads: [
      { label: 'ver.0.0.6a', note: { ja: '日本語版・最新', en: 'Japanese · Latest' }, lang: 'ja', url: 'https://www1.axfc.net/u/3925394' },
      { label: 'ver.0.0.4b ENG', note: { ja: '英語版', en: 'English' }, lang: 'en', url: 'https://www1.axfc.net/u/3892973' }
    ]
  }
]

export const about = {
  name: { ja: 'ネコノハ', en: 'Nekonoha' },
  avatar: '/images/iconnn.png',
  bio: { ja: 'エンジニア。音楽、ゲーム、イラスト、3Dを制作。', en: 'Engineer. Music, games, illustration and 3D.' },
  facts: [
    { label: { ja: '音楽名義', en: 'Music' }, value: { ja: 'ネコノハヤシロ', en: 'NekonohaYashiro' }, url: 'https://www.tunecore.co.jp/artists/nekonoha' },
    { label: { ja: '好きなもの', en: 'Interests' }, value: { ja: 'フリーホラーゲーム、漫画、映画、DTM', en: 'Free horror games, manga, films, music production' } },
    { label: { ja: '連絡先', en: 'Contact' }, value: 'X / @tan_fantazma', url: 'https://twitter.com/tan_fantazma' }
  ]
}

export const links = [
  { name: 'TuneCore', note: { ja: '音楽・配信', en: 'Music / Releases' }, url: 'https://www.tunecore.co.jp/artists/nekonoha', icon: 'music' },
  { name: 'BOOTH', note: { ja: 'ショップ', en: 'Shop' }, url: 'https://tanfantazma.booth.pm/', icon: 'bag' },
  { name: 'pixiv', note: { ja: 'イラスト・漫画', en: 'Illustration / Manga' }, url: 'https://pixiv.me/tanfantazma', icon: 'brush' },
  { name: 'Blog', note: { ja: '日記・制作記録', en: 'Notes' }, url: 'https://nekonoha.hatenablog.com/', icon: 'pen' },
  { name: 'X', note: '@tan_fantazma', url: 'https://twitter.com/tan_fantazma', icon: 'x' }
]

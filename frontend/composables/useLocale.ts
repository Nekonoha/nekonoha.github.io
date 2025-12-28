import { ref, computed } from 'vue'

export type Locale = 'ja' | 'en'

const currentLocale = ref<Locale>('ja')

const translations = {
  ja: {
    header: { 
      top: 'TOP', 
      about: 'ABOUT', 
      works: 'WORKS'
    },
    index: { 
      title: '針の筵', 
      subtitle: '趣味で色々作ってるサイト', 
      about: 'ABOUT', 
      works: 'WORKS'
    },
    works: {
      title: 'WORKS',
      games: 'Fan Games',
      gamesDescription: 'ゆめにっきの二次創作ゲームを制作しています。',
      music: 'Music',
      musicDescription: 'SoundCloudで音楽を公開しています。',
      twitterDescription: '最新のツイートをチェックできます。',
      visitTwitter: 'Twitterで見る',
      visitSoundcloud: 'SoundCloudで聴く',
      shop: 'Shop',
      shopDescription: 'BOOTHで販売物を掲載しています。',
      social: 'Social',
      socialDescription: 'SNSやブログで活動しています。'
    },
    about: { 
      title: 'ABOUT', 
      intro: 'ネコノハです。', 
      description: 'エンジニア。趣味で絵とか3Dモデルとかゲームとか音楽とか作ってます。', 
      hobbies: '好きなもの・趣味', 
      hobby1: 'フリーホラーゲーム', 
      hobby2: '漫画・映画・ゲーム', 
      hobby3: 'イラスト', 
      hobby4: 'DTM', 
      contact: '連絡先', 
      twitter: 'Twitter: @tan_fantazma' 
    },
    product: { 
      title: 'PRODUCT', 
      games: 'Fan Games', 
      trial: 'TRIAL', 
      unrequited: 'UnRequited', 
      shop: '販売物など', 
      booth: 'Booth', 
      music: 'Music', 
      musicDescription: 'SoundCloudで音楽を公開しています。', 
      soundcloudLink: 'SoundCloudで聴く' 
    },
    link: { 
      title: 'LINK', 
      twitter: 'Twitter', 
      twitterDescription: '@tan_fantazma でツイートしています。', 
      blog: 'ブログ', 
      blogDescription: '日記や制作物についてのブログです。', 
      pixiv: 'pixiv', 
      pixivDescription: 'イラストや漫画を投稿しています。', 
      booth: 'Booth', 
      boothDescription: '販売物を掲載しています。' 
    },
    trial: { 
      title: 'TRIAL', 
      description: 'ゆめにっきの二次創作ゲームです。', 
      gameInfo: '作品情報',
      effectCount: '現在の実装エフェクト数は',
      effectTotal: '22/28個',
      edCount: 'EDは現在',
      edTotal: '6/8個',
      implemented: '実装されています',
      period: '。',
      howToPlay: '遊び方',
      gameplay1: '夢の中を歩き回るゲームです。',
      gameplay2: 'ベッドを調べると夢に入ることが出来ます。',
      gameplay3: 'セーブは机のパソコンから。',
      gameplay4: '夢の中で特定のオブジェクトを調べることで、落し物（エフェクト）を入手することができます。',
      controls: '操作方法', 
      move: '移動', 
      moveKey: '方向キー、またはテンキー', 
      decide: '決定', 
      decideKey: 'Zキー、スペースキー、またはエンターキー', 
      cancel: 'キャンセル、メニュー', 
      cancelKey: 'Xキー、またはEscキー', 
      favorite: 'お気に入りエフェクト', 
      favoriteKey: 'サブキー（Cキー、Shiftキー）', 
      action: 'エフェクト動作', 
      actionKey: 'Aキー', 
      release: 'エフェクト解除', 
      releaseKey: 'Sキー、またはエフェクトを再選択', 
      discard: 'エフェクト廃棄', 
      discardKey: '扉部屋でDキー', 
      screenshots: 'SS', 
      download: 'ダウンロード', 
      downloadText: '現在の最新バージョンは',
      version: '0.8.0 a',
      versionSuffix: 'となっております。',
      downloadLink: 'ダウンロードは下のリンクから。',
      downloadButton: 'ver.0.8.0a' 
    },
    unrequited: { 
      title: 'UnRequited', 
      description: 'ゆめにっきの二次創作ゲームです。', 
      gameInfo: '作品情報',
      effectCount: '現在の実装エフェクト数は',
      effectTotal: '14/18個',
      edCount: 'EDは現在',
      edTotal: '0/0個',
      implemented: '実装されています',
      period: '。',
      howToPlay: '遊び方',
      gameplay1: '夢の中を歩き回るゲームです。',
      gameplay2: 'ベッドを調べると夢に入ることが出来ます。',
      gameplay3: 'セーブは机のパソコンから。',
      gameplay4: '夢の中で特定のオブジェクトを調べることで、Scar（エフェクト）を入手することができます。',
      controls: '操作方法', 
      move: '移動', 
      moveKey: '方向キー、またはテンキー', 
      decide: '決定', 
      decideKey: 'Zキー、スペースキー、またはエンターキー', 
      cancel: 'キャンセル、メニュー', 
      cancelKey: 'Xキー、またはEscキー', 
      favorite: 'お気に入りエフェクト', 
      favoriteKey: 'Fキー', 
      action: 'エフェクト動作', 
      actionKey: 'サブキー（Cキー、Shiftキー）', 
      release: 'エフェクト解除', 
      releaseKey: 'Aキー、またはエフェクトを再選択', 
      discard: 'エフェクト廃棄', 
      discardKey: '未実装', 
      screenshots: 'SS', 
      download: 'ダウンロード', 
      downloadTextJp: '現在の最新バージョンは日本語版',
      downloadTextEn: '現在の最新バージョンは英語版',
      versionJp: '0.0.6 a',
      versionEn: '0.0.4 b ENG',
      versionSuffix: 'となっております。',
      downloadLink: 'ダウンロードは下のリンクから。',
      downloadButtonJp: 'ver.0.0.6a', 
      downloadButtonEn: 'ver.0.0.4b ENG',
      englishVersion: 'English version is here.' 
    },
    footer: { 
      copyright: '© 2011 Nekonoha. All rights reserved.' 
    },
    gallery: { 
      title: 'GALLERY', 
      twitter: 'Twitter', 
      pixiv: 'pixiv', 
      pixivDescription: 'イラストや漫画を投稿しています。', 
      visitPixiv: 'pixivで見る', 
      soundcloud: 'SoundCloud', 
      soundcloudDescription: '音楽を公開しています。' 
    }
  },
  en: {
    header: { 
      top: 'TOP', 
      about: 'ABOUT', 
      works: 'WORKS'
    },
    index: { 
      title: 'Hari no Mushiro', 
      subtitle: 'Personal hobby site for creative works', 
      about: 'ABOUT', 
      works: 'WORKS'
    },
    works: {
      title: 'WORKS',
      games: 'Fan Games',
      gamesDescription: 'Creating Yume Nikki fangames.',
      music: 'Music',
      musicDescription: 'Sharing my music on SoundCloud.',
      twitterDescription: 'Check out my latest tweets.',
      visitTwitter: 'Visit Twitter',
      visitSoundcloud: 'Listen on SoundCloud',
      shop: 'Shop',
      shopDescription: 'Products available on BOOTH.',
      social: 'Social',
      socialDescription: 'Follow me on social media and read my blog.'
    },
    about: { 
      title: 'ABOUT', 
      intro: 'I\'m Nekonoha.', 
      description: 'Engineer. I make illustrations, 3D models, games, and music as a hobby.', 
      hobbies: 'Likes & Hobbies', 
      hobby1: 'Free horror games', 
      hobby2: 'Manga, Movies & Games', 
      hobby3: 'Illustration', 
      hobby4: 'DTM', 
      contact: 'Contact', 
      twitter: 'Twitter: @tan_fantazma' 
    },
    product: { 
      title: 'PRODUCT', 
      games: 'Fan Games', 
      trial: 'TRIAL', 
      unrequited: 'UnRequited', 
      shop: 'Shop', 
      booth: 'Booth', 
      music: 'Music', 
      musicDescription: 'I share my music on SoundCloud.', 
      soundcloudLink: 'Listen on SoundCloud' 
    },
    link: { 
      title: 'LINK', 
      twitter: 'Twitter', 
      twitterDescription: 'Follow @tan_fantazma', 
      blog: 'Blog', 
      blogDescription: 'My diary and project blog.', 
      pixiv: 'pixiv', 
      pixivDescription: 'Illustrations and manga.', 
      booth: 'Booth', 
      boothDescription: 'Shop for my products.' 
    },
    trial: { 
      title: 'TRIAL', 
      description: 'A fan game based on Yume Nikki.', 
      gameInfo: 'Game Information',
      effectCount: 'Current effect count:',
      effectTotal: '22/28',
      edCount: 'ED count:',
      edTotal: '6/8',
      implemented: 'implemented',
      period: '.',
      howToPlay: 'How to Play',
      gameplay1: 'This is a game where you walk around in a dream.',
      gameplay2: 'You can enter the dream by examining the bed.',
      gameplay3: 'You can save from the computer on the desk.',
      gameplay4: 'You can get items (effects) by examining specific objects in the dream.',
      controls: 'Controls', 
      move: 'Move', 
      moveKey: 'Arrow Keys or Numpad', 
      decide: 'Decide', 
      decideKey: 'Z Key, Space Key, or Enter Key', 
      cancel: 'Cancel, Menu', 
      cancelKey: 'X Key or Esc Key', 
      favorite: 'Favorite Effect', 
      favoriteKey: 'Sub Key (C Key, Shift Key)', 
      action: 'Effect Action', 
      actionKey: 'A Key', 
      release: 'Release Effect', 
      releaseKey: 'S Key, or re-select effect', 
      discard: 'Discard Effect', 
      discardKey: 'D Key in the door room', 
      screenshots: 'SS', 
      download: 'Download', 
      downloadText: 'Current latest version is',
      version: '0.8.0 a',
      versionSuffix: '.',
      downloadLink: 'Download from the link below.',
      downloadButton: 'ver.0.8.0a' 
    },
    unrequited: { 
      title: 'UnRequited', 
      description: 'A fan game based on Yume Nikki.', 
      gameInfo: 'Game Information',
      effectCount: 'Current effect count:',
      effectTotal: '14/18',
      edCount: 'ED count:',
      edTotal: '0/0',
      implemented: 'implemented',
      period: '.',
      howToPlay: 'How to Play',
      gameplay1: 'This is a game where you walk around in a dream.',
      gameplay2: 'You can enter the dream by examining the bed.',
      gameplay3: 'You can save from the computer on the desk.',
      gameplay4: 'You can get Scars (effects) by examining specific objects in the dream.',
      controls: 'Controls', 
      move: 'Move', 
      moveKey: 'Arrow Keys or Numpad', 
      decide: 'Decide', 
      decideKey: 'Z Key, Space Key, or Enter Key', 
      cancel: 'Cancel, Menu', 
      cancelKey: 'X Key or Esc Key', 
      favorite: 'Favorite Effect', 
      favoriteKey: 'F Key', 
      action: 'Effect Action', 
      actionKey: 'Sub Key (C Key, Shift Key)', 
      release: 'Release Effect', 
      releaseKey: 'A Key, or re-select effect', 
      discard: 'Discard Effect', 
      discardKey: 'Not implemented', 
      screenshots: 'SS', 
      download: 'Download', 
      downloadTextJp: 'Current latest version (Japanese):',
      downloadTextEn: 'Current latest version (English):',
      versionJp: '0.0.6 a',
      versionEn: '0.0.4 b ENG',
      versionSuffix: '.',
      downloadLink: 'Download from the link below.',
      downloadButtonJp: 'ver.0.0.6a', 
      downloadButtonEn: 'ver.0.0.4b ENG',
      englishVersion: 'English version is here.' 
    },
    footer: { 
      copyright: '© 2011 Nekonoha. All rights reserved.' 
    },
    gallery: { 
      title: 'GALLERY', 
      twitter: 'Twitter', 
      pixiv: 'pixiv', 
      pixivDescription: 'My illustrations and manga.', 
      visitPixiv: 'Visit pixiv', 
      soundcloud: 'SoundCloud', 
      soundcloudDescription: 'Listen to my music.' 
    }
  }
}

export const useLocale = () => {
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[currentLocale.value]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  const setLocale = (locale: Locale) => {
    currentLocale.value = locale
  }

  const locale = computed(() => currentLocale.value)

  return {
    t,
    setLocale,
    locale
  }
}

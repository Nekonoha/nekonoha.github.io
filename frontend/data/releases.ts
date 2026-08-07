export type MusicRelease = {
  title: string
  titleEn: string
  releaseDate: string
  spotifyId: string
  spotifyIdEn?: string
  linkcoreUrl: string
}

// Add new releases here. The home page sorts this list and shows the newest three.
// When Spotify publishes the English catalog, set spotifyIdEn to switch embeds in EN mode.
export const musicReleases: MusicRelease[] = [
  {
    title: '存在しない冒険の記録 III～表裏一体の天狼',
    titleEn: 'Songs from an Unmade Adventure III: Sirius — Two Stars, One Name',
    releaseDate: '2026-08-07',
    spotifyId: '70rdt5W1Phs6cyd2j3UQK7',
    linkcoreUrl: 'https://linkco.re/HvTnsEXt'
  },
  {
    title: '存在しない冒険の記録Ⅱ～月下の散歩道',
    titleEn: 'Songs from an Unmade Adventure II: Moonlit Wanderings',
    releaseDate: '2026-08-06',
    spotifyId: '1uIj3WieryOUwdxML96FfH',
    linkcoreUrl: 'https://linkco.re/NrvA5bff'
  },
  {
    title: '存在しない冒険の記録',
    titleEn: 'Songs from an Unmade Adventure',
    releaseDate: '2026-08-06',
    spotifyId: '6EWAVWuJiQr5743OYIBbWo',
    linkcoreUrl: 'https://linkco.re/bB97NfME'
  }
]

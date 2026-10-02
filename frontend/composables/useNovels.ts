import { parseEpisodeFile, renderKakuyomu } from '~/utils/kakuyomu.mjs'

// content/novels/<作品フォルダ>/novel.json と NNN タイトル.txt をビルド時に読み込む。
export type NovelMeta = { title: string; description?: string; draft?: boolean }
export type NovelEpisode = { number: number; title: string; path: string }
export type Novel = NovelMeta & { slug: string; episodes: NovelEpisode[] }

const metaFiles = import.meta.glob('../content/novels/*/novel.json', { eager: true, import: 'default' }) as Record<string, NovelMeta>
// 本文は開いた話だけを読み込む。
const episodeLoaders = import.meta.glob('../content/novels/*/*.txt', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>

const novels: Novel[] = Object.entries(metaFiles)
  .map(([path, meta]) => {
    const folder = path.slice(0, path.lastIndexOf('/') + 1)
    const episodes = Object.keys(episodeLoaders)
      .filter(file => file.startsWith(folder))
      .map(file => {
        const parsed = parseEpisodeFile(file.slice(folder.length))
        return parsed ? { ...parsed, path: file } : null
      })
      .filter((episode): episode is NovelEpisode => episode !== null)
      .sort((a, b) => a.number - b.number)
    return { ...meta, slug: folder.split('/').at(-2) ?? '', episodes }
  })
  // draft: true の作品は開発中（npm run dev）だけ表示する。
  .filter(novel => novel.slug && novel.episodes.length > 0 && (!novel.draft || import.meta.dev))
  .sort((a, b) => a.title.localeCompare(b.title, 'ja'))

export const useNovels = () => ({
  novels,
  findNovel: (slug: string) => novels.find(novel => novel.slug === slug),
  loadEpisodeHtml: async (episode: NovelEpisode) => renderKakuyomu(await episodeLoaders[episode.path]())
})

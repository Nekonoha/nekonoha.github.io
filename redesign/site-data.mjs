// 新デザインが読むデータを、いまのサイトのファイルから組み立てる。
// ローカルのサーバー（serve.mjs）と、公開用の書き出し（build.mjs）の両方から使う。
//   - frontend/data/*.json          … Actions が毎日取り込む音楽・イラスト・BOOTH
//   - frontend/content/novels/       … 小説（カクヨム記法の .txt）
//   - content.mjs                    … ゲームの説明・プロフィール・リンク（手で書く固定の内容）
import { readFile, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const here = path.dirname(fileURLToPath(import.meta.url))
export const frontendDir = path.resolve(here, '../frontend')
export const publicDir = path.join(here, 'public')
export const imagesDir = path.join(frontendDir, 'public/images')
const novelsDir = path.join(frontendDir, 'content/novels')
const contentFile = path.join(here, 'content.mjs')

// content.mjs は、書き換えたらサーバーを起動し直さなくても反映されるよう、更新日時ごとに読み直す
async function loadContent () {
  const { mtimeMs } = await stat(contentFile)
  return import(`${pathToFileURL(contentFile).href}?v=${mtimeMs}`)
}

const { parseEpisodeFile, renderKakuyomu } = await import(pathToFileURL(path.join(frontendDir, 'utils/kakuyomu.mjs')).href)

const readJson = async (file, fallback) => {
  try { return JSON.parse(await readFile(file, 'utf8')) } catch { return fallback }
}

// 小説ごとに、いちばん新しい話のファイルをコミットした日時（いまのサイトと同じ考え方）。git がなければ空。
const novelUpdateDate = (slug, file) => {
  try {
    const run = (...args) => execFileSync('git', args, { cwd: novelsDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    if (run('rev-parse', '--is-shallow-repository') !== 'false') return null
    return run('log', '-1', '--diff-filter=A', '--format=%cI', '--', `${slug}/${file}`) || run('log', '-1', '--format=%cI', '--', `${slug}/${file}`) || null
  } catch { return null }
}

const episodeFiles = async dir => (await readdir(dir))
  .map(file => ({ file, episode: parseEpisodeFile(file) }))
  .filter(item => item.episode)
  .sort((a, b) => a.episode.number - b.episode.number)

// 公開する小説の一覧。novel.json に "draft": true がある作品は出さない。
export async function listNovels () {
  if (!existsSync(novelsDir)) return []
  const novels = []
  for (const entry of await readdir(novelsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const meta = await readJson(path.join(novelsDir, entry.name, 'novel.json'), null)
    if (!meta || meta.draft) continue
    const files = await episodeFiles(path.join(novelsDir, entry.name))
    if (!files.length) continue
    const newest = files[files.length - 1]
    const date = meta.updates === false ? null : novelUpdateDate(entry.name, newest.file)
    novels.push({
      slug: entry.name,
      title: meta.title,
      description: meta.description ?? '',
      chapters: Array.isArray(meta.chapters) ? meta.chapters : [],
      episodes: files.map(item => ({ number: item.episode.number, title: item.episode.title })),
      update: date ? { date, number: newest.episode.number, title: newest.episode.title } : null
    })
  }
  // 更新日の新しい順（更新日のない作品は後ろ）
  return novels.sort((a, b) => (b.update?.date ?? '').localeCompare(a.update?.date ?? '') || a.title.localeCompare(b.title, 'ja'))
}

export async function siteData () {
  const releases = await readJson(path.join(frontendDir, 'data/releases.json'), { releases: [] })
  const illustrations = await readJson(path.join(frontendDir, 'data/illustrations.json'), { illustrations: [] })
  const booth = await readJson(path.join(frontendDir, 'data/booth.json'), { items: [] })
  const { games, about, links } = await loadContent()
  return {
    releases: releases.releases ?? [],
    goods: booth.items ?? [],
    illustrations: illustrations.illustrations ?? [],
    novels: await listNovels(),
    games, about, links
  }
}

// 1話分の本文。公開していない作品（draft）は返さない。
export async function episodeData (slug, number) {
  const dir = path.join(novelsDir, slug)
  if (!/^[\w-]+$/.test(slug) || !existsSync(dir)) return null
  const meta = await readJson(path.join(dir, 'novel.json'), null)
  if (!meta || meta.draft) return null
  const files = await episodeFiles(dir)
  const index = files.findIndex(item => item.episode.number === number)
  if (index < 0) return null
  const text = await readFile(path.join(dir, files[index].file), 'utf8')
  return { number, title: files[index].episode.title, html: renderKakuyomu(text), length: text.replace(/《.*?》|[｜|\s]/g, '').length }
}

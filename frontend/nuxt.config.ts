// https://nuxt.com/docs/api/configuration/nuxt-config
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { parseEpisodeFile } from './utils/kakuyomu.mjs'

// content/novels にある公開中の作品と各話を、静的生成の対象に加える。
const novelRoutes = (): string[] => {
  try {
    const root = fileURLToPath(new URL('./content/novels', import.meta.url))
    if (!existsSync(root)) return []
    const routes = ['/novels']
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      const metaPath = `${root}/${entry.name}/novel.json`
      if (!entry.isDirectory() || !existsSync(metaPath)) continue
      if (JSON.parse(readFileSync(metaPath, 'utf8')).draft) continue
      const numbers = readdirSync(`${root}/${entry.name}`).map(file => /^(\d+).*\.txt$/i.exec(file)).filter(Boolean).map(match => Number.parseInt(match![1], 10))
      if (!numbers.length) continue
      routes.push(`/novels/${entry.name}`, ...numbers.map(number => `/novels/${entry.name}/${number}`))
    }
    return routes
  } catch (error) {
    console.warn('小説の一覧を読めませんでした:', error)
    return []
  }
}

// 小説ごとに、いちばん新しい話のファイルがリポジトリに入った日時を git の記録から調べる。トップの「新着」に使う。
// novel.json に "updates": false がある作品（使い方の案内など）は対象外。
// 浅い clone では日付が正しく取れないので何も返さない（Actions は fetch-depth: 0 で取得している）。
type NovelUpdate = { date: string; number: number; title: string }
const novelUpdates = (): Record<string, NovelUpdate> => {
  try {
    const root = fileURLToPath(new URL('./content/novels', import.meta.url))
    if (!existsSync(root)) return {}
    const git = (...args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    if (git('rev-parse', '--is-shallow-repository') !== 'false') return {}
    const result: Record<string, NovelUpdate> = {}
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      const metaPath = `${root}/${entry.name}/novel.json`
      if (!entry.isDirectory() || !existsSync(metaPath)) continue
      const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
      if (meta.draft || meta.updates === false) continue
      const newest = readdirSync(`${root}/${entry.name}`)
        .map(file => ({ file, episode: parseEpisodeFile(file) }))
        .filter(item => item.episode)
        .sort((a, b) => b.episode!.number - a.episode!.number)[0]
      if (!newest) continue
      const file = `${entry.name}/${newest.file}`
      // ファイルが追加された日時。名前を変えたファイルなどで見つからなければ、最後に変更された日時。
      const date = git('log', '-1', '--diff-filter=A', '--format=%cI', '--', file) || git('log', '-1', '--format=%cI', '--', file)
      if (date) result[entry.name] = { date, number: newest.episode!.number, title: newest.episode!.title }
    }
    return result
  } catch (error) {
    console.warn('小説の更新日を読めませんでした:', error)
    return {}
  }
}

export default defineNuxtConfig({
  ssr: true,
  nitro: {
    prerender: {
      routes: ['/', '/about', '/works', '/trial', '/unrequited', ...novelRoutes()]
    }
  },
  devServer: {
    port: 3000
  },
  runtimeConfig: {
    public: {
      novelUpdates: novelUpdates()
    }
  },
  app: {
    baseURL: '/',
    head: {
      title: '針の筵 - nekonoha',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover'
        },
        {
          name: 'description',
          content: 'ネコノハの音楽・ゲーム・イラスト。最新リリースと公開作品。'
        },
        {
          property: 'og:title',
          content: '針の筵 - nekonoha'
        },
        {
          property: 'og:description',
          content: 'ネコノハの音楽・ゲーム・イラスト。最新リリースと公開作品。'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:url',
          content: 'https://nekonoha.github.io/'
        },
        {
          property: 'og:image',
          content: 'https://nekonoha.github.io/images/iconnn.png'
        },
        {
          name: 'theme-color',
          content: '#f5f6f8'
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:title',
          content: '針の筵 - nekonoha'
        },
        {
          name: 'twitter:description',
          content: 'ネコノハの音楽・ゲーム・イラスト。最新リリースと公開作品。'
        }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=M+PLUS+2:wght@400;500;700;800&display=swap' },
        {
          rel: 'canonical',
          href: 'https://nekonoha.github.io/'
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/images/mat_favicon.svg'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css'
        }
      ],
      script: [
        { src: '/theme.js', tagPosition: 'head' },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: '針の筵',
            alternateName: 'Hari no Mushiro',
            url: 'https://nekonoha.github.io/',
            author: {
              '@type': 'Person',
              name: 'ネコノハ',
              alternateName: 'Nekonoha',
              url: 'https://nekonoha.github.io/'
            }
          })
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  css: [],
  vite: {
    logLevel: 'warn',
    server: {
      hmr: {
        overlay: false
      }
    }
  },
  compatibilityDate: '2025-12-28'
})

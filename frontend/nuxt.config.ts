// https://nuxt.com/docs/api/configuration/nuxt-config
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

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

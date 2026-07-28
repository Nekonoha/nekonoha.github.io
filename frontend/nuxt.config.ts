// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  nitro: {
    prerender: {
      routes: ['/', '/about', '/works', '/trial', '/unrequited']
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
          content: '針の筵 - nekonoha の趣味サイト。ゲーム制作、音楽制作など、自由気ままに作った作品たちを置いています。'
        },
        {
          property: 'og:title',
          content: '針の筵 - nekonoha'
        },
        {
          property: 'og:description',
          content: '針の筵 - nekonoha の趣味サイト。ゲーム制作、音楽制作など、自由気ままに作った作品たちを置いています。'
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
          content: '#07090d'
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
          content: '針の筵 - nekonoha の趣味サイト。ゲーム制作、音楽制作など、自由気ままに作った作品たちを置いています。'
        }
      ],
      link: [
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

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    prerender: {
      routes: ['/', '/about', '/product', '/link', '/trial', '/unrequited']
    }
  },
  devServer: {
    port: 3000
  },
  app: {
    baseURL: '/', // ユーザーページの場合は常に '/'
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
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAFoSURBVFhH7ZY9SwNBEIafgFZaWFhYWFhYWFhYWFhYWFhYWFjYWFhZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWdn/gD/AH+AP8Af4A/wB/gB/gD/AH+AP8Af4A/wB/gB/gD/AH+AP8Af4A/wB/gB/gD/AH+AP8Af4A/wB/gB/gD/AH+AP8Af4A/wB/gB/gD/AH+AP8Af4A/wB/gB/gD/AH+AP8Af4A/wB/gB/gD/AH+AP8Af4A/wB/gB/gD/AH+AP8Af4A/wB/gB/gD/AH+AP8Af4A/wB/gB/gD/AH+AP8Af4A/wB/gB/gD/AH+AP8AcYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWD4j/gCcx4iQE0lWwAAAAASUVORK5CYII='
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Cg%3E%3Crect x="2" y="2" width="60" height="60" rx="12" fill="%23222"/%3E%3Cg%3E%3Cpath d="M32 8c-6 0-10 4-10 10 0 4 2 7 6 9-2 1-4 3-4 6 0 4 4 7 8 7s8-3 8-7c0-3-2-5-4-6 4-2 6-5 6-9 0-6-4-10-10-10zm0 2c5 0 8 3 8 8 0 3-2 6-6 7-4-1-6-4-6-7 0-5 3-8 8-8zm0 18c3 0 6 2 6 5 0 3-3 5-6 5s-6-2-6-5c0-3 3-5 6-5z" fill="%23f8f6f0"/%3E%3Cg%3E%3Crect x="12" y="54" width="40" height="4" rx="2" fill="%23f4a6c3"/%3E%3Crect x="20" y="48" width="24" height="4" rx="2" fill="%23f4a6c3"/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E'
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
});

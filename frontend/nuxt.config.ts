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
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/mat_favicon.svg'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  compatibilityDate: '2025-12-28'
});

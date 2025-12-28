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
    baseURL: process.env.NODE_ENV === 'production' ? '/nekonoha-web/' : '/',
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23f4a6c3"/></svg>'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  compatibilityDate: '2025-12-28'
});

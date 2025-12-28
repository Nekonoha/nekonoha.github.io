<template>
  <div class="app">
    <BackgroundAnimation />
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>
<script setup lang="ts">
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import BackgroundAnimation from '~/components/BackgroundAnimation.vue'

// Google Fontsを読み込み
useHead({
  title: '針の筵 - nekonoha',
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect', 
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Noto+Sans+JP:wght@300;400;500;700&display=swap'
    }
  ]
})
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  background: linear-gradient(135deg, #2D2B4A 0%, #3A3859 50%, #4A4674 100%);
  color: #F8F6F0;
  line-height: 1.6;
  min-height: 100vh;
  font-weight: 400;
  overflow-x: hidden;
}
</style>
<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
  min-height: 70vh;
  padding: 3rem 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  animation: slideUp 0.6s ease-out;
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

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
 :root {
  --color-main: #3C2F2F;
  --color-main-strong: #2f2424;
  --color-surface: #4a3a32;
  --color-panel: #2f2624;
  --color-sub: #EADBC8;
  --color-sub-strong: #d8c7ae;
  --color-accent: #B68D40;
  --color-accent-strong: #9b7634;
  --color-text: #F5EFE6;
  --color-muted: rgba(234, 219, 200, 0.75);
  --shadow-strong: 0 2px 16px rgba(0, 0, 0, 0.35);
  --shadow-soft: 0 10px 40px rgba(0, 0, 0, 0.28);
 }
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  background: radial-gradient(circle at 20% 20%, rgba(234, 219, 200, 0.06), transparent 35%),
              radial-gradient(circle at 80% 0%, rgba(182, 141, 64, 0.08), transparent 40%),
              linear-gradient(135deg, var(--color-main-strong) 0%, var(--color-main) 45%, #4b3b34 100%);
  color: var(--color-text);
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

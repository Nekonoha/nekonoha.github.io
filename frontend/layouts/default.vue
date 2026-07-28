<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">{{ locale === 'ja' ? '本文へ移動' : 'Skip to content' }}</a>
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>
    <Header />
    <main id="main-content">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
const { locale } = useLocale()
useHead({
  htmlAttrs: { lang: 'ja' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap'
    }
  ]
})
</script>

<style>
:root {
  --color-main: #07090d;
  --color-main-strong: #030406;
  --color-surface: #11151c;
  --color-panel: #0c0f14;
  --color-sub: #d7dae0;
  --color-sub-strong: #ffffff;
  --color-accent: #ff6faf;
  --color-accent-strong: #db3f86;
  --color-text: #f4f5f7;
  --color-text-muted: #9399a5;
  --color-muted: rgba(215, 218, 224, .62);
  --color-rgb-main: 7, 9, 13;
  --color-rgb-accent: 255, 111, 175;
  --shadow-strong: 0 28px 80px rgba(0, 0, 0, .48);
  --shadow-soft: 0 16px 50px rgba(0, 0, 0, .32);
  --shadow-subtle: 0 10px 30px rgba(0, 0, 0, .22);
  --container: 1180px;
  --radius-lg: 28px;
  --radius-md: 18px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; overflow-x: hidden; }
body {
  min-width: 320px;
  min-height: 100vh;
  overflow-x: hidden;
  color: var(--color-text);
  background:
    radial-gradient(circle at 82% 8%, rgba(255, 111, 175, .085), transparent 31rem),
    radial-gradient(circle at 8% 52%, rgba(177, 69, 255, .055), transparent 28rem),
    linear-gradient(155deg, #050609 0%, #090b10 48%, #07080c 100%);
  font-family: 'Manrope', 'Noto Sans JP', sans-serif;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
button, a { font: inherit; }
a { color: inherit; }
button { color: inherit; }
::selection { color: #07090d; background: var(--color-accent); }
:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 3px; }
.skip-link { position: fixed; top: 8px; left: 12px; z-index: 1000; padding: 10px 14px; border-radius: 10px; color: #220b16; background: #ffb0d2; font-size: .78rem; font-weight: 800; text-decoration: none; transform: translateY(-150%); transition: transform .2s; }
.skip-link:focus { transform: translateY(0); }
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #050609; }
::-webkit-scrollbar-thumb { border: 3px solid #050609; border-radius: 99px; background: #343944; }

.site-shell { position: relative; min-height: 100vh; isolation: isolate; }
.site-shell::before {
  position: fixed;
  inset: 0;
  z-index: -3;
  content: '';
  pointer-events: none;
  opacity: .65;
  background-image: radial-gradient(rgba(255,255,255,.09) .7px, transparent .7px);
  background-size: 24px 24px;
  mask-image: linear-gradient(to bottom, black, transparent 75%);
}
.ambient {
  position: fixed;
  z-index: -2;
  width: 36rem;
  height: 36rem;
  border-radius: 50%;
  filter: blur(120px);
  opacity: .1;
  pointer-events: none;
}
.ambient-one { top: -18rem; right: -10rem; background: var(--color-accent); animation: drift-one 18s ease-in-out infinite alternate; }
.ambient-two { bottom: 5rem; left: -22rem; background: #b145ff; animation: drift-two 22s ease-in-out infinite alternate; }
@keyframes drift-one { to { transform: translate(-5rem, 6rem) scale(.9); } }
@keyframes drift-two { to { transform: translate(8rem, -4rem) scale(1.1); } }
#main-content { min-height: calc(100vh - 180px); padding-top: 96px; }

.page-wrap { width: min(var(--container), calc(100% - 40px)); margin: 0 auto; padding: 72px 0 120px; }
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-accent);
  font: 500 .76rem/1 'DM Mono', monospace;
  letter-spacing: .16em;
  text-transform: uppercase;
}
.eyebrow::before { width: 28px; height: 1px; content: ''; background: currentColor; }
.display-title {
  max-width: 900px;
  margin-top: 20px;
  font-size: clamp(3rem, 8vw, 7.5rem);
  font-weight: 800;
  line-height: .94;
  letter-spacing: -.065em;
}
.lead { max-width: 680px; color: var(--color-text-muted); font-size: clamp(1rem, 1.7vw, 1.2rem); }
.panel {
  border: 1px solid rgba(255,255,255,.09);
  border-radius: var(--radius-lg);
  background: rgba(15,18,24,.76);
  box-shadow: var(--shadow-subtle);
  backdrop-filter: blur(18px);
}
.mono { font-family: 'DM Mono', monospace; }
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
}
.page-enter-active, .page-leave-active { transition: opacity .22s ease, transform .22s ease; }
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to { opacity: 0; transform: translateY(-8px); }

/* Legacy game pages share the new visual language. */
.game-page { background-color: transparent !important; }
.header-section { padding-top: 4rem !important; }
.game-title { font-family: 'Manrope', 'Noto Sans JP', sans-serif !important; letter-spacing: -.05em !important; }
.info-card { border-color: rgba(255,255,255,.1) !important; background: rgba(12,15,20,.86) !important; }
.info-card h2 { font-family: 'DM Mono', monospace !important; color: var(--color-accent) !important; }

@media (max-width: 720px) {
  #main-content { padding-top: 78px; }
  .page-wrap { width: min(100% - 28px, var(--container)); padding: 48px 0 80px; }
  .display-title { font-size: clamp(3rem, 17vw, 5.2rem); }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
</style>

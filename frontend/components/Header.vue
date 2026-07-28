<template>
  <header class="site-header">
    <nav ref="navRoot" class="nav" :aria-label="locale === 'ja' ? 'メインナビゲーション' : 'Main navigation'">
      <NuxtLink to="/" class="brand" @click="closeAll">
        <span>{{ locale === 'ja' ? '針の筵' : 'HARI NO MUSHIRO' }}<small>{{ locale === 'ja' ? 'ネコノハの個人サイト' : 'NEKONOHA’S PERSONAL WEBSITE' }}</small></span>
      </NuxtLink>

      <button class="menu-toggle" :aria-expanded="open" aria-controls="nav-links" @click="open = !open">
        <i :class="open ? 'fas fa-times' : 'fas fa-bars'" aria-hidden="true"></i>
        <span class="sr-only">{{ locale === 'ja' ? 'メニュー' : 'Menu' }}</span>
      </button>

      <div id="nav-links" class="nav-links" :class="{ open }">
        <div class="primary-nav">
          <NuxtLink to="/" @click="closeAll">{{ t('header.top') }}</NuxtLink>
          <NuxtLink to="/works" @click="closeAll">{{ t('header.works') }}</NuxtLink>
          <NuxtLink to="/about" @click="closeAll">{{ t('header.about') }}</NuxtLink>
        </div>

        <div class="link-menu">
          <button class="link-trigger" :aria-expanded="linksOpen" aria-controls="quick-links" @click="linksOpen = !linksOpen">
            {{ locale === 'ja' ? 'リンク' : 'LINKS' }}
            <i class="fas fa-chevron-down" aria-hidden="true"></i>
          </button>
          <div v-if="linksOpen" id="quick-links" class="quick-links">
            <p>{{ locale === 'ja' ? '公開先・活動先' : 'Find me online' }}</p>
            <a href="https://www.tunecore.co.jp/artists/nekonoha" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-wave-square" aria-hidden="true"></i><span><strong>TuneCore</strong><small>{{ locale === 'ja' ? '音楽' : 'Music' }}</small></span><b>↗</b>
            </a>
            <a href="https://pixiv.me/tanfantazma" target="_blank" rel="noopener noreferrer">
              <i class="fa-brands fa-pixiv" aria-hidden="true"></i><span><strong>pixiv</strong><small>{{ locale === 'ja' ? 'イラスト・漫画' : 'Illustration' }}</small></span><b>↗</b>
            </a>
            <a href="https://tanfantazma.booth.pm/" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-bag-shopping" aria-hidden="true"></i><span><strong>BOOTH</strong><small>{{ locale === 'ja' ? '販売物' : 'Shop' }}</small></span><b>↗</b>
            </a>
            <a href="http://nekonoha.hatenablog.com/" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-pen-to-square" aria-hidden="true"></i><span><strong>Blog</strong><small>{{ locale === 'ja' ? '日記・制作記録' : 'Notes' }}</small></span><b>↗</b>
            </a>
            <a href="https://twitter.com/tan_fantazma" target="_blank" rel="noopener noreferrer">
              <i class="fa-brands fa-x-twitter" aria-hidden="true"></i><span><strong>Twitter / X</strong><small>{{ locale === 'ja' ? '近況' : 'Updates' }}</small></span><b>↗</b>
            </a>
          </div>
        </div>

        <button class="language" :aria-label="locale === 'ja' ? '英語に切り替える' : 'Switch to Japanese'" @click="toggleLocale">
          {{ locale === 'ja' ? 'EN' : 'JA' }}
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
const open = ref(false)
const linksOpen = ref(false)
const navRoot = ref<HTMLElement | null>(null)
const { t, locale, setLocale } = useLocale()
const route = useRoute()
const closeAll = () => {
  open.value = false
  linksOpen.value = false
}
const toggleLocale = () => setLocale(locale.value === 'ja' ? 'en' : 'ja')
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeAll()
}
const handleOutsideClick = (event: PointerEvent) => {
  if (navRoot.value && !navRoot.value.contains(event.target as Node)) closeAll()
}
watch(() => route.path, closeAll)
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('pointerdown', handleOutsideClick)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('pointerdown', handleOutsideClick)
})
</script>

<style scoped>
.site-header { position: fixed; inset: 0 0 auto; z-index: 100; padding: 10px 0 0; pointer-events: none; }
.nav { position: relative; display: flex; width: min(var(--container), calc(100% - 40px)); min-height: 64px; margin: auto; padding: 10px 12px; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,.1); border-radius: 18px; background: rgba(10,12,17,.78); box-shadow: 0 16px 45px rgba(0,0,0,.28), inset 0 1px rgba(255,255,255,.035); backdrop-filter: blur(22px) saturate(1.2); pointer-events: auto; }
.nav::before { position: absolute; top: -1px; left: 52px; width: 90px; height: 1px; content: ''; background: linear-gradient(90deg, transparent, var(--color-accent), transparent); }
.brand { display: flex; min-height: 42px; padding: 0 14px; align-items: center; border-radius: 12px; color: white; font-size: .82rem; font-weight: 800; letter-spacing: .1em; text-decoration: none; }
.brand:hover { background: rgba(255,111,175,.07); }
.brand small { display: block; margin-top: 2px; color: var(--color-text-muted); font: 400 .54rem/1 'DM Mono', monospace; letter-spacing: .1em; }
.nav-links, .primary-nav { display: flex; align-items: center; }
.nav-links { gap: 9px; }
.primary-nav { gap: 5px; }
.primary-nav a, .link-trigger { min-height: 40px; padding: 0 16px; border: 1px solid transparent; border-radius: 999px; color: #c4c7ce; background: transparent; font-size: .78rem; font-weight: 700; letter-spacing: .04em; text-decoration: none; cursor: pointer; transition: color .2s, background .2s, border-color .2s, transform .2s; }
.primary-nav a { display: flex; align-items: center; }
.primary-nav a:hover, .link-trigger:hover { color: #ffddea; border-color: rgba(255,111,175,.2); background: rgba(255,111,175,.08); transform: translateY(-1px); }
.primary-nav a.router-link-active, .link-trigger[aria-expanded="true"] { color: #2b0b18; border-color: #ff9ac7; background: linear-gradient(135deg, #ff91c2, #ffb7d6); box-shadow: 0 5px 16px rgba(255,111,175,.18); }
.link-menu { position: relative; }
.link-trigger i { margin-left: 7px; font-size: .62rem; transition: transform .2s; }
.link-trigger[aria-expanded="true"] i { transform: rotate(180deg); }
.quick-links { position: absolute; top: calc(100% + 14px); right: 0; width: 330px; padding: 14px; border: 1px solid rgba(255,255,255,.1); border-radius: 17px; background: #11141a; box-shadow: var(--shadow-strong); }
.quick-links > p { padding: 6px 8px 12px; color: #727985; font: 500 .62rem 'DM Mono', monospace; letter-spacing: .1em; text-transform: uppercase; }
.quick-links a { display: grid; padding: 11px 9px; align-items: center; border-radius: 10px; color: #daddE3; text-decoration: none; grid-template-columns: 34px 1fr auto; gap: 9px; }
.quick-links a:hover { background: rgba(255,255,255,.055); }
.quick-links a > i { color: var(--color-accent); text-align: center; }
.quick-links strong, .quick-links small { display: block; }
.quick-links strong { font-size: .78rem; }
.quick-links small { margin-top: 1px; color: #7f8590; font-size: .66rem; }
.quick-links b { color: var(--color-accent); font-size: .75rem; }
.language, .menu-toggle { display: grid; width: 42px; height: 42px; place-items: center; border: 1px solid rgba(255,111,175,.28); border-radius: 50%; color: #ffd7e8; background: rgba(255,111,175,.08); cursor: pointer; transition: transform .2s, background .2s, color .2s; }
.language { font: 500 .68rem 'DM Mono', monospace; }
.language:hover, .menu-toggle:hover { color: #2b0b18; border-color: #ff9ac7; background: #ff9ac7; transform: rotate(-4deg) scale(1.04); }
.menu-toggle { display: none; }
@media (max-width: 760px) {
  .site-header { padding-top: 8px; }
  .nav { width: calc(100% - 16px); min-height: 60px; padding: 9px 10px; border-radius: 16px; }
  .menu-toggle { display: grid; }
  .nav-links { position: absolute; top: calc(100% + 8px); right: 0; left: 0; display: none; max-height: calc(100vh - 90px); padding: 14px; overflow-y: auto; border: 1px solid rgba(255,255,255,.1); border-radius: 17px; background: rgba(16,19,25,.97); box-shadow: var(--shadow-strong); backdrop-filter: blur(20px); align-items: stretch; flex-direction: column; }
  .nav-links.open { display: flex; }
  .primary-nav { align-items: stretch; flex-direction: column; }
  .primary-nav a { min-height: 48px; border-radius: 14px; font-size: .9rem; }
  .link-trigger { display: flex; width: 100%; min-height: 48px; align-items: center; justify-content: space-between; border-radius: 14px; font-size: .9rem; }
  .quick-links { position: static; width: 100%; margin-top: 7px; border: 0; border-radius: 10px; background: rgba(255,255,255,.025); box-shadow: none; }
  .language { width: 100%; height: 46px; margin-top: 4px; border-radius: 14px; }
}
</style>

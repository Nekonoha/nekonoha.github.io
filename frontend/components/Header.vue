<template>
  <header class="site-header">
    <nav class="nav" :aria-label="locale === 'ja' ? 'メインメニュー' : 'Main navigation'">
      <NuxtLink to="/" class="brand">
        <span class="brand-name">針の筵<small>nekonoha</small></span>
      </NuxtLink>
      <div class="nav-right">
        <div class="primary-nav">
          <NuxtLink to="/works" :class="{ 'router-link-active': inWorks }" :aria-label="locale === 'ja' ? '作品' : 'Works'" :title="locale === 'ja' ? '作品' : 'Works'"><i class="fa-solid fa-shapes" aria-hidden="true"></i><span>{{ locale === 'ja' ? '作品' : 'Works' }}</span></NuxtLink>
          <NuxtLink to="/about" :aria-label="locale === 'ja' ? 'プロフィール' : 'About'" :title="locale === 'ja' ? 'プロフィール' : 'About'"><i class="fa-regular fa-user" aria-hidden="true"></i><span>{{ locale === 'ja' ? 'プロフィール' : 'About' }}</span></NuxtLink>
        </div>
        <div class="nav-tools">
          <ColorModeSelect />
          <button class="language" :aria-label="locale === 'ja' ? 'Switch to English' : '日本語に切り替える'" @click="setLocale(locale === 'ja' ? 'en' : 'ja')">{{ locale === 'ja' ? 'EN' : 'JP' }}</button>
        </div>
      </div>
    </nav>
  </header>
</template>
<script setup lang="ts">
const { locale, setLocale } = useLocale()
// 小説とゲームの個別ページも「作品」の中として示す。
const route = useRoute()
const inWorks = computed(() => /^\/(novels|trial|unrequited)(\/|$)/.test(route.path))
</script>
<style scoped>
.site-header { position: sticky; top: 0; z-index: 100; padding: 16px 0 0; }
.nav { display: flex; width: min(var(--container), calc(100% - 64px)); margin: auto; min-height: 64px; padding: 8px 12px 8px 20px; justify-content: space-between; align-items: center; gap: 20px; border: 1px solid var(--line); border-radius: var(--radius-panel); background: color-mix(in srgb, var(--color-panel) 82%, transparent); backdrop-filter: blur(18px) saturate(1.3); -webkit-backdrop-filter: blur(18px) saturate(1.3); box-shadow: 0 6px 24px #0000000d; }
.brand { display: flex; align-items: center; gap: 12px; text-decoration: none; white-space: nowrap; }

.brand-name { font-weight: 800; font-size: 1.05rem; letter-spacing: .04em; line-height: 1.3; }
.brand small { display: block; margin-top: 2px; color: var(--color-text-muted); font-size: .72rem; font-weight: 500; letter-spacing: .04em; }
.nav-right, .primary-nav, .nav-tools { display: flex; align-items: center; }
.nav-right { gap: 20px; } .primary-nav { gap: 5px; }
.primary-nav a { display: flex; align-items: center; gap: 9px; min-height: 40px; padding: 8px 16px; border-radius: var(--radius-pill); color: var(--color-text-muted); font-size: .875rem; font-weight: 500; text-decoration: none; transition: background var(--dur-fast), color var(--dur-fast); }
.primary-nav a:hover { color: var(--color-text); background: var(--color-surface); }
.primary-nav a.router-link-active { color: var(--color-text); background: var(--color-surface); }
.primary-nav i { font-size: .82rem; }
.nav-tools { gap: 6px; padding-left: 16px; border-left: 1px solid var(--line); }
.language { width: 40px; height: 40px; border: 0; border-radius: 50%; color: var(--color-text-muted); background: transparent; font-size: .78rem; font-weight: 700; letter-spacing: .04em; transition: background var(--dur-fast), color var(--dur-fast); }
.language:hover { background: var(--color-surface); color: var(--color-text); }
@media(max-width:760px) { .site-header { padding-top: 10px; } .nav { width: calc(100% - 24px); min-height: 60px; padding: 8px 10px 8px 14px; gap: 12px; } .nav-right { gap: 10px; } .primary-nav a { padding: 8px 11px; } .nav-tools { padding-left: 10px; } }
@media(max-width:540px) { .primary-nav a span { display: none; } .primary-nav a { width: 36px; padding: 0; justify-content: center; } .nav-right { gap: 6px; } .nav-tools { padding-left: 6px; gap: 2px; } .language { width: 34px; } .brand { gap: 8px; }  .brand-name { font-size: .95rem; } .brand small { font-size: .66rem; } }
@media(max-width:360px) { .nav { padding-inline: 8px; gap: 6px; } .primary-nav { gap: 0; } .primary-nav a { width: 32px; } .brand-name { letter-spacing: 0; } }
</style>

<template>
  <header class="site-header">
    <nav class="nav" :aria-label="locale === 'ja' ? 'メインメニュー' : 'Main navigation'">
      <NuxtLink to="/" class="brand">
        <span class="brand-name">針の筵<small>nekonoha</small></span>
      </NuxtLink>
      <div class="nav-right">
        <div class="primary-nav">
          <NuxtLink to="/works" :aria-label="locale === 'ja' ? '作品' : 'Works'" :title="locale === 'ja' ? '作品' : 'Works'"><i class="fa-solid fa-shapes" aria-hidden="true"></i><span>{{ locale === 'ja' ? '作品' : 'Works' }}</span></NuxtLink>
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
</script>
<style scoped>
.site-header { position: sticky; top: 0; z-index: 100; padding: 18px 0 0; }
.nav { display: flex; width: min(var(--container), calc(100% - 64px)); margin: auto; min-height: 72px; padding: 10px 16px; justify-content: space-between; align-items: center; gap: 20px; border: 1px solid var(--line); border-radius: 18px; background: color-mix(in srgb, var(--color-panel) 94%, transparent); backdrop-filter: blur(16px); box-shadow: 0 6px 24px #00000008; }
.brand { display: flex; align-items: center; gap: 12px; text-decoration: none; white-space: nowrap; }

.brand-name { font-weight: 700; font-size: 1rem; letter-spacing: .08em; line-height: 1.35; }
.brand small { display: block; margin-top: 3px; color: var(--color-text-muted); font-size: .65rem; font-weight: 500; letter-spacing: .04em; }
.nav-right, .primary-nav, .nav-tools { display: flex; align-items: center; }
.nav-right { gap: 20px; } .primary-nav { gap: 5px; }
.primary-nav a { display: flex; align-items: center; gap: 9px; min-height: 40px; padding: 8px 16px; border-radius: 10px; color: var(--color-text-muted); font-size: .78rem; font-weight: 500; text-decoration: none; transition: background .18s, color .18s; }
.primary-nav a:hover { color: var(--color-text); background: var(--color-surface); }
.primary-nav a.router-link-active { color: var(--color-text); background: var(--color-surface); }
.primary-nav i { font-size: .82rem; }
.nav-tools { gap: 6px; padding-left: 16px; border-left: 1px solid var(--line); }
.language { width: 40px; height: 40px; border: 0; border-radius: 50%; color: var(--color-text-muted); background: transparent; font-size: .7rem; font-weight: 600; transition: background .18s; }
.language:hover { background: var(--color-surface); color: var(--color-text); }
@media(max-width:760px) { .site-header { padding-top: 10px; } .nav { width: calc(100% - 24px); border-radius: 14px; min-height: 64px; padding: 8px 12px; gap: 12px; } .nav-right { gap: 10px; } .primary-nav a { padding: 8px 11px; } .nav-tools { padding-left: 10px; } }
@media(max-width:540px) { .primary-nav a span { display: none; } .primary-nav a { width: 36px; padding: 0; justify-content: center; } .nav-right { gap: 6px; } .nav-tools { padding-left: 6px; gap: 2px; } .language { width: 34px; } .brand { gap: 8px; }  .brand-name { font-size: .85rem; } .brand small { font-size: .55rem; } }
@media(max-width:360px) { .nav { padding-inline: 8px; gap: 6px; } .primary-nav { gap: 0; } .primary-nav a { width: 32px; } .brand-name { letter-spacing: 0; } }
</style>

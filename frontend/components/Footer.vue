<template>
  <footer class="footer">
    <div class="footer-inner">
      <NuxtLink to="/" class="footer-brand">針の筵 <span>nekonoha</span></NuxtLink>
      <p>© Nekonoha</p>
      <a href="#main-content">{{ locale === 'ja' ? 'ページ上部へ' : 'Back to top' }} ↑</a>
    </div>
  </footer>
</template>
<script setup lang="ts">const { locale } = useLocale()</script>
<style scoped>
.footer { border-top: 1px solid var(--line); }
.footer-inner { width: min(var(--container), calc(100% - 96px)); margin: auto; min-height: 130px; display: flex; justify-content: space-between; align-items: center; gap: 24px; font-size: .75rem; }
a { text-decoration: none; } a:hover { text-decoration: underline; }
.footer-brand { font-size: 1rem; } .footer-brand span { margin-left: 16px; font-size: .75rem; } p { color: var(--color-text-muted); }
@media(max-width:760px) { .footer-inner { width: calc(100% - 40px); flex-wrap: wrap; padding: 28px 0; } .footer-brand { width: 100%; } }
</style>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <NuxtLink to="/" class="footer-brand">針の筵 <span>nekonoha</span></NuxtLink>
      <p>© Nekonoha</p>
      <a class="text-link" href="#main-content">{{ locale === 'ja' ? 'ページ上部へ' : 'Back to top' }}<i class="fa-solid fa-arrow-up" aria-hidden="true"></i></a>
    </div>
  </footer>
</template>
<script setup lang="ts">const { locale } = useLocale()</script>
<style scoped>
.footer { border-top: 1px solid var(--line); }
.footer-inner { width: min(var(--container), calc(100% - 96px)); margin: auto; min-height: 130px; display: flex; justify-content: space-between; align-items: center; gap: 24px; font-size: .8125rem; }
a { text-decoration: none; } a i { margin-left: .6em; font-size: .85em; transition: transform var(--dur-base) var(--ease-out); } a:hover i { transform: translateY(-3px); }
.footer-brand { font-size: 1rem; font-weight: 800; letter-spacing: .04em; } .footer-brand span { margin-left: 14px; color: var(--color-text-muted); font-size: .78rem; font-weight: 500; letter-spacing: .04em; } p { color: var(--color-text-muted); }
@media(max-width:760px) { .footer-inner { width: calc(100% - 40px); flex-wrap: wrap; padding: 28px 0; } .footer-brand { width: 100%; } }
</style>

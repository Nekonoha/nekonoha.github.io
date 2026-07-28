<template>
  <footer class="footer">
    <div class="footer-inner">
      <div><span class="status-dot"></span> {{ locale === 'ja' ? '個人制作サイト' : 'PERSONAL WEBSITE' }}</div>
      <p>{{ t('footer.copyright') }}</p>
      <a href="#main-content">{{ locale === 'ja' ? 'ページ上部へ' : 'BACK TO TOP' }} ↑</a>
    </div>
  </footer>
</template>
<script setup lang="ts">const { t, locale } = useLocale()</script>
<style scoped>
.footer { border-top: 1px solid rgba(255,255,255,.08); color: var(--color-text-muted); }
.footer-inner { display: flex; width: min(var(--container), calc(100% - 40px)); min-height: 108px; margin: auto; align-items: center; justify-content: space-between; gap: 24px; font: 500 .68rem 'DM Mono', monospace; letter-spacing: .08em; }
.status-dot { display: inline-block; width: 7px; height: 7px; margin-right: 9px; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 14px var(--color-accent); }
a { color: var(--color-text-muted); text-decoration: none; }
a:hover { color: var(--color-accent); }
@media (max-width: 720px) { .footer-inner { width: calc(100% - 28px); padding: 26px 0; flex-direction: column; align-items: flex-start; } }
</style>

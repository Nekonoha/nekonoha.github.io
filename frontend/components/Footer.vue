<template>
  <footer class="footer" role="contentinfo">
    <div class="content">
      <p>{{ t('footer.copyright') }}</p>
    </div>
  </footer>
</template>
<script setup lang="ts">
const { t } = useLocale()
</script>
<style scoped>
.footer {
  background: var(--footer-bg);
  color: var(--color-text);
  text-align: center;
  padding: 1.5rem 1rem;
  font-size: 0.85rem;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.35);
  border-top: 1px solid rgba(182, 141, 64, 0.25);
  backdrop-filter: blur(10px);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 900;
}
.content {
  max-width: 1200px;
  margin: 0 auto;
}
.content p {
  margin: 0;
  opacity: 0.9;
  color: var(--color-sub);
}
@keyframes twinkle {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>

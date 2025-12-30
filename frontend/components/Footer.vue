<template>
  <footer class="footer">
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
  background: linear-gradient(180deg, rgba(44, 35, 35, 0.95) 0%, rgba(36, 28, 28, 0.95) 100%);
  color: var(--color-text);
  text-align: center;
  padding: 2rem 1rem;
  font-size: 0.9rem;
  margin-top: 4rem;
  box-shadow: var(--shadow-strong);
  border-top: 1px solid rgba(182, 141, 64, 0.25);
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

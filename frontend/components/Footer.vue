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
  background: #1E1B2E;
  color: #F8F6F0;
  text-align: center;
  padding: 2rem 1rem;
  font-size: 0.9rem;
  margin-top: 4rem;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(200, 181, 209, 0.2);
}
.content {
  max-width: 1200px;
  margin: 0 auto;
}
.content p {
  margin: 0;
  opacity: 0.9;
  color: #C8B5D1;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>

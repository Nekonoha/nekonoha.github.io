<template>
  <NuxtLoadingIndicator color="var(--color-accent)" :height="2" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active {
  transition: opacity .32s cubic-bezier(.16,1,.3,1), transform .32s cubic-bezier(.16,1,.3,1);
}
.page-leave-active { transition: opacity .14s ease; }

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to { opacity: 0; }

/* モーション削減プリファレンス対応 */
@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }

  .page-enter-from,
  .page-leave-to {
    transform: none;
    clip-path: none;
    opacity: 1;
  }
}
</style>

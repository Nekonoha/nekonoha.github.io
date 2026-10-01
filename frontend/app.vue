<template>
  <NuxtLoadingIndicator color="var(--color-accent)" :height="3" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active {
  transition: clip-path .68s cubic-bezier(.18,.86,.2,1), opacity .3s ease, transform .3s ease;
}
.page-leave-active { transition: opacity .18s ease, transform .18s ease; }

.page-enter-from {
  clip-path: polygon(-18% 0, 0 0, 0 100%, -18% 100%);
  transform: translateY(12px);
}

.page-enter-to { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

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

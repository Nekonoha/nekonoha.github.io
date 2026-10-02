<template>
  <article class="page-wrap">
    <header><h1 class="display-title">{{ locale === 'ja' ? '小説' : 'Novels' }}</h1></header>
    <NovelList v-if="novels.length" class="novel-index" />
    <p v-else class="novel-empty">{{ locale === 'ja' ? 'まだ公開中の作品はありません。' : 'No novels published yet.' }}</p>
  </article>
</template>
<script setup lang="ts">
const { locale } = useLocale()
const { novels } = useNovels()
useSeoMeta({
  title: () => (locale.value === 'ja' ? '小説' : 'Novels') + ' — 針の筵',
  description: () => locale.value === 'ja' ? 'ネコノハの小説。' : 'Novels by Nekonoha.',
  ogUrl: 'https://nekonoha.github.io/novels'
})
useHead({ link: [{ rel: 'canonical', href: 'https://nekonoha.github.io/novels' }] })
</script>
<style scoped>
.novel-index { margin-top: 48px; border-top: 1px solid var(--line); }
.novel-empty { margin-top: 48px; color: var(--color-text-muted); }
@media(max-width:600px) { .novel-index { margin-top: 32px; } }
</style>

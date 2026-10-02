<template>
  <article class="page-wrap">
    <header><h1 class="display-title">{{ locale === 'ja' ? '小説' : 'Novels' }}</h1></header>
    <div v-if="novels.length" class="novel-list">
      <NuxtLink v-for="novel in novels" :key="novel.slug" :to="`/novels/${novel.slug}`" class="novel-card">
        <div>
          <h2>{{ novel.title }}<span v-if="novel.draft" class="draft-mark">{{ locale === 'ja' ? '下書き' : 'Draft' }}</span></h2>
          <p v-if="novel.description">{{ novel.description }}</p>
        </div>
        <span class="novel-count">{{ novel.episodes.length }}{{ locale === 'ja' ? '話' : (novel.episodes.length === 1 ? ' episode' : ' episodes') }}<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
      </NuxtLink>
    </div>
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
.novel-list { margin-top: 48px; border-top: 1px solid var(--line); }
.novel-card { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 26px 14px; border-bottom: 1px solid var(--line); text-decoration: none; transition: background var(--dur-fast); }
.novel-card:hover { background: color-mix(in srgb, var(--color-surface) 70%, transparent); }
h2 { font-size: 1.35rem; font-weight: 700; line-height: 1.5; }
.novel-card p { max-width: 46em; margin-top: 6px; color: var(--color-text-muted); font-size: .95rem; }
.novel-count { display: inline-flex; flex-shrink: 0; align-items: center; gap: 14px; color: var(--color-text-muted); font-size: .875rem; }
.novel-count i { transition: transform var(--dur-base) var(--ease-out), color var(--dur-fast); }
.novel-card:hover .novel-count i { color: var(--color-accent); transform: translateX(6px); }
.draft-mark { margin-left: 12px; padding: 2px 10px; border: 1px solid var(--line); border-radius: var(--radius-pill); color: var(--color-text-muted); font-size: .75rem; font-weight: 500; vertical-align: middle; }
.novel-empty { margin-top: 48px; color: var(--color-text-muted); }
@media(max-width:600px) { .novel-list { margin-top: 32px; } .novel-card { padding-inline: 4px; } .novel-count { gap: 8px; } }
</style>

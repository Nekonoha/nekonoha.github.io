<template>
  <article class="page-wrap">
    <NuxtLink class="text-link back-link" to="/novels"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>{{ locale === 'ja' ? '小説一覧' : 'All novels' }}</NuxtLink>
    <header>
      <h1 class="display-title">{{ novel.title }}</h1>
      <p v-if="novel.description" class="novel-description">{{ novel.description }}</p>
      <div class="novel-start">
        <NuxtLink v-if="resume" class="pill pill-primary" :to="episodeLink(resume.number)"><i class="fa-solid fa-bookmark ui-icon" aria-hidden="true"></i>{{ locale === 'ja' ? '続きから読む' : 'Continue reading' }}（{{ resume.title }}）</NuxtLink>
        <NuxtLink :class="['pill', { 'pill-primary': !resume }]" :to="episodeLink(novel.episodes[0].number)">{{ locale === 'ja' ? '最初から読む' : 'Start from the beginning' }}</NuxtLink>
      </div>
    </header>
    <section class="section">
      <header class="section-head"><h2>{{ locale === 'ja' ? '目次' : 'Contents' }}<small>{{ novel.episodes.length }}{{ locale === 'ja' ? '話' : ' episodes' }}</small></h2></header>
      <ol class="episode-list">
        <li v-for="(episode, index) in novel.episodes" :key="episode.number">
          <NuxtLink :to="episodeLink(episode.number)" :aria-current="resume?.number === episode.number ? 'true' : undefined">
            <span class="episode-number">{{ index + 1 }}</span>
            <span class="episode-title">{{ episode.title }}</span>
            <span v-if="resume?.number === episode.number" class="episode-here">{{ locale === 'ja' ? '前回ここまで' : 'Last read' }}</span>
          </NuxtLink>
        </li>
      </ol>
    </section>
  </article>
</template>
<script setup lang="ts">
const { locale } = useLocale()
const route = useRoute()
const { findNovel } = useNovels()
const found = findNovel(String(route.params.slug))
if (!found) throw createError({ statusCode: 404, statusMessage: 'Novel not found', fatal: true })
const novel = found
const episodeLink = (number: number) => `/novels/${novel.slug}/${number}`
// 最後に開いた話はこの端末のブラウザにだけ保存する。
const lastRead = ref<number | null>(null)
const resume = computed(() => novel.episodes.find(episode => episode.number === lastRead.value))
onMounted(() => {
  try {
    const saved = Number.parseInt(localStorage.getItem(`nekonoha-novel-last:${novel.slug}`) ?? '', 10)
    if (Number.isFinite(saved)) lastRead.value = saved
  } catch { /* 保存できない環境でも読める。 */ }
})
useSeoMeta({
  title: () => `${novel.title} — 針の筵`,
  description: () => novel.description ?? novel.title,
  ogTitle: () => `${novel.title} — 針の筵`
})
</script>
<style scoped>
.back-link i { margin-right: .6em; font-size: .85em; }
header { margin-top: 20px; }
.novel-description { max-width: 44em; margin-top: 20px; color: var(--color-sub); white-space: pre-line; }
.novel-start { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
.novel-start .pill { min-height: 48px; padding-inline: 22px; font-size: .9rem; white-space: normal; }
.episode-list { list-style: none; }
.episode-list a { display: flex; align-items: baseline; gap: 18px; min-height: 56px; padding: 15px 14px; border-bottom: 1px solid var(--line); text-decoration: none; transition: background var(--dur-fast), color var(--dur-fast); }
.episode-list a:hover { color: var(--color-accent); background: color-mix(in srgb, var(--color-surface) 70%, transparent); }
.episode-number { flex-shrink: 0; min-width: 2.2em; color: var(--color-text-muted); font-size: .875rem; font-variant-numeric: tabular-nums; text-align: right; }
.episode-title { flex: 1; font-weight: 500; }
.episode-here { flex-shrink: 0; padding: 1px 10px; border-radius: var(--radius-pill); color: var(--color-main); background: var(--color-accent); font-size: .75rem; }
@media(max-width:600px) { .episode-list a { gap: 12px; padding-inline: 4px; } }
</style>

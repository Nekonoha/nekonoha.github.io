<template>
  <article class="page-wrap">
    <header><h1 class="display-title">{{ locale === 'ja' ? '作品' : 'Works' }}</h1></header>
    <nav class="works-nav" :aria-label="locale === 'ja' ? '作品ページの目次' : 'Works page sections'">
      <a href="#music" :aria-current="activeSection === 'music' ? 'location' : undefined" @click="activeSection = 'music'"><i class="fa-solid fa-music" aria-hidden="true"></i>{{ locale === 'ja' ? '音楽' : 'Music' }}</a>
      <a href="#games" :aria-current="activeSection === 'games' ? 'location' : undefined" @click="activeSection = 'games'"><i class="fa-solid fa-gamepad" aria-hidden="true"></i>{{ locale === 'ja' ? 'ゲーム' : 'Games' }}</a>
      <a href="#art" :aria-current="activeSection === 'art' ? 'location' : undefined" @click="activeSection = 'art'"><i class="fa-solid fa-paintbrush" aria-hidden="true"></i>{{ locale === 'ja' ? 'イラスト' : 'Art' }}</a>
      <a v-if="novels.length" href="#novels" :aria-current="activeSection === 'novels' ? 'location' : undefined" @click="activeSection = 'novels'"><i class="fa-solid fa-book-open" aria-hidden="true"></i>{{ locale === 'ja' ? '小説' : 'Novels' }}</a>
    </nav>
    <section id="music" class="section">
      <header class="section-head"><h2>{{ locale === 'ja' ? '音楽' : 'Music' }}<small>{{ musicReleases.length }}{{ locale === 'ja' ? '作品' : ' releases' }}</small></h2><a :href="'https://www.tunecore.co.jp/artists/nekonoha?lang=' + locale" target="_blank" rel="noopener noreferrer">TuneCore<span class="ext" aria-hidden="true">↗</span></a></header>
      <LatestReleases :limit="musicReleases.length" />
    </section>
    <section id="games" class="section"><header class="section-head"><h2>{{ locale === 'ja' ? 'ゲーム' : 'Games' }}</h2></header><GameWorks /></section>
    <section id="art" class="section"><header class="section-head"><h2>{{ locale === 'ja' ? 'イラスト' : 'Illustration' }}<small>{{ illustrations.length }}{{ locale === 'ja' ? '点' : ' works' }}</small></h2><a href="https://pixiv.me/tanfantazma" target="_blank" rel="noopener noreferrer">pixiv<span class="ext" aria-hidden="true">↗</span></a></header><LatestIllustrations :limit="illustrations.length" /></section>
    <section v-if="novels.length" id="novels" class="section"><header class="section-head"><h2>{{ locale === 'ja' ? '小説' : 'Novels' }}<small>{{ novels.length }}{{ locale === 'ja' ? '作品' : (novels.length === 1 ? ' title' : ' titles') }}</small></h2></header><NovelList /></section>
  </article>
</template>
<script setup lang="ts">
import { musicReleases } from '~/data/releases'
import { illustrations } from '~/data/illustrations'
const { locale } = useLocale()
const { novels } = useNovels()
const sectionIds = ['music', 'games', 'art', 'novels']
const activeSection = ref('music')
let sectionObserver: IntersectionObserver | undefined
onMounted(() => {
  activeSection.value = sectionIds.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'music'
  sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    if (visible[0]) activeSection.value = visible[0].target.id
  }, { rootMargin: '-150px 0px -55% 0px' })
  for (const id of sectionIds) {
    const section = document.getElementById(id)
    if (section) sectionObserver.observe(section)
  }
})
onUnmounted(() => sectionObserver?.disconnect())
useSeoMeta({
  title: () => (locale.value === 'ja' ? '作品' : 'Works') + ' — 針の筵',
  description: () => locale.value === 'ja' ? 'ネコノハの音楽、ゲーム、イラスト、小説の一覧。' : 'Music, games, illustration and novels by Nekonoha.',
  ogUrl: 'https://nekonoha.github.io/works'
})
useHead({ link: [{ rel: 'canonical', href: 'https://nekonoha.github.io/works' }] })
</script>
<style scoped>
.works-nav { position: sticky; top: 92px; z-index: 30; display: flex; gap: 4px; width: max-content; max-width: 100%; margin-top: 40px; padding: 5px; overflow-x: auto; border: 1px solid var(--line); border-radius: var(--radius-pill); background: color-mix(in srgb, var(--color-panel) 82%, transparent); backdrop-filter: blur(18px) saturate(1.3); -webkit-backdrop-filter: blur(18px) saturate(1.3); box-shadow: 0 6px 24px #0000000d; scrollbar-width: none; }
.works-nav::-webkit-scrollbar { display: none; }
.works-nav a { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 9px; min-height: 40px; padding: 7px 18px; border-radius: var(--radius-pill); color: var(--color-text-muted); font-size: .875rem; font-weight: 500; text-decoration: none; white-space: nowrap; transition: background var(--dur-fast), color var(--dur-fast); }
.works-nav a:hover, .works-nav a:focus-visible { color: var(--color-text); }
.works-nav a[aria-current="location"] { color: var(--color-main); background: var(--color-accent); }
.works-nav i { font-size: .8rem; }
/* Where anchor positioning exists, a single pill glides between the tabs instead. */
@supports (position-anchor: --a) and (left: anchor(left)) {
  .works-nav a[aria-current="location"] { background: transparent; anchor-name: --works-current; }
  .works-nav::before { content: ''; position: absolute; position-anchor: --works-current; top: anchor(top); left: anchor(left); width: anchor-size(width); height: anchor-size(height); border-radius: var(--radius-pill); background: var(--color-accent); transition: left .45s var(--ease-out), width .45s var(--ease-out); }
}
.section { scroll-margin-top: 165px; }
.works-nav + .section { margin-top: 56px; }
@media(max-width:760px) { .works-nav { top: 80px; width: 100%; gap: 0; margin-top: 28px; } .works-nav a { flex: 1 1 0; justify-content: center; gap: 6px; min-width: 0; padding-inline: 6px; font-size: .8125rem; } .section { scroll-margin-top: 150px; } }
@media(max-width:380px) { .works-nav i { display: none; } }
</style>

<template>
  <article class="page-wrap">
    <header><p class="eyebrow">Works</p><h1 class="display-title">{{ locale === 'ja' ? '作品' : 'Works' }}</h1></header>
    <nav class="works-nav" :aria-label="locale === 'ja' ? '作品ページの目次' : 'Works page sections'">
      <a href="#music" :aria-current="activeSection === 'music' ? 'location' : undefined" @click="activeSection = 'music'"><i class="fa-solid fa-music" aria-hidden="true"></i>{{ locale === 'ja' ? '音楽' : 'Music' }}</a>
      <a href="#games" :aria-current="activeSection === 'games' ? 'location' : undefined" @click="activeSection = 'games'"><i class="fa-solid fa-gamepad" aria-hidden="true"></i>{{ locale === 'ja' ? 'ゲーム' : 'Games' }}</a>
      <a href="#art" :aria-current="activeSection === 'art' ? 'location' : undefined" @click="activeSection = 'art'"><i class="fa-solid fa-paintbrush" aria-hidden="true"></i>{{ locale === 'ja' ? 'イラスト' : 'Art' }}</a>
      <a href="#links" :aria-current="activeSection === 'links' ? 'location' : undefined" @click="activeSection = 'links'"><i class="fa-solid fa-link" aria-hidden="true"></i>{{ locale === 'ja' ? 'リンク' : 'Links' }}</a>
    </nav>
    <section id="music" class="section">
      <header class="section-head"><h2>{{ locale === 'ja' ? '音楽' : 'Music' }}<small>{{ musicReleases.length }} releases</small></h2><a :href="'https://www.tunecore.co.jp/artists/nekonoha?lang=' + locale" target="_blank" rel="noopener noreferrer">TuneCore ↗</a></header>
      <LatestReleases :limit="musicReleases.length" />
    </section>
    <section id="games" class="section"><header class="section-head"><h2>{{ locale === 'ja' ? 'ゲーム' : 'Games' }}</h2></header><GameWorks /></section>
    <section id="art" class="section"><header class="section-head"><h2>{{ locale === 'ja' ? 'イラスト' : 'Illustration' }}<small>{{ illustrations.length }} works</small></h2><a href="https://pixiv.me/tanfantazma" target="_blank" rel="noopener noreferrer">pixiv ↗</a></header><LatestIllustrations :limit="illustrations.length" /></section>
    <section id="links" class="section"><header class="section-head"><h2>{{ locale === 'ja' ? 'リンク' : 'Links' }}</h2></header><ExternalLinks /></section>
  </article>
</template>
<script setup lang="ts">
import { musicReleases } from '~/data/releases'
import { illustrations } from '~/data/illustrations'
const { locale } = useLocale()
const activeSection = ref('music')
let sectionObserver: IntersectionObserver | undefined
onMounted(() => {
  activeSection.value = ['music', 'games', 'art', 'links'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'music'
  sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    if (visible[0]) activeSection.value = visible[0].target.id
  }, { rootMargin: '-150px 0px -55% 0px' })
  for (const id of ['music', 'games', 'art', 'links']) {
    const section = document.getElementById(id)
    if (section) sectionObserver.observe(section)
  }
})
onUnmounted(() => sectionObserver?.disconnect())
useSeoMeta({
  title: () => (locale.value === 'ja' ? '作品' : 'Works') + ' — 針の筵',
  description: () => locale.value === 'ja' ? 'ネコノハの音楽、ゲーム、イラストの一覧。' : 'Music, games and illustration by Nekonoha.',
  ogUrl: 'https://nekonoha.github.io/works'
})
useHead({ link: [{ rel: 'canonical', href: 'https://nekonoha.github.io/works' }] })
</script>
<style scoped>
.works-nav { position: sticky; top: 100px; z-index: 30; display: flex; gap: 5px; width: max-content; max-width: 100%; margin-top: 48px; padding: 6px; overflow-x: auto; border: 1px solid var(--line); border-radius: 999px; background: color-mix(in srgb, var(--color-panel) 94%, transparent); backdrop-filter: blur(16px); box-shadow: 0 8px 24px #00000012; scrollbar-width: none; }
.works-nav::-webkit-scrollbar { display: none; }
.works-nav a { display: inline-flex; align-items: center; gap: 9px; min-height: 38px; padding: 7px 17px; border-radius: 999px; font-size: .8rem; text-decoration: none; white-space: nowrap; transition: background .2s, color .2s; }
.works-nav a:hover, .works-nav a:focus-visible { color: var(--color-accent); background: var(--color-surface); }
.works-nav a[aria-current="location"] { color: var(--color-panel); background: var(--color-accent); box-shadow: 0 3px 10px #00000016; }
.works-nav a[aria-current="location"] i { color: inherit; }
.works-nav i { color: var(--color-accent); font-size: .78rem; }
.section { scroll-margin-top: 170px; }
.works-nav + .section { margin-top: 48px; }
@media(max-width:760px) { .works-nav { top: 84px; width: 100%; gap: 0; margin-top: 32px; border-radius: 16px; } .works-nav a { flex: 1 1 0; justify-content: center; gap: 5px; min-width: 0; padding-inline: 5px; font-size: .72rem; } .section { scroll-margin-top: 150px; } }
@media(max-width:360px) { .works-nav i { display: none; } }
</style>

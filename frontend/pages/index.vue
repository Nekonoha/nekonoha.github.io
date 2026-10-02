<template>
  <div class="home page-wrap">
    <section class="hero" aria-labelledby="site-title">
      <div class="hero-copy">
        <h1 id="site-title">針の筵</h1>
        <p class="hero-romaji" lang="en">Hari no Mushiro</p>
        <p class="hero-description">{{ locale === 'ja' ? 'ネコノハの音楽・ゲーム・イラスト' : 'Music, games and illustration by Nekonoha' }}</p>
        <nav class="hero-nav" :aria-label="locale === 'ja' ? 'このページの目次' : 'On this page'">
          <a href="#music"><i class="fa-solid fa-music" aria-hidden="true"></i>{{ locale === 'ja' ? '音楽' : 'Music' }}</a>
          <a href="#games"><i class="fa-solid fa-gamepad" aria-hidden="true"></i>{{ locale === 'ja' ? 'ゲーム' : 'Games' }}</a>
          <a href="#art"><i class="fa-solid fa-paintbrush" aria-hidden="true"></i>{{ locale === 'ja' ? 'イラスト' : 'Art' }}</a>
          <a v-if="novels.length" href="#novels"><i class="fa-solid fa-book-open" aria-hidden="true"></i>{{ locale === 'ja' ? '小説' : 'Novels' }}</a>
        </nav>
      </div>
      <div v-if="latest" class="hero-release">
        <a class="hero-art" data-tilt :href="latest.linkcoreUrl + '?lang=' + locale" target="_blank" rel="noopener noreferrer" :aria-label="releaseTitle + (locale === 'ja' ? 'を聴く' : ' — Listen')">
          <img :src="latest.artwork" :alt="releaseTitle" width="800" height="800" fetchpriority="high">
        </a>
        <div class="hero-release-info">
          <div>
            <p class="hero-caption">{{ locale === 'ja' ? '最新リリース' : 'Latest release' }}<time :datetime="latest.releaseDate">{{ latest.releaseDate.replaceAll('-', '.') }}</time></p>
            <h2>{{ releaseTitle }}</h2>
          </div>
          <a class="pill pill-primary" :href="latest.linkcoreUrl + '?lang=' + locale" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-headphones ui-icon" aria-hidden="true"></i>{{ locale === 'ja' ? '配信で聴く' : 'Listen' }}<span class="ext" aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
    <section id="music" class="section">
      <header class="section-head"><h2>{{ locale === 'ja' ? '音楽' : 'Music' }}<small>{{ locale === 'ja' ? '新しい順' : 'Newest first' }}</small></h2><NuxtLink to="/works#music">{{ locale === 'ja' ? 'すべて見る' : 'View all' }}</NuxtLink></header>
      <LatestReleases />
    </section>
    <section id="games" class="section">
      <header class="section-head"><h2>{{ locale === 'ja' ? 'ゲーム' : 'Games' }}<small>{{ locale === 'ja' ? 'ゆめにっき二次創作' : 'Yume Nikki fan games' }}</small></h2></header>
      <GameWorks />
    </section>
    <section id="art" class="section">
      <header class="section-head"><h2>{{ locale === 'ja' ? 'イラスト' : 'Illustration' }}<small>{{ locale === 'ja' ? 'pixivの新着' : 'Latest on pixiv' }}</small></h2><NuxtLink to="/works#art">{{ locale === 'ja' ? 'すべて見る' : 'View all' }}</NuxtLink></header>
      <LatestIllustrations />
    </section>
    <section v-if="novels.length" id="novels" class="section">
      <header class="section-head"><h2>{{ locale === 'ja' ? '小説' : 'Novels' }}</h2><NuxtLink to="/novels">{{ locale === 'ja' ? 'すべて見る' : 'View all' }}</NuxtLink></header>
      <NovelList />
    </section>
    <section id="links" class="section links-section">
      <header class="section-head"><h2>{{ locale === 'ja' ? 'リンク' : 'Links' }}</h2></header>
      <ExternalLinks />
    </section>
  </div>
</template>
<script setup lang="ts">
import { musicReleases } from '~/data/releases'
const { locale } = useLocale()
const { novels } = useNovels()
const latest = musicReleases[0]
const releaseTitle = computed(() => latest ? (locale.value === 'ja' ? latest.title : latest.titleEn) : '')
useSeoMeta({
  title: '針の筵 — nekonoha',
  description: () => locale.value === 'ja' ? 'ネコノハの音楽・ゲーム・イラスト。最新リリースと公開作品。' : 'Music, games and illustration by Nekonoha. Latest releases and published works.',
  ogTitle: '針の筵 — nekonoha',
  ogUrl: 'https://nekonoha.github.io/'
})
</script>
<style scoped>
.home { padding-top: 56px; }
.hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 480px); gap: clamp(40px, 7vw, 104px); align-items: center; }
.hero-copy { animation: hero-in .7s var(--ease-out) both; }
h1 { font-size: clamp(4rem, 8.6vw, 7.6rem); font-weight: 800; line-height: 1.15; letter-spacing: -.02em; white-space: nowrap; }
.hero-romaji { margin-top: 10px; color: var(--color-text-muted); font-size: clamp(1rem, 1.6vw, 1.3rem); font-weight: 500; letter-spacing: .02em; }
.hero-description { margin-top: 36px; color: var(--color-sub); font-size: 1.05rem; }
/* Section shortcuts: large, obvious targets. */
.hero-nav { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
.hero-nav a { display: inline-flex; align-items: center; gap: 10px; min-height: 48px; padding: 10px 22px; border: 1px solid var(--line); border-radius: var(--radius-pill); background: var(--color-panel); font-size: .95rem; font-weight: 500; text-decoration: none; transition: border-color var(--dur-fast), color var(--dur-fast), background var(--dur-fast), transform var(--dur-base) var(--ease-out); }
.hero-nav i { color: var(--color-accent); font-size: .9em; }
.hero-nav a:hover { border-color: var(--color-accent); color: var(--color-accent); transform: translateY(-2px); }

.hero-release { animation: hero-in .8s var(--ease-out) .12s both; }
/* The jacket leans slightly toward the pointer and settles back. */
.hero-art { display: block; aspect-ratio: 1; box-shadow: var(--shadow-strong); transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transition: transform .5s var(--ease-out); }
.hero-art.is-tilting { transition: transform .15s linear; }
.hero-art img { width: 100%; height: 100%; object-fit: cover; }
.hero-release-info { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-top: 18px; }
.hero-caption { color: var(--color-text-muted); font-size: .8125rem; }
.hero-caption time { margin-left: 12px; font-variant-numeric: tabular-nums; }
.hero-release h2 { font-size: 1.25rem; font-weight: 700; line-height: 1.5; }
.hero-release .pill { flex-shrink: 0; min-height: 46px; padding-inline: 22px; font-size: .9rem; }

@keyframes hero-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

@media(max-width:860px) {
  .home { padding-top: 28px; }
  .hero { grid-template-columns: 1fr; gap: 36px; }
  h1 { font-size: clamp(3.6rem, 18vw, 6rem); }
  .hero-description { margin-top: 22px; font-size: 1rem; }
  .hero-nav { gap: 8px; margin-top: 16px; }
  .hero-nav a { flex: 1 1 40%; justify-content: center; gap: 8px; padding-inline: 10px; white-space: nowrap; }
}
</style>

<template>
  <div class="home page-wrap">
    <section class="hero" aria-labelledby="site-title">
      <div class="hero-copy">
        <p class="eyebrow">NEKONOHA</p>
        <h1 id="site-title">針の筵<span>Hari no Mushiro</span></h1>
        <p class="hero-description">{{ locale === 'ja' ? '音楽・ゲーム・イラスト' : 'Music, games & illustration' }}</p>
        <div class="hero-nav">
          <a href="#music"><span><i class="fa-solid fa-music ui-icon" aria-hidden="true"></i>{{ locale === 'ja' ? '音楽' : 'Music' }}</span><i class="fa-solid fa-arrow-down nav-arrow" aria-hidden="true"></i></a>
          <a href="#games"><span><i class="fa-solid fa-gamepad ui-icon" aria-hidden="true"></i>{{ locale === 'ja' ? 'ゲーム' : 'Games' }}</span><i class="fa-solid fa-arrow-down nav-arrow" aria-hidden="true"></i></a>
          <a href="#art"><span><i class="fa-solid fa-paintbrush ui-icon" aria-hidden="true"></i>{{ locale === 'ja' ? 'イラスト' : 'Art' }}</span><i class="fa-solid fa-arrow-down nav-arrow" aria-hidden="true"></i></a>
        </div>
      </div>
      <div v-if="latest" class="hero-release">
        <a class="hero-art" :href="latest.linkcoreUrl + '?lang=' + locale" target="_blank" rel="noopener noreferrer">
          <img :src="latest.artwork" :alt="releaseTitle" width="800" height="800" fetchpriority="high">
          <span class="listen-label"><i class="fa-solid fa-headphones ui-icon" aria-hidden="true"></i>{{ locale === 'ja' ? '聴く' : 'Listen' }} ↗</span>
        </a>
        <div class="hero-caption"><p class="eyebrow">LATEST RELEASE</p><time :datetime="latest.releaseDate">{{ latest.releaseDate.replaceAll('-', '.') }}</time></div>
        <h2><a :href="latest.linkcoreUrl + '?lang=' + locale" target="_blank" rel="noopener noreferrer">{{ releaseTitle }}</a></h2>
      </div>
    </section>
    <section id="music" class="section">
      <header class="section-head"><h2><i class="fa-solid fa-music ui-icon" aria-hidden="true"></i>{{ locale === 'ja' ? '音楽' : 'Music' }}<small>Releases</small></h2><NuxtLink to="/works#music">{{ locale === 'ja' ? 'すべてのリリース' : 'All releases' }} ↗</NuxtLink></header>
      <LatestReleases />
    </section>
    <section id="games" class="section">
      <header class="section-head"><h2><i class="fa-solid fa-gamepad ui-icon" aria-hidden="true"></i>{{ locale === 'ja' ? 'ゲーム' : 'Games' }}<small>Yume Nikki fan games</small></h2></header>
      <GameWorks />
    </section>
    <section id="art" class="section">
      <header class="section-head"><h2><i class="fa-solid fa-paintbrush ui-icon" aria-hidden="true"></i>{{ locale === 'ja' ? 'イラスト' : 'Illustration' }}<small>Latest on pixiv</small></h2><NuxtLink to="/works#art">{{ locale === 'ja' ? 'すべて見る' : 'View all' }} ↗</NuxtLink></header>
      <LatestIllustrations />
    </section>
    <section id="links" class="section links-section">
      <header class="section-head"><h2><i class="fa-solid fa-link ui-icon" aria-hidden="true"></i>{{ locale === 'ja' ? 'リンク' : 'Links' }}</h2></header>
      <ExternalLinks />
    </section>
  </div>
</template>
<script setup lang="ts">
import { musicReleases } from '~/data/releases'
const { locale } = useLocale()
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
.home { padding-top: 52px; }
.hero { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(48px,8vw,120px); align-items: center; }
.hero-copy { padding-block: 40px; }
.hero-copy > .eyebrow { margin-bottom: 36px; color: var(--color-text); letter-spacing: .2em; }
h1 { font-family: var(--font-sans); font-size: clamp(4.6rem,9vw,9rem); font-weight: 700; line-height: 1.25; letter-spacing: -.06em; white-space: nowrap; }
h1 span { display: block; margin-top: 16px; font-family: var(--font-sans); font-weight: 500; font-size: clamp(1rem,2vw,1.7rem); line-height: 1.5; letter-spacing: -.015em; }
.hero-description { margin-top: 48px; font-size: .9rem; color: var(--color-text-muted); }
.hero-nav { max-width: 340px; margin-top: 36px; }
.hero-nav a { display: flex; justify-content: space-between; gap: 20px; padding: 14px 0; border-bottom: 1px solid var(--line); font-size: .8rem; text-decoration: none; }
.hero-nav a:hover { color: var(--color-accent); border-color: var(--color-accent); }
.hero-art { position: relative; display: block; overflow: hidden; aspect-ratio: 1; background: var(--color-surface); }
.hero-art img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.hero-art:hover img { transform: scale(1.025); }
.listen-label { position: absolute; bottom: 20px; right: 20px; padding: 12px 24px; background: var(--color-main); font-size: .8rem; }
.hero-caption { display: flex; justify-content: space-between; gap: 16px; margin-top: 20px; }
.hero-caption .eyebrow, time { font-size: .68rem; color: var(--color-text-muted); }
h2 { margin-top: 8px; font-size: 1.05rem; font-weight: 500; line-height: 1.65; }
h2 a { text-decoration: none; } h2 a:hover { text-decoration: underline; }
@media(max-width:760px) { .home { padding-top: 28px; } .hero { grid-template-columns: 1fr; gap: 40px; } .hero-copy { padding-block: 10px 0; } .hero-copy > .eyebrow { margin-bottom: 18px; } h1 { font-size: clamp(4.8rem,19vw,8rem); } .hero-description { margin-top: 28px; } .hero-nav { display: flex; max-width: none; gap: 22px; margin-top: 16px; } .hero-nav a { flex: 1; gap: 12px; white-space: nowrap; font-size: .7rem; } }
@media(max-width:360px) { .hero-nav { gap: 14px; } .hero-nav a { gap: 6px; } }
@media(max-width:600px) { .hero-nav { gap: 12px; } .hero-nav a { gap: 0; } .nav-arrow { display: none; } .hero-nav .ui-icon { margin-inline-end: .35em; } }
</style>

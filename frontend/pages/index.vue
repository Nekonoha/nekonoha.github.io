<template>
  <div class="home page-wrap">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">NEKONOHA / PERSONAL ARCHIVE</p>
        <h1>{{ t('index.title') }}</h1>
        <p class="hero-lead">{{ t('index.subtitle') }}</p>
        <p class="hero-note">{{ locale === 'ja' ? '音楽を作ったり、ゲームを作ったり、絵を描いたり。ここはそんなものを置いておく場所です。' : 'Music, games, drawings, and whatever comes next. This is where I leave the things I make.' }}</p>
        <div class="hero-actions">
          <a href="#latest">{{ locale === 'ja' ? '最新作を聴く' : 'Listen now' }} <span>↓</span></a>
          <NuxtLink to="/works">{{ locale === 'ja' ? '制作物一覧' : 'All works' }} <span>→</span></NuxtLink>
        </div>
      </div>
      <div class="hero-index mono" aria-hidden="true">
        <span>CREATIVE LOG</span><strong>{{ locale === 'ja' ? '音 / 遊 / 絵' : 'SOUND / PLAY / ART' }}</strong><small>TOKYO — JP</small>
      </div>
    </section>

    <section id="latest" class="latest">
      <header class="section-title">
        <div><p class="eyebrow">NEW RELEASES</p><h2>{{ locale === 'ja' ? '最近の音楽' : 'Latest music' }}</h2></div>
        <div class="section-side"><p>{{ locale === 'ja' ? '新しいものから3つ。ここでそのまま聴けます。' : 'The latest three, ready to play here.' }}</p><a :href="tuneCoreUrl" target="_blank" rel="noopener noreferrer">TuneCore ↗</a></div>
      </header>
      <LatestReleases />
    </section>

    <section class="featured">
      <header class="section-title">
        <div><p class="eyebrow">SELECTED WORKS</p><h2>{{ locale === 'ja' ? '遊べる作品' : 'Games to explore' }}</h2></div>
        <NuxtLink to="/works">{{ locale === 'ja' ? 'すべて見る' : 'View all' }} →</NuxtLink>
      </header>
      <div class="work-grid">
        <NuxtLink to="/trial" class="work-tile"><img src="/images/trial/5.png" alt="TRIAL screenshot"><div><span class="mono">FAN GAME / 01</span><h3>TRIAL</h3><p>{{ t('trial.description') }}</p></div><b>→</b></NuxtLink>
        <NuxtLink to="/unrequited" class="work-tile"><img src="/images/unrequited/3.png" alt="UnRequited screenshot"><div><span class="mono">FAN GAME / 02</span><h3>UnRequited</h3><p>{{ t('unrequited.description') }}</p></div><b>→</b></NuxtLink>
      </div>
    </section>

    <section class="links-strip" aria-label="External links">
      <a href="https://pixiv.me/tanfantazma" target="_blank" rel="noopener noreferrer"><span class="mono">ILLUSTRATION</span><strong>pixiv</strong><b>↗</b></a>
      <a href="https://tanfantazma.booth.pm/" target="_blank" rel="noopener noreferrer"><span class="mono">SHOP</span><strong>BOOTH</strong><b>↗</b></a>
      <a href="http://nekonoha.hatenablog.com/" target="_blank" rel="noopener noreferrer"><span class="mono">JOURNAL</span><strong>Blog</strong><b>↗</b></a>
      <a href="https://twitter.com/tan_fantazma" target="_blank" rel="noopener noreferrer"><span class="mono">UPDATES</span><strong>Twitter / X</strong><b>↗</b></a>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useLocale()
const tuneCoreUrl = computed(() => `https://www.tunecore.co.jp/artists/nekonoha?lang=${locale.value}`)
useSeoMeta(() => ({
  title: locale.value === 'ja' ? '針の筵 - nekonoha' : 'Hari no Mushiro - nekonoha',
  description: locale.value === 'ja' ? 'ネコノハの個人制作サイト。音楽、ゲーム、イラストなどの制作物をまとめています。' : 'Nekonoha’s personal site for music, games, illustrations, and other things I make.',
  ogTitle: locale.value === 'ja' ? '針の筵 - nekonoha' : 'Hari no Mushiro - nekonoha',
  ogDescription: locale.value === 'ja' ? '音楽、ゲーム、イラストなどの個人制作アーカイブ。' : 'A personal archive of music, games, illustrations, and more.',
  ogUrl: 'https://nekonoha.github.io/',
  twitterCard: 'summary_large_image'
}))
</script>

<style scoped>
.home { max-width: 1120px; }
.hero { display: grid; min-height: 690px; padding: 64px 0 110px; align-items: center; grid-template-columns: 1fr auto; gap: 60px; }
.hero h1 { margin: 22px 0 24px; font-size: clamp(5rem, 14vw, 11rem); font-weight: 800; line-height: .78; letter-spacing: -.085em; }
.hero-lead { color: white; font-size: clamp(1.2rem, 2.2vw, 1.65rem); font-weight: 650; }
.hero-note { max-width: 570px; margin-top: 15px; color: var(--color-text-muted); }
.hero-actions { display: flex; margin-top: 38px; flex-wrap: wrap; gap: 10px; }
.hero-actions a { display: flex; min-width: 175px; padding: 14px 17px; justify-content: space-between; border: 1px solid rgba(255,255,255,.13); border-radius: 999px; text-decoration: none; font-size: .78rem; font-weight: 700; }
.hero-actions a:first-child { color: #170810; border-color: var(--color-accent); background: var(--color-accent); }
.hero-actions a:hover { transform: translateY(-2px); }
.hero-index { display: flex; width: 158px; height: 270px; padding: 20px; justify-content: space-between; border-left: 1px solid rgba(255,255,255,.15); color: #777d88; writing-mode: vertical-rl; font-size: .58rem; letter-spacing: .12em; }
.hero-index strong { color: #daddE3; font-size: .72rem; font-weight: 500; }
.latest, .featured { padding: 100px 0; border-top: 1px solid rgba(255,255,255,.09); scroll-margin-top: 100px; }
.section-title { display: flex; margin-bottom: 38px; align-items: end; justify-content: space-between; gap: 30px; }
.section-title h2 { margin-top: 14px; font-size: clamp(2.4rem, 5vw, 4.8rem); line-height: .95; letter-spacing: -.06em; }
.section-title > a, .section-side { color: var(--color-text-muted); font-size: .75rem; }
.section-title a { text-decoration: none; }
.section-title a:hover { color: var(--color-accent); }
.section-side { text-align: right; }
.section-side a { display: inline-block; margin-top: 5px; color: #e5e7eb; font-weight: 700; }
.work-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.work-tile { position: relative; display: grid; min-height: 390px; overflow: hidden; border: 1px solid rgba(255,255,255,.1); border-radius: 24px; background: #11141a; text-decoration: none; }
.work-tile img { width: 100%; height: 235px; object-fit: cover; filter: saturate(.65) brightness(.8); transition: .4s; }
.work-tile div { padding: 22px 24px; }
.work-tile span { color: var(--color-accent); font-size: .6rem; letter-spacing: .1em; }
.work-tile h3 { margin: 5px 0; font-size: 2rem; letter-spacing: -.045em; }
.work-tile p { color: var(--color-text-muted); font-size: .76rem; }
.work-tile b { position: absolute; right: 24px; bottom: 27px; color: var(--color-accent); }
.work-tile:hover { border-color: rgba(255,111,175,.55); transform: translateY(-3px); }
.work-tile:hover img { filter: saturate(1) brightness(.95); transform: scale(1.02); }
.links-strip { display: grid; margin-top: 20px; border-top: 1px solid rgba(255,255,255,.1); grid-template-columns: repeat(4, 1fr); }
.links-strip a { display: grid; min-height: 120px; padding: 22px 14px; border-right: 1px solid rgba(255,255,255,.1); border-bottom: 1px solid rgba(255,255,255,.1); text-decoration: none; grid-template-columns: 1fr auto; }
.links-strip a:first-child { border-left: 1px solid rgba(255,255,255,.1); }
.links-strip span { grid-column: 1 / -1; color: #737985; font-size: .56rem; letter-spacing: .12em; }
.links-strip strong { align-self: end; font-size: 1rem; }
.links-strip b { align-self: end; color: var(--color-accent); }
.links-strip a:hover { background: rgba(255,255,255,.03); }
@media (max-width: 760px) { .hero { min-height: 610px; padding-top: 45px; grid-template-columns: 1fr; } .hero-index { display: none; } .hero h1 { font-size: clamp(4.8rem, 24vw, 8rem); } .section-title { align-items: flex-start; flex-direction: column; } .section-side { text-align: left; } .work-grid { grid-template-columns: 1fr; } .links-strip { grid-template-columns: 1fr 1fr; } .links-strip a:nth-child(3) { border-left: 1px solid rgba(255,255,255,.1); } }
@media (max-width: 460px) { .links-strip { grid-template-columns: 1fr; } .links-strip a { border-left: 1px solid rgba(255,255,255,.1); } }
</style>

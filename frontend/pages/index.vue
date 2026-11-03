<template>
  <div class="home page-wrap">
    <section class="hero" aria-labelledby="site-title">
      <div class="hero-copy">
        <h1 id="site-title">針の筵</h1>
        <p class="hero-romaji" lang="en">Hari no Mushiro</p>
        <p class="hero-description">{{ locale === 'ja' ? 'ネコノハの音楽・ゲーム・イラスト' : 'Music, games and illustration by Nekonoha' }}</p>
        <nav class="hero-nav" :aria-label="locale === 'ja' ? 'このページの目次' : 'On this page'">
          <a v-if="boothItems.length" href="#shop"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>{{ locale === 'ja' ? 'ショップ' : 'Shop' }}</a>
          <a href="#music"><i class="fa-solid fa-music" aria-hidden="true"></i>{{ locale === 'ja' ? '音楽' : 'Music' }}</a>
          <a href="#games"><i class="fa-solid fa-gamepad" aria-hidden="true"></i>{{ locale === 'ja' ? 'ゲーム' : 'Games' }}</a>
          <a href="#art"><i class="fa-solid fa-paintbrush" aria-hidden="true"></i>{{ locale === 'ja' ? 'イラスト' : 'Art' }}</a>
          <a v-if="novels.length" href="#novels"><i class="fa-solid fa-book-open" aria-hidden="true"></i>{{ locale === 'ja' ? '小説' : 'Novels' }}</a>
        </nav>
      </div>
      <!-- 音楽・ショップ・イラスト・小説のうち、いちばん新しい更新 -->
      <div v-if="featured" class="hero-release">
        <NuxtLink class="hero-art" :class="{ 'text-art': !featured.image }" data-tilt :to="featured.href" :target="featured.external ? '_blank' : undefined" :rel="featured.external ? 'noopener noreferrer' : undefined" :aria-label="`${featured.title} — ${action(featured.kind)}`">
          <img v-if="featured.image" :src="featured.image" :alt="featured.title" width="800" height="800" fetchpriority="high">
          <span v-else class="text-art-body"><i :class="['fa-solid', kinds[featured.kind].icon]" aria-hidden="true"></i><strong>{{ featured.title }}</strong><span v-if="featured.note">{{ featured.note }}</span></span>
        </NuxtLink>
        <div class="hero-release-info">
          <div>
            <p class="hero-caption">{{ locale === 'ja' ? '最新の更新' : 'Latest update' }}<span class="kind-tag"><i :class="['fa-solid', kinds[featured.kind].icon]" aria-hidden="true"></i>{{ label(featured.kind) }}</span><time :datetime="featured.date">{{ dayOf(featured.date) }}</time></p>
            <h2>{{ featured.kind === 'novel' && featured.note ? featured.note : featured.title }}</h2>
          </div>
          <NuxtLink class="pill pill-primary" :to="featured.href" :target="featured.external ? '_blank' : undefined" :rel="featured.external ? 'noopener noreferrer' : undefined"><i :class="['fa-solid', kinds[featured.kind].actionIcon, 'ui-icon']" aria-hidden="true"></i>{{ action(featured.kind) }}<span v-if="featured.external" class="ext" aria-hidden="true">↗</span></NuxtLink>
        </div>
      </div>
    </section>
    <!-- ほかのジャンルの最新を1件ずつ -->
    <section v-if="others.length" id="updates" class="section">
      <header class="section-head"><h2>{{ locale === 'ja' ? '新着' : "What's new" }}<small>{{ locale === 'ja' ? 'ジャンルごとの最新' : 'Latest in each category' }}</small></h2></header>
      <ol class="update-list">
        <li v-for="item in others" :key="item.kind">
          <NuxtLink class="update-row" :to="item.href" :target="item.external ? '_blank' : undefined" :rel="item.external ? 'noopener noreferrer' : undefined">
            <span class="update-thumb"><img v-if="item.image" :src="item.image" alt="" width="144" height="144" loading="lazy"><i v-else :class="['fa-solid', kinds[item.kind].icon]" aria-hidden="true"></i></span>
            <span class="update-body">
              <span class="update-meta"><span class="kind-tag"><i :class="['fa-solid', kinds[item.kind].icon]" aria-hidden="true"></i>{{ label(item.kind) }}</span><time :datetime="item.date">{{ dayOf(item.date) }}</time></span>
              <strong>{{ item.title }}</strong>
              <small v-if="item.note">{{ item.note }}</small>
            </span>
            <span class="update-go" aria-hidden="true"><template v-if="item.external">↗</template><i v-else class="fa-solid fa-arrow-right"></i></span>
          </NuxtLink>
        </li>
      </ol>
    </section>
    <section v-if="boothItems.length" id="shop" class="section">
      <header class="section-head"><h2>{{ locale === 'ja' ? 'ショップ' : 'Shop' }}<small>{{ locale === 'ja' ? 'BOOTHの新着' : 'Latest on BOOTH' }}</small></h2><NuxtLink to="/works#shop">{{ locale === 'ja' ? 'すべて見る' : 'View all' }}</NuxtLink></header>
      <LatestGoods />
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
import { boothItems } from '~/data/booth'
import { illustrations } from '~/data/illustrations'
import { buildUpdates, dayOf } from '~/utils/updates.mjs'

type Kind = 'music' | 'shop' | 'art' | 'novel'
type Update = { kind: Kind; id: string; date: string; title: string; note: string; image: string | null; href: string; external: boolean }

const { locale } = useLocale()
const { novels } = useNovels()
// 小説の最新話の日付は、ビルド時に git の記録から読んだもの（nuxt.config.ts）。
const novelUpdates = (useRuntimeConfig().public.novelUpdates ?? {}) as Record<string, { date: string; number: number; title: string }>

const kinds: Record<Kind, { ja: string; en: string; icon: string; actionJa: string; actionEn: string; actionIcon: string }> = {
  shop: { ja: 'ショップ', en: 'Shop', icon: 'fa-bag-shopping', actionJa: 'BOOTHで見る', actionEn: 'View on BOOTH', actionIcon: 'fa-bag-shopping' },
  music: { ja: '音楽', en: 'Music', icon: 'fa-music', actionJa: '配信で聴く', actionEn: 'Listen', actionIcon: 'fa-headphones' },
  art: { ja: 'イラスト', en: 'Illustration', icon: 'fa-paintbrush', actionJa: 'pixivで見る', actionEn: 'View on pixiv', actionIcon: 'fa-image' },
  novel: { ja: '小説', en: 'Novel', icon: 'fa-book-open', actionJa: '読む', actionEn: 'Read', actionIcon: 'fa-book-open' }
}
const label = (kind: Kind) => locale.value === 'ja' ? kinds[kind].ja : kinds[kind].en
const action = (kind: Kind) => locale.value === 'ja' ? kinds[kind].actionJa : kinds[kind].actionEn

const updates = computed(() => buildUpdates({
  releases: musicReleases,
  goods: boothItems,
  illustrations,
  novels: novels.filter(novel => !novel.draft).map(novel => ({ slug: novel.slug, title: novel.title, update: novelUpdates[novel.slug] }))
}, locale.value) as Update[])
const featured = computed(() => updates.value[0])
const others = computed(() => updates.value.slice(1))

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
.hero-caption { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; color: var(--color-text-muted); font-size: .8125rem; }
.hero-caption time { font-variant-numeric: tabular-nums; }
/* ジャンルの小さな札。「最新の更新」と「新着」で共通。 */
.kind-tag { display: inline-flex; align-items: center; gap: 6px; padding: 1px 10px; border: 1px solid var(--line); border-radius: var(--radius-pill); color: var(--color-text); font-size: .75rem; font-weight: 500; }
.kind-tag i { color: var(--color-accent); font-size: .85em; }
/* 画像のない更新（小説）は、題名を大きく組んだ札にする。 */
.hero-art.text-art { display: grid; place-items: center; padding: clamp(28px, 5vw, 48px); color: var(--color-text); background: linear-gradient(155deg, var(--color-surface), var(--color-panel)); text-decoration: none; }
.text-art-body { display: grid; gap: 16px; width: 100%; }
.text-art-body i { color: var(--color-accent); font-size: 1.8rem; }
.text-art-body strong { font-size: clamp(1.6rem, 3.2vw, 2.3rem); font-weight: 800; line-height: 1.35; }
.text-art-body span { color: var(--color-text-muted); font-size: 1rem; }
.hero-release h2 { font-size: 1.25rem; font-weight: 700; line-height: 1.5; }
.hero-release .pill { flex-shrink: 0; min-height: 46px; padding-inline: 22px; font-size: .9rem; }

/* 新着：ほかのジャンルの最新を横に並べる（狭い画面では縦に）。 */
.update-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; list-style: none; }
.update-row { display: flex; align-items: center; gap: 14px; height: 100%; min-height: 96px; padding: 12px 16px 12px 12px; border: 1px solid var(--line); border-radius: var(--radius-media); background: var(--color-panel); text-decoration: none; transition: border-color var(--dur-fast), transform var(--dur-base) var(--ease-out); }
.update-row:hover { border-color: var(--color-accent); transform: translateY(-2px); }
.update-thumb { display: grid; flex-shrink: 0; place-items: center; width: 72px; height: 72px; overflow: hidden; border-radius: 10px; color: var(--color-accent); background: var(--color-surface); font-size: 1.4rem; }
.update-thumb img { width: 100%; height: 100%; object-fit: cover; }
.update-body { display: grid; flex: 1; gap: 4px; min-width: 0; }
.update-meta { display: flex; align-items: center; gap: 8px; color: var(--color-text-muted); font-size: .75rem; font-variant-numeric: tabular-nums; }
.update-body strong { overflow: hidden; font-size: .95rem; font-weight: 700; line-height: 1.45; text-overflow: ellipsis; white-space: nowrap; }
.update-body small { overflow: hidden; color: var(--color-text-muted); font-size: .8125rem; text-overflow: ellipsis; white-space: nowrap; }
.update-go { flex-shrink: 0; color: var(--color-text-muted); transition: color var(--dur-fast), transform var(--dur-base) var(--ease-out); }
.update-row:hover .update-go { color: var(--color-accent); transform: translateX(3px); }

@keyframes hero-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

@media(max-width:860px) {
  .home { padding-top: 28px; }
  .hero { grid-template-columns: 1fr; gap: 36px; }
  h1 { font-size: clamp(3.6rem, 18vw, 6rem); }
  .hero-description { margin-top: 22px; font-size: 1rem; }
  .hero-nav { gap: 8px; margin-top: 16px; }
  .hero-nav a { flex: 1 1 30%; justify-content: center; gap: 8px; padding-inline: 10px; white-space: nowrap; }
  .hero-release-info { flex-direction: column; align-items: stretch; gap: 14px; }
  .hero-release .pill { width: 100%; }
}
</style>

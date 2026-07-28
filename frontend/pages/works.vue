<template>
  <article class="works page-wrap">
    <header class="works-head">
      <div>
        <p class="eyebrow">{{ locale === 'ja' ? '制作物' : 'WORKS' }}</p>
        <h1 class="display-title">WORKS.</h1>
      </div>
      <p class="lead">
        {{ locale === 'ja'
          ? '趣味で制作した音楽、イラスト、ゲームをまとめています。'
          : 'Music, illustrations, and games made in my spare time.' }}
      </p>
    </header>

    <section class="category" aria-labelledby="published-heading">
      <header class="category-head">
        <span class="mono">01</span>
        <div>
          <h2 id="published-heading">{{ locale === 'ja' ? '公開している制作物' : 'PUBLISHED WORKS' }}</h2>
          <p>{{ locale === 'ja' ? '音楽、イラスト、販売物など。' : 'Music, illustrations, items, and more.' }}</p>
        </div>
      </header>

      <div class="card-grid">
        <a class="work-card music-card" href="https://www.tunecore.co.jp/artists/nekonoha" target="_blank" rel="noopener noreferrer">
          <div class="card-visual icon-visual"><i class="fas fa-wave-square" aria-hidden="true"></i></div>
          <div class="card-body">
            <div class="card-label mono"><span>MUSIC</span><b>{{ locale === 'ja' ? '外部サイト' : 'EXTERNAL' }} ↗</b></div>
            <h3>TuneCore</h3>
            <p>{{ t('works.musicDescription') }}</p>
          </div>
        </a>

        <a class="work-card pixiv-card" href="https://pixiv.me/tanfantazma" target="_blank" rel="noopener noreferrer">
          <div class="card-visual icon-visual"><i class="fa-brands fa-pixiv" aria-hidden="true"></i></div>
          <div class="card-body">
            <div class="card-label mono"><span>ILLUSTRATION</span><b>{{ locale === 'ja' ? '外部サイト' : 'EXTERNAL' }} ↗</b></div>
            <h3>pixiv</h3>
            <p>{{ locale === 'ja' ? 'イラストや漫画を投稿しています。' : 'Illustrations and manga.' }}</p>
          </div>
        </a>

        <a class="work-card booth-card" href="https://tanfantazma.booth.pm/" target="_blank" rel="noopener noreferrer">
          <div class="card-visual icon-visual"><i class="fas fa-bag-shopping" aria-hidden="true"></i></div>
          <div class="card-body">
            <div class="card-label mono"><span>SHOP / ITEMS</span><b>{{ locale === 'ja' ? '外部サイト' : 'EXTERNAL' }} ↗</b></div>
            <h3>BOOTH</h3>
            <p>{{ locale === 'ja' ? '同人作品などの販売ページです。' : 'Items and independent releases.' }}</p>
          </div>
        </a>
      </div>
    </section>

    <section class="category fan-games" aria-labelledby="fan-games-heading">
      <header class="category-head">
        <span class="mono">02</span>
        <div>
          <h2 id="fan-games-heading">{{ locale === 'ja' ? 'ファンゲーム' : 'FAN GAMES' }}</h2>
          <p>{{ locale === 'ja' ? '「ゆめにっき」の二次創作ゲームです。' : 'Fan games based on Yume Nikki.' }}</p>
        </div>
      </header>

      <div class="card-grid">
        <NuxtLink class="work-card" to="/trial">
          <div class="card-visual image-visual"><img src="/images/trial/5.png" alt="TRIAL screenshot"></div>
          <div class="card-body">
            <div class="card-label mono"><span>FAN GAME / RPG</span><b>{{ locale === 'ja' ? '詳細' : 'DETAILS' }} →</b></div>
            <h3>TRIAL</h3>
            <p>{{ t('trial.description') }}</p>
          </div>
        </NuxtLink>

        <NuxtLink class="work-card" to="/unrequited">
          <div class="card-visual image-visual"><img src="/images/unrequited/3.png" alt="UnRequited screenshot"></div>
          <div class="card-body">
            <div class="card-label mono"><span>FAN GAME / RPG</span><b>{{ locale === 'ja' ? '詳細' : 'DETAILS' }} →</b></div>
            <h3>UnRequited</h3>
            <p>{{ t('unrequited.description') }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <aside class="links-note">
      <i class="fas fa-link" aria-hidden="true"></i>
      <p>
        {{ locale === 'ja'
          ? 'Blog、Twitterなどの活動先は、ヘッダーの「リンク」から確認できます。'
          : 'Find Blog, Twitter, and other profiles under “Links” in the header.' }}
      </p>
    </aside>
  </article>
</template>

<script setup lang="ts">
const { t, locale } = useLocale()
useSeoMeta({
  title: 'WORKS - 針の筵',
  description: 'ネコノハが制作した音楽、イラスト、同人作品、ファンゲームの一覧です。',
  ogTitle: 'WORKS - 針の筵',
  ogDescription: '音楽、イラスト、販売物、ファンゲームなどの制作物。',
  ogUrl: 'https://nekonoha.github.io/works'
})
useHead({ link: [{ rel: 'canonical', href: 'https://nekonoha.github.io/works' }] })
</script>

<style scoped>
.works { max-width: 1080px; }
.works-head { display: grid; padding: 28px 0 96px; align-items: end; grid-template-columns: 1.15fr .85fr; gap: 50px; }
.works-head .lead { padding-bottom: 10px; }
.category { margin-top: 100px; }
.category:first-of-type { margin-top: 0; }
.category-head { display: grid; margin-bottom: 24px; grid-template-columns: 45px 1fr; gap: 16px; align-items: start; }
.category-head > span { padding-top: 4px; color: var(--color-accent); font-size: .62rem; }
.category-head h2 { font-size: 1rem; letter-spacing: .08em; }
.category-head p { margin-top: 5px; color: var(--color-text-muted); font-size: .76rem; }
.card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.fan-games .card-grid { grid-template-columns: 1fr 1fr; }
.work-card { overflow: hidden; border: 1px solid rgba(255,255,255,.1); border-radius: 20px; color: var(--color-text); background: rgba(15,18,24,.78); text-decoration: none; transition: transform .25s ease, border-color .25s ease, background .25s ease; }
.work-card:hover { border-color: rgba(255,111,175,.55); background: rgba(20,22,29,.94); transform: translateY(-3px); }
.card-visual { display: grid; width: 100%; aspect-ratio: 16 / 9; place-items: center; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,.08); }
.icon-visual { color: #090a0d; background: var(--color-accent); font-size: clamp(2.5rem, 6vw, 4.7rem); }
.pixiv-card .icon-visual { color: var(--color-accent); background: linear-gradient(145deg, rgba(255,111,175,.16), rgba(177,69,255,.08)); }
.booth-card .icon-visual { color: #ffd8e9; background: linear-gradient(145deg, #9d315e, #40162b); }
.image-visual img { width: 100%; height: 100%; object-fit: cover; filter: saturate(.72); transition: transform .55s ease, filter .35s ease; }
.work-card:hover .image-visual img { transform: scale(1.035); filter: saturate(1); }
.card-body { min-height: 185px; padding: 24px; }
.card-label { display: flex; align-items: center; justify-content: space-between; color: var(--color-accent); font-size: .58rem; letter-spacing: .09em; }
.card-label b { color: #858b96; font-weight: 500; }
.work-card:hover .card-label b { color: var(--color-accent); }
.card-body h3 { margin: 14px 0 7px; font-size: clamp(1.8rem, 3.5vw, 2.8rem); line-height: 1; letter-spacing: -.05em; }
.card-body p { color: var(--color-text-muted); font-size: .8rem; }
.links-note { display: flex; margin-top: 90px; padding: 20px 22px; align-items: center; border: 1px solid rgba(255,255,255,.08); border-radius: 14px; color: var(--color-text-muted); background: rgba(255,255,255,.02); gap: 14px; }
.links-note i { color: var(--color-accent); }
.links-note p { font-size: .76rem; }
@media (max-width: 980px) {
  .card-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 720px) {
  .works-head { padding-bottom: 68px; grid-template-columns: 1fr; gap: 26px; }
  .category { margin-top: 76px; }
  .card-grid { grid-template-columns: 1fr; }
  .fan-games .card-grid { grid-template-columns: 1fr; }
  .card-body { min-height: 0; }
}
</style>

<template>
  <div class="home page-wrap">
    <section class="intro">
      <div class="intro-copy">
        <p class="eyebrow">{{ locale === 'ja' ? 'ネコノハの個人サイト' : 'NEKONOHA’S PERSONAL WEBSITE' }}</p>
        <h1>{{ t('index.title') }}</h1>
        <p class="lead">{{ t('index.subtitle') }}</p>
        <p class="note">
          {{ locale === 'ja'
            ? 'ゲーム、イラスト、音楽など、趣味で作ったものを置いています。'
            : 'A place for games, illustrations, music, and other things I make for fun.' }}
        </p>
        <div class="intro-links">
          <NuxtLink to="/works">{{ locale === 'ja' ? '制作物を見る' : 'View works' }} <span>→</span></NuxtLink>
          <NuxtLink to="/about">{{ locale === 'ja' ? 'プロフィール' : 'About' }} <span>→</span></NuxtLink>
        </div>
      </div>

      <div class="portrait-wrap">
        <div class="portrait">
          <img src="/images/iconnn.png" :alt="locale === 'ja' ? 'ネコノハのアイコン' : 'Nekonoha icon'">
        </div>
        <p class="portrait-caption mono">NEKONOHA / PERSONAL WEBSITE</p>
      </div>
    </section>

    <section class="places">
      <header class="section-title">
        <div>
          <p class="eyebrow">{{ locale === 'ja' ? '主なリンク' : 'FIND ME ONLINE' }}</p>
          <h2>{{ locale === 'ja' ? '音楽とイラスト' : 'Music & illustration' }}</h2>
        </div>
        <p>{{ locale === 'ja' ? '外部サイトで公開しているもの。' : 'Things published on other platforms.' }}</p>
      </header>

      <div class="place-grid">
        <a class="place-card music" href="https://www.tunecore.co.jp/artists/nekonoha" target="_blank" rel="noopener noreferrer">
          <div class="place-icon"><i class="fas fa-wave-square" aria-hidden="true"></i></div>
          <div>
            <span class="mono">MUSIC</span>
            <h3>TuneCore</h3>
            <p>{{ t('works.musicDescription') }}</p>
          </div>
          <b>↗</b>
        </a>

        <a class="place-card pixiv" href="https://pixiv.me/tanfantazma" target="_blank" rel="noopener noreferrer">
          <div class="place-icon"><i class="fa-brands fa-pixiv" aria-hidden="true"></i></div>
          <div>
            <span class="mono">ILLUSTRATION</span>
            <h3>pixiv</h3>
            <p>{{ locale === 'ja' ? 'イラストや漫画を投稿しています。' : 'Illustrations and manga.' }}</p>
          </div>
          <b>↗</b>
        </a>
      </div>
    </section>

    <section class="more">
      <header class="section-title">
        <div>
          <p class="eyebrow">{{ locale === 'ja' ? 'そのほかの制作物' : 'OTHER WORKS' }}</p>
          <h2>{{ locale === 'ja' ? 'ゲームなど' : 'Games & more' }}</h2>
        </div>
        <NuxtLink to="/works">{{ locale === 'ja' ? '一覧を見る' : 'View all' }} →</NuxtLink>
      </header>

      <div class="game-list">
        <NuxtLink to="/trial" class="game-row">
          <img src="/images/trial/1.png" alt="TRIAL screenshot">
          <div><span class="mono">FAN GAME / 01</span><h3>TRIAL</h3><p>{{ t('trial.description') }}</p></div>
          <b>→</b>
        </NuxtLink>
        <NuxtLink to="/unrequited" class="game-row">
          <img src="/images/unrequited/1.png" alt="UnRequited screenshot">
          <div><span class="mono">FAN GAME / 02</span><h3>UnRequited</h3><p>{{ t('unrequited.description') }}</p></div>
          <b>→</b>
        </NuxtLink>
      </div>
    </section>

    <section class="directory">
      <header class="section-title">
        <div>
          <p class="eyebrow">{{ locale === 'ja' ? 'リンク一覧' : 'LINK DIRECTORY' }}</p>
          <h2>{{ locale === 'ja' ? '目的から探す' : 'Quick links' }}</h2>
        </div>
        <p>{{ locale === 'ja' ? '見たいものに直接移動できます。' : 'Go directly to what you are looking for.' }}</p>
      </header>
      <div class="directory-grid">
        <a href="https://www.tunecore.co.jp/artists/nekonoha" target="_blank" rel="noopener noreferrer"><i class="fas fa-wave-square"></i><span><strong>{{ locale === 'ja' ? '音楽を聴く' : 'Listen to music' }}</strong><small>TuneCore</small></span><b>↗</b></a>
        <a href="https://pixiv.me/tanfantazma" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-pixiv" aria-hidden="true"></i><span><strong>{{ locale === 'ja' ? 'イラストを見る' : 'View illustrations' }}</strong><small>pixiv</small></span><b>↗</b></a>
        <a href="https://tanfantazma.booth.pm/" target="_blank" rel="noopener noreferrer"><i class="fas fa-bag-shopping"></i><span><strong>{{ locale === 'ja' ? '販売物を見る' : 'Visit the shop' }}</strong><small>BOOTH</small></span><b>↗</b></a>
        <a href="http://nekonoha.hatenablog.com/" target="_blank" rel="noopener noreferrer"><i class="fas fa-pen-to-square"></i><span><strong>{{ locale === 'ja' ? 'ブログを読む' : 'Read the blog' }}</strong><small>Hatena Blog</small></span><b>↗</b></a>
        <a href="https://twitter.com/tan_fantazma" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-x-twitter"></i><span><strong>{{ locale === 'ja' ? '近況を見る' : 'Recent updates' }}</strong><small>Twitter / X</small></span><b>↗</b></a>
        <NuxtLink to="/works"><i class="fas fa-folder-open"></i><span><strong>{{ locale === 'ja' ? '制作物をまとめて見る' : 'Browse all works' }}</strong><small>WORKS</small></span><b>→</b></NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useLocale()
useSeoMeta({
  title: '針の筵 - nekonoha',
  description: 'ネコノハの個人制作サイト。ゲーム、イラスト、3Dモデル、音楽などの制作物をまとめています。',
  ogTitle: '針の筵 - nekonoha',
  ogDescription: 'ゲーム、イラスト、音楽など、趣味で作ったものを掲載しています。',
  ogUrl: 'https://nekonoha.github.io/',
  ogImage: 'https://nekonoha.github.io/images/iconnn.png',
  twitterCard: 'summary_large_image'
})
</script>

<style scoped>
.home { max-width: 1080px; }
.intro {
  display: grid;
  min-height: 660px;
  padding: 48px 0 100px;
  align-items: center;
  grid-template-columns: 1.15fr .85fr;
  gap: clamp(50px, 9vw, 120px);
}
.intro h1 {
  margin: 24px 0 18px;
  font-size: clamp(4rem, 9vw, 8rem);
  font-weight: 800;
  line-height: .9;
  letter-spacing: -.07em;
}
.intro .lead { color: white; font-size: clamp(1.15rem, 2vw, 1.5rem); font-weight: 600; }
.note { max-width: 580px; margin-top: 18px; color: var(--color-text-muted); }
.intro-links { display: flex; margin-top: 36px; flex-wrap: wrap; gap: 12px; }
.intro-links a {
  display: flex;
  min-width: 160px;
  padding: 13px 16px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 10px;
  color: #d9dce2;
  background: rgba(255,255,255,.025);
  font-size: .82rem;
  font-weight: 700;
  text-decoration: none;
}
.intro-links a:first-child { color: #090a0d; border-color: var(--color-accent); background: var(--color-accent); }
.intro-links a:hover { transform: translateY(-2px); border-color: var(--color-accent); }
.portrait-wrap { max-width: 390px; justify-self: end; }
.portrait {
  aspect-ratio: 1;
  overflow: hidden;
  padding: 8px;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 28px;
  background: rgba(255,255,255,.035);
  box-shadow: var(--shadow-soft);
  transform: rotate(1.5deg);
}
.portrait img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; border-radius: 21px; }
.portrait-caption { margin-top: 14px; color: #686e79; font-size: .62rem; letter-spacing: .1em; text-align: center; }
.places, .more, .directory { padding: 90px 0; border-top: 1px solid rgba(255,255,255,.09); }
.section-title { display: flex; margin-bottom: 34px; align-items: end; justify-content: space-between; gap: 30px; }
.section-title h2 { margin-top: 14px; font-size: clamp(2rem, 4.5vw, 3.8rem); line-height: 1; letter-spacing: -.05em; }
.section-title > p { color: var(--color-text-muted); font-size: .82rem; }
.section-title > a { color: var(--color-text-muted); font-size: .78rem; font-weight: 700; text-decoration: none; }
.section-title > a:hover { color: var(--color-accent); }
.place-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.place-card {
  display: grid;
  min-height: 230px;
  padding: 28px;
  align-items: end;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 20px;
  background: rgba(16,19,25,.82);
  text-decoration: none;
  grid-template-columns: 72px 1fr auto;
  gap: 22px;
  transition: border-color .25s ease, transform .25s ease;
}
.place-card:hover { border-color: rgba(255,111,175,.65); transform: translateY(-3px); }
.place-icon { display: grid; width: 64px; height: 64px; place-items: center; border-radius: 16px; color: #090a0d; background: var(--color-accent); font-size: 1.45rem; }
.pixiv .place-icon { color: var(--color-accent); background: rgba(255,111,175,.1); }
.place-card span, .game-row span { color: var(--color-accent); font-size: .62rem; letter-spacing: .12em; }
.place-card h3 { margin: 4px 0; font-size: 1.6rem; letter-spacing: -.035em; }
.place-card p { color: var(--color-text-muted); font-size: .78rem; }
.place-card > b { color: var(--color-accent); }
.game-list { border-top: 1px solid rgba(255,255,255,.1); }
.game-row {
  display: grid;
  padding: 22px 6px;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,.1);
  text-decoration: none;
  grid-template-columns: 170px 1fr auto;
  gap: 26px;
}
.game-row img { width: 170px; height: 105px; object-fit: cover; border-radius: 10px; filter: saturate(.7); }
.game-row h3 { margin: 4px 0; font-size: 1.5rem; letter-spacing: -.035em; }
.game-row p { color: var(--color-text-muted); font-size: .78rem; }
.game-row > b { color: var(--color-accent); }
.game-row:hover { background: rgba(255,255,255,.02); }
.game-row:hover img { filter: saturate(1); }
.directory-grid { display: grid; border-top: 1px solid rgba(255,255,255,.1); grid-template-columns: 1fr 1fr; }
.directory-grid a { display: grid; min-height: 92px; padding: 19px 16px; align-items: center; border-bottom: 1px solid rgba(255,255,255,.1); color: #daddE3; text-decoration: none; grid-template-columns: 38px 1fr auto; gap: 11px; }
.directory-grid a:nth-child(odd) { border-right: 1px solid rgba(255,255,255,.1); }
.directory-grid a:hover { color: white; background: rgba(255,255,255,.025); }
.directory-grid a > i, .directory-grid a > b { color: var(--color-accent); }
.directory-grid strong, .directory-grid small { display: block; }
.directory-grid strong { font-size: .82rem; }
.directory-grid small { margin-top: 2px; color: #747b87; font: 400 .62rem 'DM Mono', monospace; }
@media (max-width: 780px) {
  .intro { min-height: 0; grid-template-columns: 1fr; }
  .intro-copy { order: 2; }
  .portrait-wrap { width: min(100%, 380px); justify-self: center; }
  .place-grid { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .intro { padding-top: 30px; gap: 42px; }
  .intro h1 { font-size: 18vw; }
  .section-title { align-items: flex-start; flex-direction: column; }
  .place-card { min-height: 190px; padding: 22px; grid-template-columns: 54px 1fr auto; gap: 14px; }
  .place-icon { width: 52px; height: 52px; }
  .game-row { grid-template-columns: 1fr auto; }
  .game-row img { display: none; }
  .directory-grid { grid-template-columns: 1fr; }
  .directory-grid a:nth-child(odd) { border-right: 0; }
}
</style>

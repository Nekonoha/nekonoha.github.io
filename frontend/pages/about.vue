<template>
  <article class="page-wrap">
    <header><p class="eyebrow">About</p><h1 class="display-title">{{ locale === 'ja' ? 'プロフィール' : 'About' }}</h1></header>
    <div class="profile">
      <img src="/images/iconnn.png" :alt="locale === 'ja' ? 'ネコノハのアイコン' : 'Nekonoha avatar'" width="600" height="600">
      <div class="profile-copy">
        <h2>{{ locale === 'ja' ? 'ネコノハ' : 'Nekonoha' }}</h2>
        <p>{{ locale === 'ja' ? 'エンジニア。音楽、ゲーム、イラスト、3Dを制作。' : 'Engineer. Music, games, illustration and 3D.' }}</p>
        <dl>
          <div><dt>{{ locale === 'ja' ? '音楽名義' : 'Music' }}</dt><dd>{{ locale === 'ja' ? 'ネコノハヤシロ' : 'NekonohaYashiro' }}</dd></div>
          <div><dt>{{ locale === 'ja' ? '好きなもの' : 'Interests' }}</dt><dd>{{ locale === 'ja' ? 'フリーホラーゲーム、漫画、映画、DTM' : 'Free horror games, manga, films, music production' }}</dd></div>
          <div><dt>{{ locale === 'ja' ? '連絡先' : 'Contact' }}</dt><dd><a href="https://twitter.com/tan_fantazma" target="_blank" rel="noopener noreferrer">X / @tan_fantazma ↗</a></dd></div>
        </dl>
      </div>
    </div>
    <section class="section"><header class="section-head"><h2>{{ locale === 'ja' ? 'リンク' : 'Links' }}</h2><a href="https://www.tunecore.co.jp/artists/nekonoha" target="_blank" rel="noopener noreferrer">TuneCore ↗</a></header><ExternalLinks /></section>
  </article>
</template>
<script setup lang="ts">
const { locale } = useLocale()
useSeoMeta({
  title: () => (locale.value === 'ja' ? 'プロフィール' : 'About') + ' — 針の筵',
  description: () => locale.value === 'ja' ? 'ネコノハのプロフィールと連絡先。' : 'About Nekonoha and contact links.',
  ogUrl: 'https://nekonoha.github.io/about'
})
useHead({ link: [{ rel: 'canonical', href: 'https://nekonoha.github.io/about' }] })
</script>
<style scoped>
.profile { display: grid; grid-template-columns: .7fr 1fr; align-items: start; gap: clamp(32px,8vw,120px); margin-top: 64px; }
.profile > img { width: 100%; max-width: 400px; aspect-ratio: 1; object-fit: cover; }
h2 { font-size: 2rem; font-weight: 500; } .profile-copy > p { margin-top: 18px; color: var(--color-text-muted); }
dl { margin-top: 40px; } dl > div { display: grid; grid-template-columns: 110px 1fr; gap: 20px; padding-block: 22px; border-top: 1px solid var(--line); font-size: .85rem; } dt { color: var(--color-text-muted); }
@media(max-width:700px) { .profile { grid-template-columns: 1fr; margin-top: 40px; } .profile > img { max-width: 260px; } dl > div { grid-template-columns: 85px 1fr; } }
</style>

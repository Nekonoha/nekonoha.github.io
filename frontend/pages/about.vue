<template>
  <article class="about page-wrap">
    <header class="page-hero">
      <p class="eyebrow">{{ locale === 'ja' ? 'プロフィール' : 'PROFILE' }}</p>
      <h1 class="display-title">ABOUT<br>NEKONOHA.</h1>
    </header>

    <div class="about-grid">
      <aside class="identity panel">
        <div class="avatar"><img src="/images/iconnn.png" :alt="locale === 'ja' ? 'ネコノハのアイコン' : 'Nekonoha icon'"></div>
        <p class="mono">NEKONOHA</p>
        <span>{{ locale === 'ja' ? 'エンジニア / 趣味で制作' : 'Engineer / Hobby creator' }}</span>
      </aside>

      <div class="story">
        <p class="intro">{{ t('about.intro') }}</p>
        <p>{{ t('about.description') }}</p>

        <dl class="profile-notes">
          <div>
            <dt>{{ locale === 'ja' ? '普段' : 'DAY TO DAY' }}</dt>
            <dd>{{ locale === 'ja' ? 'エンジニア' : 'Engineer' }}</dd>
          </div>
          <div>
            <dt>{{ locale === 'ja' ? '趣味' : 'FOR FUN' }}</dt>
            <dd>{{ locale === 'ja' ? 'ゲーム・絵・3D・音楽' : 'Games, art, 3D & music' }}</dd>
          </div>
          <div>
            <dt>{{ locale === 'ja' ? '活動' : 'BASED IN' }}</dt>
            <dd>{{ locale === 'ja' ? 'インターネット' : 'The internet' }}</dd>
          </div>
        </dl>
        <section>
          <p class="eyebrow">{{ t('about.hobbies') }}</p>
          <div class="tags">
            <span>{{ t('about.hobby1') }}</span><span>{{ t('about.hobby2') }}</span>
            <span>{{ t('about.hobby3') }}</span><span>{{ t('about.hobby4') }}</span>
          </div>
        </section>

        <section class="contact">
          <p class="eyebrow">{{ t('about.contact') }}</p>
          <a href="https://twitter.com/tan_fantazma" target="_blank" rel="noopener noreferrer">
            <span>Twitter / X</span><strong>@tan_fantazma</strong><b>↗</b>
          </a>
        </section>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
const { t, locale } = useLocale()
useSeoMeta({
  title: 'ABOUT - 針の筵',
  description: 'ネコノハのプロフィール。エンジニアをしながら、ゲーム、イラスト、3Dモデル、音楽などを趣味で制作しています。',
  ogTitle: 'ABOUT - 針の筵',
  ogDescription: 'ネコノハのプロフィールと活動先。',
  ogUrl: 'https://nekonoha.github.io/about',
  ogImage: 'https://nekonoha.github.io/images/iconnn.png'
})
useHead({ link: [{ rel: 'canonical', href: 'https://nekonoha.github.io/about' }] })
</script>
<style scoped>
.page-hero { padding: 30px 0 100px; }
.about-grid { display: grid; grid-template-columns: .68fr 1.32fr; gap: clamp(36px, 8vw, 110px); align-items: start; }
.identity { position: sticky; top: 120px; padding: 28px; }
.avatar { aspect-ratio: 1; margin-bottom: 26px; overflow: hidden; border: 1px solid rgba(255,255,255,.12); border-radius: 18px; background: #98e8d9; }
.avatar img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; transition: transform .5s ease; }
.identity:hover .avatar img { transform: scale(1.025); }
.identity p { color: white; font-size: .82rem; letter-spacing: .12em; }
.identity span { display: block; margin-top: 7px; color: var(--color-text-muted); font-size: .78rem; }
.story { max-width: 700px; color: var(--color-text-muted); font-size: clamp(1.08rem, 2vw, 1.45rem); }
.story > p { margin-bottom: 25px; }
.story .intro { color: white; font-size: clamp(1.7rem, 3vw, 2.6rem); font-weight: 700; line-height: 1.35; letter-spacing: -.04em; }
.profile-notes { display: grid; margin-top: 46px; padding-block: 22px; border-block: 1px solid rgba(255,255,255,.1); grid-template-columns: repeat(3, 1fr); gap: 18px; }
.profile-notes dt { margin-bottom: 6px; color: var(--color-accent); font: 500 .58rem 'DM Mono', monospace; letter-spacing: .1em; }
.profile-notes dd { color: #d9dce2; font-size: .78rem; }
.story section { margin-top: 75px; }
.tags { display: flex; margin-top: 22px; flex-wrap: wrap; gap: 10px; }
.tags span { padding: 10px 15px; border: 1px solid rgba(255,255,255,.11); border-radius: 99px; color: #c9cdd5; font-size: .8rem; }
.contact a { display: grid; margin-top: 24px; padding: 24px 0; border-block: 1px solid rgba(255,255,255,.12); text-decoration: none; grid-template-columns: 1fr 1fr auto; align-items: center; }
.contact a span { color: var(--color-text-muted); font-size: .8rem; }
.contact a strong { color: white; font-size: 1rem; }
.contact a b { color: var(--color-accent); }
@media (max-width: 720px) { .page-hero { padding-bottom: 64px; } .about-grid { grid-template-columns: 1fr; } .identity { position: static; } .profile-notes { grid-template-columns: 1fr; } }
</style>

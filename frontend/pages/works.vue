<template>
  <article class="page-wrap">
    <header><p class="eyebrow">Works</p><h1 class="display-title">{{ locale === 'ja' ? '作品' : 'Works' }}</h1></header>
    <section id="music" class="section">
      <header class="section-head"><h2>{{ locale === 'ja' ? '音楽' : 'Music' }}<small>{{ musicReleases.length }} releases</small></h2><a :href="'https://www.tunecore.co.jp/artists/nekonoha?lang=' + locale" target="_blank" rel="noopener noreferrer">TuneCore ↗</a></header>
      <LatestReleases :limit="musicReleases.length" />
    </section>
    <section class="section"><header class="section-head"><h2>{{ locale === 'ja' ? 'ゲーム' : 'Games' }}</h2></header><GameWorks /></section>
    <section id="art" class="section"><header class="section-head"><h2>{{ locale === 'ja' ? 'イラスト' : 'Illustration' }}<small>{{ illustrations.length }} works</small></h2><a href="https://pixiv.me/tanfantazma" target="_blank" rel="noopener noreferrer">pixiv ↗</a></header><LatestIllustrations :limit="illustrations.length" /></section>
    <section class="section"><header class="section-head"><h2>{{ locale === 'ja' ? 'リンク' : 'Links' }}</h2></header><ExternalLinks /></section>
  </article>
</template>
<script setup lang="ts">
import { musicReleases } from '~/data/releases'
import { illustrations } from '~/data/illustrations'
const { locale } = useLocale()
useSeoMeta({
  title: () => (locale.value === 'ja' ? '作品' : 'Works') + ' — 針の筵',
  description: () => locale.value === 'ja' ? 'ネコノハの音楽、ゲーム、イラストの一覧。' : 'Music, games and illustration by Nekonoha.',
  ogUrl: 'https://nekonoha.github.io/works'
})
useHead({ link: [{ rel: 'canonical', href: 'https://nekonoha.github.io/works' }] })
</script>

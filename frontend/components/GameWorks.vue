<template>
  <div class="game-grid">
    <NuxtLink v-for="game in games" :key="game.path" :to="game.path" class="game-tile">
      <div class="game-image"><img :src="game.image" :alt="game.title + (locale === 'ja' ? 'のゲーム画面' : ' screenshot')" loading="lazy" width="640" height="480"></div>
      <div class="game-caption"><div><h3>{{ game.title }}</h3><p>{{ locale === 'ja' ? 'ゆめにっき二次創作ゲーム' : 'Yume Nikki fan game' }}</p></div><span aria-hidden="true">↗</span></div>
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
const { locale } = useLocale()
const games = [
  { title: 'TRIAL', path: '/trial', image: '/images/trial/5.png' },
  { title: 'UnRequited', path: '/unrequited', image: '/images/unrequited/3.png' }
]
</script>

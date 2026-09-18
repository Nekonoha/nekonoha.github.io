<template>
  <div class="outbound-list">
    <a v-for="link in links" :key="link.name" :href="link.url" target="_blank" rel="noopener noreferrer"><strong><i :class="[link.icon, 'ui-icon']" aria-hidden="true"></i>{{ link.name }}</strong><span>{{ locale === 'ja' ? link.ja : link.en }}</span><b aria-hidden="true">↗</b></a>
  </div>
</template>
<script setup lang="ts">
const { locale } = useLocale()
const links = [
  { name: 'pixiv', icon: 'fa-brands fa-pixiv', ja: 'イラスト・漫画', en: 'Illustration / Manga', url: 'https://pixiv.me/tanfantazma' },
  { name: 'BOOTH', icon: 'fa-solid fa-bag-shopping', ja: '頒布物', en: 'Shop', url: 'https://tanfantazma.booth.pm/' },
  { name: 'Blog', icon: 'fa-solid fa-pen-to-square', ja: '日記・制作記録', en: 'Notes', url: 'https://nekonoha.hatenablog.com/' },
  { name: 'X', icon: 'fa-brands fa-x-twitter', ja: '@tan_fantazma', en: '@tan_fantazma', url: 'https://twitter.com/tan_fantazma' }
]
</script>

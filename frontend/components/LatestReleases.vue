<template>
  <div class="release-grid">
    <article v-for="release in latestReleases" :key="release.spotifyId" class="release-card">
      <div class="release-meta">
        <span class="mono">{{ formatDate(release.releaseDate) }}</span>
        <a :href="localizedLinkcore(release.linkcoreUrl)" target="_blank" rel="noopener noreferrer">
          {{ locale === 'ja' ? '各サービスで聴く' : 'Choose a service' }} ↗
        </a>
      </div>
      <h3>{{ locale === 'ja' ? release.title : release.titleEn }}</h3>
      <iframe
        :title="`${release.title} — Spotify`"
        :src="spotifyEmbedUrl(release.spotifyId, release.spotifyIdEn)"
        width="100%"
        height="352"
        frameborder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { musicReleases } from '~/data/releases'

const { locale } = useLocale()
const latestReleases = computed(() => [...musicReleases]
  .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
  .slice(0, 3))
const formatDate = (date: string) => date.replaceAll('-', '.')
const localizedLinkcore = (url: string) => `${url}?lang=${locale.value}`
const spotifyEmbedUrl = (id: string, idEn?: string) => {
  const spotifyLocale = locale.value === 'ja' ? 'ja' : 'en'
  const localizedId = locale.value === 'en' && idEn ? idEn : id
  return `https://open.spotify.com/embed/album/${localizedId}?utm_source=generator&theme=0&locale=${spotifyLocale}`
}
</script>

<style scoped>
.release-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.release-card { min-width: 0; padding: 14px; border: 1px solid rgba(255,255,255,.1); border-radius: 24px; background: rgba(16,19,25,.76); box-shadow: var(--shadow-subtle); }
.release-meta { display: flex; min-height: 34px; padding: 2px 4px 10px; align-items: center; justify-content: space-between; gap: 10px; color: var(--color-text-muted); font-size: .65rem; }
.release-meta span { color: var(--color-accent); letter-spacing: .08em; }
.release-meta a { text-decoration: none; }
.release-meta a:hover { color: white; }
h3 { min-height: 62px; padding: 0 4px 14px; font-size: 1rem; line-height: 1.45; letter-spacing: -.02em; }
iframe { display: block; border: 0; border-radius: 14px; background: #121212; }
@media (max-width: 980px) { .release-grid { grid-template-columns: 1fr; } h3 { min-height: 0; } iframe { height: 352px; } }
</style>

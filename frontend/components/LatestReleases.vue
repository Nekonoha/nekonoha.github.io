<template>
  <div class="release-collection">
    <div class="release-grid">
    <article v-for="(release, index) in releases" :key="release.id" class="release" :style="{ order: index * 2 }">
      <a class="artwork" :href="link(release.linkcoreUrl)" target="_blank" rel="noopener noreferrer" :aria-label="title(release) + (locale === 'ja' ? 'を聴く' : ' — Listen')">
        <img :src="release.artwork" :alt="title(release)" width="800" height="800" loading="lazy">
        <span class="media-badge" aria-hidden="true">↗</span>
      </a>
      <div class="release-meta"><time :datetime="release.releaseDate">{{ release.releaseDate.replaceAll('-', '.') }}</time><span>{{ release.trackCount }} {{ locale === 'ja' ? '曲' : 'tracks' }}</span></div>
      <h3><a class="text-link" :href="link(release.linkcoreUrl)" target="_blank" rel="noopener noreferrer">{{ title(release) }}</a></h3>
      <div class="release-actions">
        <button v-if="release.spotifyId" class="pill pill-primary" :aria-expanded="playing === release.id" @click="togglePlayer(release.id, $event)"><i :class="['fa-solid', playing === release.id ? 'fa-xmark' : 'fa-play', 'ui-icon']" aria-hidden="true"></i>{{ playing === release.id ? (locale === 'ja' ? '閉じる' : 'Close') : (locale === 'ja' ? '試聴' : 'Preview') }}</button>
        <a class="pill" :href="link(release.linkcoreUrl)" target="_blank" rel="noopener noreferrer">{{ locale === 'ja' ? '配信サービス' : 'Listen' }}<span class="ext" aria-hidden="true">↗</span></a>
      </div>
    </article>
    <section v-if="activeRelease" ref="playerPanel" class="player-panel" :style="playerOrder" :aria-label="locale === 'ja' ? '楽曲プレビュー' : 'Music preview'" tabindex="-1">
      <div class="player-header"><div><span class="eyebrow">{{ locale === 'ja' ? 'Spotifyで試聴' : 'Preview on Spotify' }}</span><h3>{{ title(activeRelease) }}</h3></div><button class="player-close" @click="closePlayer" :aria-label="locale === 'ja' ? 'プレビューを閉じる' : 'Close preview'"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>
      <p v-if="!loaded" role="status" class="player-status">{{ locale === 'ja' ? 'プレーヤーを読み込んでいます…' : 'Loading player…' }}</p>
      <iframe :key="activeRelease.id + ':' + retry" :title="title(activeRelease) + ' — Spotify'" :src="'https://open.spotify.com/embed/album/' + activeRelease.spotifyId + '?utm_source=generator&locale=' + locale" width="100%" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager" @load="loaded = true" />
      <div class="player-help"><span>{{ locale === 'ja' ? 'プレーヤーの ▶ で試聴できます。再生できない場合はSpotifyで開いてください。' : 'Press play in the player. If playback is unavailable, open Spotify.' }}</span><a :href="'https://open.spotify.com/album/' + activeRelease.spotifyId" target="_blank" rel="noopener noreferrer">{{ locale === 'ja' ? 'Spotifyで開く' : 'Open in Spotify' }}<span class="ext" aria-hidden="true">↗</span></a><button @click="retry++; loaded = false">{{ locale === 'ja' ? '再読み込み' : 'Reload' }}</button></div>
    </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { musicReleases, type MusicRelease } from '~/data/releases'
const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 3 })
const { locale } = useLocale()
const playing = ref<string | null>(null)
const loaded = ref(false)
const retry = ref(0)
const playerPanel = ref<HTMLElement | null>(null)
let trigger: HTMLElement | null = null
const activeRelease = computed(() => musicReleases.find(release => release.id === playing.value))
const closePlayer = () => { playing.value = null; trigger?.focus() }
const togglePlayer = async (id: string, event: Event) => {
  if (playing.value === id) { closePlayer(); return }
  trigger = event.currentTarget as HTMLElement
  loaded.value = false
  playing.value = id
  await nextTick()
  playerPanel.value?.focus({ preventScroll: true })
  playerPanel.value?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' })
}
const releases = computed(() => musicReleases.slice(0, props.limit))
const playerOrder = computed(() => {
  const index = releases.value.findIndex(release => release.id === playing.value)
  return { '--desktop-order': (Math.floor(index / 3) + 1) * 6 - 1, '--mobile-order': (Math.floor(index / 2) + 1) * 4 - 1 }
})
const title = (release: MusicRelease) => locale.value === 'ja' ? release.title : release.titleEn
const link = (url: string) => url + '?lang=' + locale.value
</script>
<style scoped>
.release-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 48px 32px; }
.release { display: flex; flex-direction: column; min-width: 0; }
.artwork { display: block; aspect-ratio: 1; }
.artwork img { width: 100%; height: 100%; object-fit: cover; }
.release-meta { display: flex; justify-content: space-between; margin-top: 16px; color: var(--color-text-muted); font-size: .8125rem; font-variant-numeric: tabular-nums; }
h3 { margin-top: 4px; font-size: 1.1rem; font-weight: 700; line-height: 1.55; }
.release-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: auto; padding-block: 16px 22px; border-bottom: 1px solid var(--line); }
.release-actions .pill { flex: 1 1 auto; }
.release h3 { margin-bottom: 4px; }
.player-panel button { background: none; border: 0; }
iframe { display: block; border: 0; margin-top: 18px; border-radius: 12px; }
.player-panel { grid-column: 1 / -1; order: var(--desktop-order); padding: 24px; border: 1px solid var(--line); border-radius: var(--radius-panel); background: var(--color-panel); box-shadow: var(--shadow-soft); scroll-margin-top: 110px; transform-origin: top; animation: panel-open .36s var(--ease-out) both; }
.player-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.player-header h3 { margin-top: 2px; }
.player-close { flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%; background: var(--color-surface); transition: background var(--dur-fast), color var(--dur-fast), rotate var(--dur-base) var(--ease-out); }
.player-close:hover { color: var(--color-main); background: var(--color-accent); rotate: 90deg; }
.player-status { margin-top: 16px; color: var(--color-text-muted); font-size: .875rem; }
.player-help { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 20px; margin-top: 16px; color: var(--color-text-muted); font-size: .8125rem; }
.player-help a { color: var(--color-accent); }
.player-help button { padding-block: 6px; text-decoration: underline; text-underline-offset: 5px; }
.player-help button:hover { color: var(--color-accent); }
@keyframes panel-open { from { opacity: 0; transform: translateY(-10px) scaleY(.96); } to { opacity: 1; transform: none; } }
@media(max-width:900px) { .release-grid { gap: 36px 20px; } }
@media(max-width:600px) { .release-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 32px 14px; } h3 { font-size: 1rem; } .release-meta { margin-top: 12px; } .release-actions { flex-direction: column; gap: 8px; padding-block: 12px 18px; } .release-actions .pill { min-height: 44px; padding-inline: 10px; } .player-panel { padding: 14px; order: var(--mobile-order); } }
</style>

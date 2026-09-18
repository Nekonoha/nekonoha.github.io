<template>
  <div class="release-collection">
    <div class="release-grid">
    <article v-for="(release, index) in releases" :key="release.id" class="release" :style="{ order: index * 2 }">
      <a class="artwork" :href="link(release.linkcoreUrl)" target="_blank" rel="noopener noreferrer" :aria-label="title(release) + (locale === 'ja' ? 'を聴く' : ' — Listen')">
        <img :src="release.artwork" :alt="title(release)" width="800" height="800" loading="lazy">
        <span aria-hidden="true">↗</span>
      </a>
      <div class="release-meta"><time :datetime="release.releaseDate">{{ release.releaseDate.replaceAll('-', '.') }}</time><span>{{ release.trackCount }} {{ locale === 'ja' ? '曲' : 'tracks' }}</span></div>
      <h3><a :href="link(release.linkcoreUrl)" target="_blank" rel="noopener noreferrer">{{ title(release) }}</a></h3>
      <div class="release-actions">
        <a :href="link(release.linkcoreUrl)" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-headphones ui-icon" aria-hidden="true"></i>{{ locale === 'ja' ? '配信サービス' : 'Listen' }} ↗</a>
        <button v-if="release.spotifyId" :aria-expanded="playing === release.id" @click="togglePlayer(release.id, $event)"><i class="fa-brands fa-spotify ui-icon" aria-hidden="true"></i>{{ playing === release.id ? (locale === 'ja' ? '閉じる −' : 'Close −') : (locale === 'ja' ? '試聴 ＋' : 'Preview ＋') }}</button>
      </div>
    </article>
    <section v-if="activeRelease" ref="playerPanel" class="player-panel" :style="playerOrder" :aria-label="locale === 'ja' ? '楽曲プレビュー' : 'Music preview'" tabindex="-1">
      <div class="player-header"><div><span class="eyebrow">SPOTIFY PREVIEW</span><h3>{{ title(activeRelease) }}</h3></div><button class="player-close" @click="closePlayer" :aria-label="locale === 'ja' ? 'プレビューを閉じる' : 'Close preview'"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>
      <p v-if="!loaded" role="status" class="player-status">{{ locale === 'ja' ? 'プレーヤーを読み込んでいます…' : 'Loading player…' }}</p>
      <iframe :key="activeRelease.id + ':' + retry" :title="title(activeRelease) + ' — Spotify'" :src="'https://open.spotify.com/embed/album/' + activeRelease.spotifyId + '?utm_source=generator&locale=' + locale" width="100%" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager" @load="loaded = true" />
      <div class="player-help"><span>{{ locale === 'ja' ? 'プレーヤーの ▶ で試聴できます。再生できない場合はSpotifyで開いてください。' : 'Press play in the player. If playback is unavailable, open Spotify.' }}</span><a :href="'https://open.spotify.com/album/' + activeRelease.spotifyId" target="_blank" rel="noopener noreferrer">Spotify ↗</a><button @click="retry++; loaded = false">{{ locale === 'ja' ? '再読み込み' : 'Reload' }}</button></div>
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
  return { '--desktop-order': (Math.floor(index / 3) + 1) * 6 - 1, '--mobile-order': index * 2 + 1 }
})
const title = (release: MusicRelease) => locale.value === 'ja' ? release.title : release.titleEn
const link = (url: string) => url + '?lang=' + locale.value
</script>
<style scoped>
.release-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 44px 32px; }
.release { min-width: 0; }
.artwork { display: block; position: relative; overflow: hidden; background: var(--color-surface); aspect-ratio: 1; }
.artwork img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
.artwork:hover img { transform: scale(1.035); }
.artwork > span { position: absolute; right: 14px; bottom: 14px; display: grid; width: 38px; height: 38px; place-items: center; background: var(--color-main); }
.release-meta { display: flex; justify-content: space-between; color: var(--color-text-muted); font-size: .7rem; margin-top: 18px; }
h3 { font-size: 1rem; line-height: 1.65; margin-top: 7px; font-weight: 500; min-height: 3.3em; }
h3 a { text-decoration: none; } h3 a:hover { text-decoration: underline; }
.release-actions { display: flex; justify-content: space-between; padding-block: 16px; margin-top: 8px; border-bottom: 1px solid var(--line); font-size: .75rem; }
.release-actions a { text-decoration: none; } .release-actions a:hover { text-decoration: underline; }
button { background: none; border: 0; } button:hover { text-decoration: underline; }
iframe { display: block; border: 0; margin-top: 18px; border-radius: 12px; }
@media(max-width:900px) { .release-grid { gap: 28px 20px; } }
@media(max-width:600px) { .release-grid { grid-template-columns: 1fr; gap: 40px; } h3 { min-height: 0; font-size: 1.1rem; } }
 .player-panel { grid-column: 1 / -1; order: var(--desktop-order); padding: 24px; margin-bottom: 0; border: 1px solid var(--line); border-radius: 18px; background: var(--color-panel); scroll-margin-top: 110px; }
.player-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.player-header h3 { min-height: 0; margin-top: 8px; }
.player-close { flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; background: var(--color-surface); }
.player-status { margin-top: 16px; color: var(--color-text-muted); font-size: .8rem; }
.player-help { display: flex; flex-wrap: wrap; gap: 12px 20px; margin-top: 16px; font-size: .75rem; color: var(--color-text-muted); }
.player-help a { color: var(--color-accent); }
.player-help button { text-decoration: underline; }
@media(max-width:600px) { .player-panel { padding: 14px; order: var(--mobile-order); } }
</style>

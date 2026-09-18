<template>
  <div class="mode-switch" role="group" :aria-label="locale === 'ja' ? '配色モード' : 'Color mode'">
    <button v-for="choice in choices" :key="choice.value" type="button" :aria-pressed="mode === choice.value" :aria-label="locale === 'ja' ? choice.ja : choice.en" :title="locale === 'ja' ? choice.ja : choice.en" @click="changeMode(choice.value)"><i :class="choice.icon" aria-hidden="true"></i></button>
  </div>
</template>
<script setup lang="ts">
type ColorMode = 'system' | 'light' | 'dark'
const { locale } = useLocale()
const mode = ref<ColorMode>('system')
const choices: { value: ColorMode; ja: string; en: string; icon: string }[] = [
  { value: 'light', ja: 'ライトモード', en: 'Light mode', icon: 'fa-regular fa-sun' },
  { value: 'system', ja: '端末の設定に合わせる', en: 'Use device setting', icon: 'fa-solid fa-desktop' },
  { value: 'dark', ja: 'ダークモード', en: 'Dark mode', icon: 'fa-regular fa-moon' }
]
const storageKey = 'nekonoha-color-mode'
let media: MediaQueryList | undefined
const validMode = (value: string | null | undefined): ColorMode => value === 'light' || value === 'dark' ? value : 'system'
const applyMode = () => {
  document.documentElement.dataset.colorMode = mode.value
  const dark = mode.value === 'dark' || (mode.value === 'system' && media?.matches)
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = dark ? '#171c29' : '#f5f0e9'
}
const changeMode = (value: ColorMode) => {
  mode.value = value
  try {
    if (mode.value === 'system') localStorage.removeItem(storageKey)
    else localStorage.setItem(storageKey, mode.value)
  } catch { /* The selection still works when browser storage is unavailable. */ }
  applyMode()
}
const syncStorage = (event: StorageEvent) => {
  if (event.key !== storageKey && event.key !== null) return
  mode.value = validMode(event.newValue)
  applyMode()
}
onMounted(() => {
  media = window.matchMedia('(prefers-color-scheme: dark)')
  mode.value = validMode(document.documentElement.dataset.colorMode)
  applyMode()
  media.addEventListener('change', applyMode)
  window.addEventListener('storage', syncStorage)
})
onUnmounted(() => {
  media?.removeEventListener('change', applyMode)
  window.removeEventListener('storage', syncStorage)
})
</script>
<style scoped>
.mode-switch { display: flex; gap: 2px; padding: 3px; border-radius: 999px; background: var(--color-surface); border: 1px solid var(--line); }
button { display: grid; place-items: center; width: 30px; height: 30px; border: 0; border-radius: 50%; background: transparent; color: var(--color-text-muted); font-size: .8rem; }
button:hover { color: var(--color-text); }
button[aria-pressed="true"] { background: var(--color-accent); color: var(--color-main); box-shadow: 0 2px 6px #00000015; }
@media(max-width:360px) { button { width: 26px; height: 28px; font-size: .72rem; } }
</style>

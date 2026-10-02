<template>
  <div class="mode-switch" :data-mode="mode" role="group" :aria-label="locale === 'ja' ? '配色モード' : 'Color mode'">
    <button v-for="choice in choices" :key="choice.value" type="button" :aria-pressed="mode === choice.value" :aria-label="locale === 'ja' ? choice.ja : choice.en" :title="locale === 'ja' ? choice.ja : choice.en" @click="changeMode(choice.value, $event)"><i :class="choice.icon" aria-hidden="true"></i></button>
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
  if (meta) meta.content = dark ? '#11161a' : '#f2f3ee'
}
const setMode = (value: ColorMode) => {
  mode.value = value
  try {
    if (mode.value === 'system') localStorage.removeItem(storageKey)
    else localStorage.setItem(storageKey, mode.value)
  } catch { /* The selection still works when browser storage is unavailable. */ }
  applyMode()
}
// The new palette spreads out from the button that was pressed.
const changeMode = (value: ColorMode, event?: MouseEvent) => {
  if (value === mode.value) return
  const doc = document as Document & { startViewTransition?: (update: () => Promise<void> | void) => unknown }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!doc.startViewTransition || reduced) { setMode(value); return }
  const rect = (event?.currentTarget as HTMLElement | null)?.getBoundingClientRect()
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const y = rect ? rect.top + rect.height / 2 : 0
  const root = document.documentElement
  root.style.setProperty('--vt-x', `${x}px`)
  root.style.setProperty('--vt-y', `${y}px`)
  root.style.setProperty('--vt-r', `${Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))}px`)
  root.classList.add('theme-switching')
  const transition = doc.startViewTransition(async () => { setMode(value); await nextTick() }) as { finished?: Promise<void> }
  Promise.resolve(transition?.finished).catch(() => {}).finally(() => root.classList.remove('theme-switching'))
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
.mode-switch { position: relative; display: flex; gap: 2px; padding: 3px; border-radius: var(--radius-pill); background: var(--color-surface); border: 1px solid var(--line); }
/* One thumb slides between the three positions. */
.mode-switch::before { content: ''; position: absolute; top: 3px; left: 3px; width: 32px; height: 32px; border-radius: 50%; background: var(--color-accent); box-shadow: 0 2px 6px #00000026; transform: translateX(34px); transition: transform .42s var(--ease-spring); }
.mode-switch[data-mode="light"]::before { transform: translateX(0); }
.mode-switch[data-mode="dark"]::before { transform: translateX(68px); }
button { position: relative; display: grid; place-items: center; width: 32px; height: 32px; border: 0; border-radius: 50%; background: transparent; color: var(--color-text-muted); font-size: .82rem; transition: color var(--dur-fast); }
button:hover { color: var(--color-text); }
button[aria-pressed="true"] { color: var(--color-main); }
@media(max-width:360px) { .mode-switch { gap: 0; } .mode-switch::before { width: 28px; height: 28px; transform: translateX(28px); } .mode-switch[data-mode="dark"]::before { transform: translateX(56px); } button { width: 28px; height: 28px; font-size: .75rem; } }
</style>
<style>
/* Theme change: circular reveal from the pressed button (View Transitions API). */
.theme-switching::view-transition-old(root), .theme-switching::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
.theme-switching::view-transition-new(root) { animation: theme-reveal .55s cubic-bezier(.4, 0, .2, 1) both; }
@keyframes theme-reveal { from { clip-path: circle(0 at var(--vt-x) var(--vt-y)); } to { clip-path: circle(var(--vt-r) at var(--vt-x) var(--vt-y)); } }
</style>

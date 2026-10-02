<template>
  <article
    class="reader"
    :class="{ 'is-swiping': swipe.active }"
    :style="{ '--reader-size': sizes[settings.size] + 'rem', '--reader-leading': leadings[settings.leading], '--reader-font': fonts[settings.font].stack, '--swipe-x': swipe.offset + 'px' }"
    @touchstart.passive="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="resetSwipe"
  >
    <NuxtLink class="text-link reader-back" :to="tocLink"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i><span>{{ novel.title }}</span></NuxtLink>
    <header class="reader-head">
      <p>{{ position + 1 }} / {{ novel.episodes.length }}<span>{{ locale === 'ja' ? `約${minutes}分` : `about ${minutes} min` }}</span></p>
      <h1>{{ episode.title }}</h1>
    </header>
    <div ref="body" class="reader-body" @click="onBodyClick" v-html="content?.html"></div>
    <nav class="reader-pager" :aria-label="locale === 'ja' ? '前後の話' : 'Previous and next episode'">
      <NuxtLink v-if="previous" class="pager-link" :to="episodeLink(previous)"><small><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>{{ locale === 'ja' ? '前の話' : 'Previous' }}</small><span>{{ previous.title }}</span></NuxtLink>
      <span v-else></span>
      <NuxtLink v-if="next" class="pager-link pager-next" :to="episodeLink(next)"><small>{{ locale === 'ja' ? '次の話' : 'Next' }}<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></small><span>{{ next.title }}</span></NuxtLink>
      <NuxtLink v-else class="pager-link pager-next" :to="tocLink"><small>{{ locale === 'ja' ? '最新話まで読みました' : 'You are up to date' }}</small><span>{{ locale === 'ja' ? '目次へ戻る' : 'Back to contents' }}</span></NuxtLink>
    </nav>
    <p class="gesture-tip">{{ locale === 'ja' ? '左右にスワイプで前後の話へ。本文をタップするとメニューを出し入れできます。' : 'Swipe left or right to change episode. Tap the text to show or hide the menu.' }}</p>

    <!-- スワイプ中の行き先表示 -->
    <div v-if="swipe.active && swipe.direction" class="swipe-hint" :class="[swipe.direction, { armed: swipe.armed }]" aria-hidden="true">
      <i :class="['fa-solid', swipe.direction === 'next' ? 'fa-arrow-right' : 'fa-arrow-left']"></i>
      <span>{{ swipeLabel }}</span>
    </div>

    <!-- 操作の結果を短く知らせる（再開・しおり） -->
    <div v-if="notice" :key="notice.text" class="reader-toast" role="status">
      <span>{{ notice.text }}</span>
      <button v-if="notice.action" type="button" @click="runNotice">{{ notice.action }}</button>
    </div>

    <!-- 親指で届く位置の操作バー -->
    <nav class="reader-toolbar" :class="{ hidden: !chrome && !settingsOpen }" :aria-label="locale === 'ja' ? '読書メニュー' : 'Reader menu'">
      <NuxtLink v-if="previous" :to="episodeLink(previous)" :aria-label="locale === 'ja' ? '前の話' : 'Previous episode'" :title="locale === 'ja' ? '前の話' : 'Previous episode'"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></NuxtLink>
      <span v-else class="disabled" aria-hidden="true"><i class="fa-solid fa-chevron-left"></i></span>
      <NuxtLink :to="tocLink" :aria-label="locale === 'ja' ? '目次' : 'Contents'" :title="locale === 'ja' ? '目次' : 'Contents'"><i class="fa-solid fa-list" aria-hidden="true"></i></NuxtLink>
      <button type="button" :aria-pressed="bookmarkHere" :aria-label="locale === 'ja' ? 'ここにしおりを挟む' : 'Bookmark this spot'" :title="locale === 'ja' ? 'ここにしおりを挟む' : 'Bookmark this spot'" @click="placeBookmark"><i :class="[bookmarkHere ? 'fa-solid' : 'fa-regular', 'fa-bookmark']" aria-hidden="true"></i></button>
      <span class="toolbar-progress" :aria-label="locale === 'ja' ? `この話の ${progress}% まで読みました` : `${progress}% of this episode read`">{{ progress }}%</span>
      <button type="button" :aria-expanded="settingsOpen" aria-controls="reader-settings" :aria-label="locale === 'ja' ? '表示設定' : 'Display settings'" :title="locale === 'ja' ? '表示設定' : 'Display settings'" @click="settingsOpen = !settingsOpen"><span class="aa" aria-hidden="true">Aa</span></button>
      <NuxtLink v-if="next" :to="episodeLink(next)" :aria-label="locale === 'ja' ? '次の話' : 'Next episode'" :title="locale === 'ja' ? '次の話' : 'Next episode'"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></NuxtLink>
      <span v-else class="disabled" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
    </nav>

    <!-- 表示設定 -->
    <div v-if="settingsOpen" class="sheet-backdrop" @click="settingsOpen = false"></div>
    <section v-if="settingsOpen" id="reader-settings" ref="sheet" class="sheet" role="dialog" tabindex="-1" :aria-label="locale === 'ja' ? '表示設定' : 'Display settings'">
      <div class="sheet-row">
        <span>{{ locale === 'ja' ? '文字サイズ' : 'Text size' }}</span>
        <div class="stepper">
          <button type="button" :disabled="settings.size === 0" :aria-label="locale === 'ja' ? '文字を小さく' : 'Smaller text'" @click="settings.size--"><i class="fa-solid fa-minus" aria-hidden="true"></i></button>
          <output>{{ settings.size + 1 }} / {{ sizes.length }}</output>
          <button type="button" :disabled="settings.size === sizes.length - 1" :aria-label="locale === 'ja' ? '文字を大きく' : 'Larger text'" @click="settings.size++"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>
        </div>
      </div>
      <div class="sheet-row">
        <span>{{ locale === 'ja' ? '行間' : 'Line spacing' }}</span>
        <div class="segmented" role="group">
          <button v-for="(label, index) in leadingLabels" :key="index" type="button" :aria-pressed="settings.leading === index" @click="settings.leading = index">{{ label }}</button>
        </div>
      </div>
      <div class="sheet-row">
        <span>{{ locale === 'ja' ? '書体' : 'Typeface' }}</span>
        <div class="segmented font-choices" role="group">
          <button v-for="(font, key) in fonts" :key="key" type="button" :style="{ fontFamily: font.stack }" :aria-pressed="settings.font === key" @click="settings.font = key">{{ locale === 'ja' ? font.ja : font.en }}</button>
        </div>
      </div>
      <div class="sheet-row">
        <span>{{ locale === 'ja' ? '配色' : 'Colours' }}</span>
        <div class="swatches" role="group">
          <button v-for="(theme, key) in themes" :key="key" type="button" class="swatch" :class="{ site: key === 'site' }" :style="key === 'site' ? undefined : { background: theme.bg, color: theme.fg }" :aria-pressed="settings.theme === key" :aria-label="locale === 'ja' ? theme.ja : theme.en" :title="locale === 'ja' ? theme.ja : theme.en" @click="settings.theme = key">あ</button>
          <button type="button" class="swatch" :style="{ background: settings.bg, color: settings.fg }" :aria-pressed="settings.theme === 'custom'" :aria-label="locale === 'ja' ? '自分で選ぶ' : 'Custom'" :title="locale === 'ja' ? '自分で選ぶ' : 'Custom'" @click="settings.theme = 'custom'"><i class="fa-solid fa-palette" aria-hidden="true"></i></button>
        </div>
      </div>
      <div v-if="settings.theme === 'custom'" class="sheet-row custom-colors">
        <label>{{ locale === 'ja' ? '背景色' : 'Background' }}<input v-model="settings.bg" type="color"></label>
        <label>{{ locale === 'ja' ? '文字色' : 'Text' }}<input v-model="settings.fg" type="color"></label>
        <p v-if="lowContrast" class="contrast-note">{{ locale === 'ja' ? '背景と文字の色が近く、読みにくいかもしれません。' : 'These colours are close; the text may be hard to read.' }}</p>
      </div>
      <button type="button" class="pill sheet-close" @click="settingsOpen = false">{{ locale === 'ja' ? '閉じる' : 'Done' }}</button>
    </section>
  </article>
</template>
<script setup lang="ts">
import type { NovelEpisode } from '~/composables/useNovels'

const { locale } = useLocale()
const route = useRoute()
const nuxtApp = useNuxtApp()
const { findNovel, loadEpisodeHtml } = useNovels()
const found = findNovel(String(route.params.slug))
const position = found ? found.episodes.findIndex(item => String(item.number) === String(route.params.episode)) : -1
if (!found || position < 0) throw createError({ statusCode: 404, statusMessage: 'Episode not found', fatal: true })
const novel = found
const episode = novel.episodes[position]
const previous: NovelEpisode | undefined = novel.episodes[position - 1]
const next: NovelEpisode | undefined = novel.episodes[position + 1]
const tocLink = `/novels/${novel.slug}`
const episodeLink = (target: NovelEpisode) => `/novels/${novel.slug}/${target.number}`

const { data: content } = await useAsyncData(`novel:${novel.slug}:${episode.number}`, async () => {
  const html = await loadEpisodeHtml(episode)
  // 読了時間の目安（ルビとタグを除いた文字数、1分あたり約500字）。
  const length = html.replace(/<rt>.*?<\/rt>|<rp>.*?<\/rp>|<[^>]+>/g, '').length
  return { html, minutes: Math.max(1, Math.round(length / 500)) }
})
const minutes = computed(() => content.value?.minutes ?? 1)

/* ---- 表示設定（この端末のブラウザにだけ保存） ---- */
const sizes = [.95, 1.06, 1.2, 1.36]
const leadings = [1.8, 2.1, 2.4]
const leadingLabels = computed(() => locale.value === 'ja' ? ['狭い', '標準', '広い'] : ['Tight', 'Normal', 'Loose'])
// 書体。Web フォントは選ばれたときにだけ読み込む。
const fonts = {
  gothic: { ja: 'ゴシック', en: 'Sans', stack: "var(--font-sans)", href: '' },
  mincho: { ja: '明朝', en: 'Serif', stack: "'Shippori Mincho', 'Hiragino Mincho ProN', 'Yu Mincho', 'YuMincho', 'Noto Serif JP', serif", href: 'https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700&display=swap' },
  maru: { ja: '丸ゴシック', en: 'Rounded', stack: "'Zen Maru Gothic', 'Hiragino Maru Gothic ProN', 'BIZ UDGothic', sans-serif", href: 'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700&display=swap' },
  system: { ja: '端末の標準', en: 'Device', stack: "system-ui, -apple-system, 'Segoe UI', sans-serif", href: '' }
} as const
type FontKey = keyof typeof fonts
// 配色。「サイトに合わせる」はライト／ダークの切り替えに従う。
const themes = {
  site: { ja: 'サイトに合わせる', en: 'Match site', bg: '', fg: '' },
  white: { ja: '白', en: 'White', bg: '#ffffff', fg: '#1a1a1a' },
  sepia: { ja: 'セピア', en: 'Sepia', bg: '#f4ecd8', fg: '#3b2f1e' },
  gray: { ja: 'グレー', en: 'Grey', bg: '#2b2d31', fg: '#dcdde0' },
  black: { ja: '黒', en: 'Black', bg: '#000000', fg: '#c8c8c8' }
} as const
type ThemeKey = keyof typeof themes | 'custom'
const settings = reactive<{ size: number; leading: number; font: FontKey; theme: ThemeKey; bg: string; fg: string }>({ size: 1, leading: 1, font: 'gothic', theme: 'site', bg: '#f4ecd8', fg: '#3b2f1e' })
const settingsKey = 'nekonoha-reader'
const settingsOpen = ref(false)
const sheet = ref<HTMLElement | null>(null)
let settingsLoaded = false
const isColor = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)
const palette = computed(() => settings.theme === 'custom' ? { bg: settings.bg, fg: settings.fg } : themes[settings.theme])
// 背景と文字のコントラスト比（WCAG）。自分で選んだ色が読みにくいときに知らせる。
const luminance = (hex: string) => {
  const channel = (index: number) => {
    const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255
    return value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4
  }
  return .2126 * channel(1) + .7152 * channel(3) + .0722 * channel(5)
}
const lowContrast = computed(() => {
  if (!isColor(settings.bg) || !isColor(settings.fg)) return false
  const [light, dark] = [luminance(settings.bg), luminance(settings.fg)].sort((a, b) => b - a)
  return (light + .05) / (dark + .05) < 4.5
})
const applyAppearance = () => {
  if (!import.meta.client) return
  const root = document.documentElement
  const themed = Boolean(palette.value.bg)
  root.classList.toggle('reader-themed', themed)
  if (themed) {
    root.style.setProperty('--reader-bg', palette.value.bg)
    root.style.setProperty('--reader-fg', palette.value.fg)
  }
  const href = fonts[settings.font].href
  if (href && !document.querySelector(`link[data-reader-font="${settings.font}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.dataset.readerFont = settings.font
    document.head.append(link)
  }
}
watch(settings, () => {
  if (!settingsLoaded) return
  applyAppearance()
  try { localStorage.setItem(settingsKey, JSON.stringify(settings)) } catch { /* 保存できなくても変更は効く。 */ }
})
watch(settingsOpen, async open => {
  if (!open) return
  await nextTick()
  sheet.value?.focus({ preventScroll: true })
})

/* ---- メニューの出し入れ・進み具合・読みかけ位置 ---- */
const chrome = ref(true)
const progress = ref(0)
const body = ref<HTMLElement | null>(null)
const notice = ref<{ text: string; action?: string; run?: () => void } | null>(null)
const showNotice = (text: string, action?: string, run?: () => void) => {
  clearTimeout(toastTimer)
  notice.value = { text, action, run }
  toastTimer = setTimeout(() => { notice.value = null }, 5000)
}
const runNotice = () => {
  const run = notice.value?.run
  notice.value = null
  run?.()
}
const positionKey = `nekonoha-novel-pos:${novel.slug}:${episode.number}`
let lastY = 0
let scrollFrame = 0
let saveTimer: ReturnType<typeof setTimeout> | undefined
let toastTimer: ReturnType<typeof setTimeout> | undefined
let restoreTimer: ReturnType<typeof setTimeout> | undefined
let restored = false
const scrollable = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
const setChrome = (visible: boolean) => {
  chrome.value = visible
  document.documentElement.classList.toggle('reader-chrome-hidden', !visible)
}
const savePosition = () => {
  try {
    const max = scrollable()
    localStorage.setItem(positionKey, String(max > 0 ? Math.min(1, window.scrollY / max) : 0))
  } catch { /* 保存できない環境でも読める。 */ }
}
const updateScroll = () => {
  scrollFrame = 0
  const y = window.scrollY
  const max = scrollable()
  progress.value = max > 0 ? Math.round(Math.min(1, y / max) * 100) : 100
  // 下へ読み進めるとメニューを隠し、少し戻る・先頭・末尾では出す。
  if (y < 80 || max - y < 140) setChrome(true)
  else if (y - lastY > 8) setChrome(false)
  else if (lastY - y > 8) setChrome(true)
  if (Math.abs(y - lastY) > 8) lastY = y
  clearTimeout(saveTimer)
  saveTimer = setTimeout(savePosition, 400)
}
const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll) }
const restorePosition = () => {
  if (restored) return
  restored = true
  try {
    const ratio = Number.parseFloat(localStorage.getItem(positionKey) ?? '')
    // ほぼ先頭・読み終わりの場合は先頭から。
    const mark = bookmarkHere.value && route.query.bookmark !== undefined ? paragraphs()[bookmark.value!.paragraph] : undefined
    if (mark) {
      // 目次の「しおりから読む」で来たときは、しおりの段落へ。
      window.scrollTo({ top: Math.max(0, mark.getBoundingClientRect().top + window.scrollY - 110), behavior: 'auto' })
      lastY = window.scrollY
      showNotice(locale.value === 'ja' ? 'しおりの位置から表示しています' : 'Opened at your bookmark')
    } else if (Number.isFinite(ratio) && ratio > .03 && ratio < .97 && window.scrollY < 40) {
      window.scrollTo({ top: ratio * scrollable(), behavior: 'auto' })
      lastY = window.scrollY
      showNotice(locale.value === 'ja' ? '前回の続きから表示しています' : 'Resumed where you left off', locale.value === 'ja' ? '最初から' : 'Start over', restart)
    }
  } catch { /* 保存できない環境でも読める。 */ }
  updateScroll()
}
const restart = () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
/* ---- しおり（作品ごとに1つ、この端末のブラウザにだけ保存） ---- */
type Bookmark = { episode: number; paragraph: number; at: string }
const bookmarkKey = `nekonoha-novel-bookmark:${novel.slug}`
const bookmark = ref<Bookmark | null>(null)
const bookmarkHere = computed(() => bookmark.value?.episode === episode.number)
const paragraphs = () => Array.from(body.value?.querySelectorAll<HTMLElement>(':scope > p') ?? [])
const paintBookmark = () => {
  const items = paragraphs()
  items.forEach(item => item.classList.remove('bookmarked'))
  if (bookmarkHere.value) items[bookmark.value!.paragraph]?.classList.add('bookmarked')
}
const writeBookmark = (value: Bookmark | null) => {
  bookmark.value = value
  try {
    if (value) localStorage.setItem(bookmarkKey, JSON.stringify(value))
    else localStorage.removeItem(bookmarkKey)
  } catch { /* 保存できない環境では、このページを開いている間だけ有効。 */ }
  paintBookmark()
}
// いま画面のいちばん上に見えている段落に挟む。
const placeBookmark = () => {
  const before = bookmark.value
  const index = Math.max(0, paragraphs().findIndex(item => item.getBoundingClientRect().bottom > 100))
  writeBookmark({ episode: episode.number, paragraph: index, at: new Date().toISOString() })
  setChrome(true)
  showNotice(locale.value === 'ja' ? 'ここにしおりを挟みました' : 'Bookmark placed here', locale.value === 'ja' ? '取り消す' : 'Undo', () => writeBookmark(before))
}
// 本文をタップ（文字選択やリンク以外）でメニューを出し入れする。
const onBodyClick = (event: MouseEvent) => {
  if (window.getSelection()?.toString() || (event.target as Element | null)?.closest('a')) return
  setChrome(!chrome.value)
}

/* ---- スワイプで前後の話へ ---- */
const swipe = reactive<{ active: boolean; offset: number; direction: '' | 'next' | 'previous'; armed: boolean }>({ active: false, offset: 0, direction: '', armed: false })
let touch: { x: number; y: number; axis: '' | 'x' | 'y' } | null = null
const swipeThreshold = 90
const swipeLabel = computed(() => {
  const target = swipe.direction === 'next' ? next : previous
  if (target) return target.title
  if (swipe.direction === 'next') return locale.value === 'ja' ? '最新話です' : 'This is the latest episode'
  return locale.value === 'ja' ? '最初の話です' : 'This is the first episode'
})
const resetSwipe = () => {
  touch = null
  swipe.active = false
  swipe.offset = 0
  swipe.direction = ''
  swipe.armed = false
}
const onTouchStart = (event: TouchEvent) => {
  resetSwipe()
  if (event.touches.length !== 1 || settingsOpen.value) return
  const point = event.touches[0]
  // 画面の端は、ブラウザの「戻る／進む」ジェスチャーに譲る。
  if (point.clientX < 24 || point.clientX > window.innerWidth - 24) return
  if ((event.target as Element | null)?.closest('.reader-toolbar, .sheet, .reader-toast')) return
  touch = { x: point.clientX, y: point.clientY, axis: '' }
}
const onTouchMove = (event: TouchEvent) => {
  if (!touch || event.touches.length !== 1) { if (touch) resetSwipe(); return }
  const dx = event.touches[0].clientX - touch.x
  const dy = event.touches[0].clientY - touch.y
  if (!touch.axis) {
    if (Math.abs(dy) > 10 && Math.abs(dy) >= Math.abs(dx)) { touch = null; return }
    if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.6 && !window.getSelection()?.toString()) touch.axis = 'x'
    else return
  }
  const direction = dx < 0 ? 'next' : 'previous'
  const target = direction === 'next' ? next : previous
  swipe.active = true
  swipe.direction = direction
  // 行き先がないときは、抵抗感のある短い動きだけ返す。
  swipe.offset = target ? dx * .35 : dx * .12
  swipe.armed = Boolean(target) && Math.abs(dx) > swipeThreshold
}
const onTouchEnd = () => {
  const target = swipe.direction === 'next' ? next : previous
  const go = swipe.armed && target
  resetSwipe()
  if (go && target) navigateTo(episodeLink(target))
}

/* ---- キーボード ---- */
const onKeydown = (event: KeyboardEvent) => {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  if (event.key === 'Escape' && settingsOpen.value) { settingsOpen.value = false; return }
  if ((event.target as Element | null)?.closest('input, textarea, select, [contenteditable]')) return
  if (event.key === 'ArrowRight' && next) navigateTo(episodeLink(next))
  else if (event.key === 'ArrowLeft' && previous) navigateTo(episodeLink(previous))
}

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(settingsKey) ?? '{}')
    if (Number.isInteger(saved.size) && saved.size >= 0 && saved.size < sizes.length) settings.size = saved.size
    if (Number.isInteger(saved.leading) && saved.leading >= 0 && saved.leading < leadings.length) settings.leading = saved.leading
    if (typeof saved.font === 'string' && saved.font in fonts) settings.font = saved.font as FontKey
    if (isColor(saved.bg)) settings.bg = saved.bg
    if (isColor(saved.fg)) settings.fg = saved.fg
    if (saved.theme === 'custom' || (typeof saved.theme === 'string' && saved.theme in themes)) settings.theme = saved.theme as ThemeKey
    const mark = JSON.parse(localStorage.getItem(bookmarkKey) ?? 'null')
    if (mark && Number.isInteger(mark.episode) && Number.isInteger(mark.paragraph)) bookmark.value = mark
    localStorage.setItem(`nekonoha-novel-last:${novel.slug}`, String(episode.number))
  } catch { /* 保存できない環境でも読める。 */ }
  applyAppearance()
  paintBookmark()
  nextTick(() => { settingsLoaded = true })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pagehide', savePosition)
  window.addEventListener('keydown', onKeydown)
  // ページ切り替え後は Nuxt が先頭へスクロールするので、その後に読みかけ位置へ戻す。
  if (nuxtApp.isHydrating) requestAnimationFrame(restorePosition)
  else {
    nuxtApp.hooks.hookOnce('page:transition:finish', () => requestAnimationFrame(restorePosition))
    restoreTimer = setTimeout(restorePosition, 900)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('pagehide', savePosition)
  window.removeEventListener('keydown', onKeydown)
  cancelAnimationFrame(scrollFrame)
  clearTimeout(saveTimer)
  clearTimeout(toastTimer)
  clearTimeout(restoreTimer)
  if (restored) savePosition()
  document.documentElement.classList.remove('reader-chrome-hidden', 'reader-themed')
})
useSeoMeta({
  title: () => `${episode.title} | ${novel.title} — 針の筵`,
  description: () => `${novel.title} ${episode.title}`,
  ogTitle: () => `${episode.title} | ${novel.title}`,
  ogUrl: `https://nekonoha.github.io/novels/${novel.slug}/${episode.number}`
})
useHead({ link: [{ rel: 'canonical', href: `https://nekonoha.github.io/novels/${novel.slug}/${episode.number}` }] })
</script>
<style scoped>
/* 読む場所なので、行は短く、行間は広く。縦スクロールはブラウザに任せ、横の動きだけ自前で扱う。 */
.reader { width: min(40rem, calc(100% - 40px)); margin-inline: auto; padding-block: 32px calc(150px + env(safe-area-inset-bottom)); touch-action: pan-y pinch-zoom; }
.reader-back { display: inline-flex; align-items: center; gap: .7em; max-width: 100%; font-size: .875rem; }
.reader-back span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.reader-back i { font-size: .85em; color: var(--color-text-muted); }
.reader-head { margin-top: 40px; padding-bottom: 28px; border-bottom: 1px solid var(--line); }
.reader-head p { color: var(--color-text-muted); font-size: .8125rem; font-variant-numeric: tabular-nums; }
.reader-head p span { margin-left: 14px; }
h1 { margin-top: 6px; font-size: clamp(1.5rem, 4.5vw, 2rem); font-weight: 800; line-height: 1.5; }
.reader-body { margin-top: 40px; font-family: var(--reader-font, inherit); font-size: var(--reader-size, 1.06rem); line-height: var(--reader-leading, 2.1); overflow-wrap: anywhere; transform: translateX(var(--swipe-x, 0px)); transition: transform .35s var(--ease-out); }
.is-swiping .reader-body { transition: none; }
.reader-body :deep(.blank) { line-height: 1.6; }
/* しおりを挟んだ段落の目印。 */
.reader-body :deep(p) { position: relative; }
.reader-body :deep(p.bookmarked)::before { content: ''; position: absolute; top: .45em; left: -14px; width: 5px; height: 1.3em; border-radius: 3px; background: var(--color-accent); }
.reader-body :deep(rt) { font-size: .5em; color: var(--color-sub); }
.reader-body :deep(.bouten) { font-style: normal; text-emphasis: filled sesame; -webkit-text-emphasis: filled sesame; }

.reader-pager { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 72px; }
.pager-link { display: flex; flex-direction: column; gap: 4px; min-height: 76px; padding: 14px 18px; border: 1px solid var(--line); border-radius: var(--radius-media); background: var(--color-panel); text-decoration: none; transition: border-color var(--dur-fast), color var(--dur-fast), transform var(--dur-base) var(--ease-out); }
.pager-link small { display: inline-flex; align-items: center; gap: .6em; color: var(--color-text-muted); font-size: .8125rem; }
.pager-link span { font-weight: 700; line-height: 1.5; }
.pager-next { text-align: right; }
.pager-next small { justify-content: flex-end; }
.pager-link:hover { border-color: var(--color-accent); color: var(--color-accent); transform: translateY(-2px); }
/* 操作のヒントは、タッチ端末でだけ見せる。 */
.gesture-tip { display: none; margin-top: 20px; color: var(--color-text-muted); font-size: .8125rem; text-align: center; }
@media(hover:none) and (pointer:coarse) { .gesture-tip { display: block; } }

/* スワイプ中、指の進む先に行き先を出す。しきい値を越えると色が変わる。 */
.swipe-hint { position: fixed; z-index: 120; top: 50%; display: flex; align-items: center; gap: 10px; max-width: min(70vw, 300px); padding: 12px 16px; border: 1px solid var(--line); border-radius: var(--radius-pill); color: var(--color-text-muted); background: var(--color-panel); box-shadow: var(--shadow-soft); font-size: .875rem; font-weight: 500; translate: 0 -50%; pointer-events: none; transition: background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast), scale var(--dur-fast) var(--ease-spring); }
.swipe-hint span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.swipe-hint.next { right: 12px; flex-direction: row-reverse; }
.swipe-hint.previous { left: 12px; }
.swipe-hint.armed { border-color: var(--color-accent); color: var(--color-main); background: var(--color-accent); scale: 1.06; }

.reader-toast { position: fixed; z-index: 115; left: 50%; bottom: calc(86px + env(safe-area-inset-bottom)); display: flex; align-items: center; gap: 14px; width: max-content; max-width: calc(100% - 24px); padding: 8px 8px 8px 18px; border-radius: var(--radius-pill); color: var(--color-main); background: var(--color-text); box-shadow: var(--shadow-soft); font-size: .8125rem; translate: -50% 0; animation: toast-in .4s var(--ease-out) both; }
.reader-toast button { min-height: 36px; padding: 4px 14px; border: 0; border-radius: var(--radius-pill); color: var(--color-text); background: var(--color-main); font-size: .8125rem; font-weight: 700; }
@keyframes toast-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

.reader-toolbar { position: fixed; z-index: 110; left: 50%; bottom: calc(14px + env(safe-area-inset-bottom)); display: flex; align-items: center; gap: 2px; padding: 5px; border: 1px solid var(--line); border-radius: var(--radius-pill); background: color-mix(in srgb, var(--color-panel) 88%, transparent); backdrop-filter: blur(18px) saturate(1.3); -webkit-backdrop-filter: blur(18px) saturate(1.3); box-shadow: var(--shadow-soft); translate: -50% 0; transition: translate .32s var(--ease-out), opacity .2s; }
.reader-toolbar.hidden { translate: -50% calc(100% + 32px); opacity: 0; pointer-events: none; }
.reader-toolbar a, .reader-toolbar button, .reader-toolbar .disabled { display: grid; place-items: center; width: 50px; height: 48px; border: 0; border-radius: var(--radius-pill); background: transparent; color: var(--color-text); text-decoration: none; transition: background var(--dur-fast), color var(--dur-fast); }
.reader-toolbar a:hover, .reader-toolbar button:hover, .reader-toolbar button[aria-expanded="true"], .reader-toolbar button[aria-pressed="true"] { color: var(--color-accent); background: var(--color-surface); }
.reader-toolbar .disabled { color: var(--color-text-muted); opacity: .35; }
.aa { font-weight: 800; letter-spacing: .02em; }
.toolbar-progress { min-width: 48px; padding-inline: 2px; color: var(--color-text-muted); font-size: .8125rem; font-variant-numeric: tabular-nums; text-align: center; }

.sheet-backdrop { position: fixed; z-index: 105; inset: 0; background: #0000004d; animation: fade-in .2s both; }
.sheet { position: fixed; z-index: 108; left: 50%; bottom: calc(82px + env(safe-area-inset-bottom)); width: min(420px, calc(100% - 24px)); max-height: calc(100dvh - 110px - env(safe-area-inset-bottom)); overflow-y: auto; overscroll-behavior: contain; padding: 10px 18px 16px; border: 1px solid var(--line); border-radius: var(--radius-panel); background: var(--color-panel); box-shadow: var(--shadow-strong); translate: -50% 0; animation: sheet-in .32s var(--ease-out) both; }
.sheet:focus { outline: none; }
.sheet-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; min-height: 64px; border-bottom: 1px solid var(--line); font-size: .9rem; }
.stepper, .segmented { display: flex; align-items: center; gap: 2px; padding: 3px; border-radius: var(--radius-pill); background: var(--color-surface); }
.stepper button, .segmented button { display: grid; place-items: center; min-width: 44px; height: 40px; padding-inline: 14px; border: 0; border-radius: var(--radius-pill); background: transparent; color: var(--color-text); font-size: .875rem; transition: background var(--dur-fast), color var(--dur-fast); }
.stepper button:disabled { color: var(--color-text-muted); opacity: .4; cursor: default; }
.stepper button:hover:not(:disabled) { background: var(--color-panel); }
.stepper output { min-width: 3.4em; color: var(--color-text-muted); font-size: .8125rem; font-variant-numeric: tabular-nums; text-align: center; }
.segmented button[aria-pressed="true"] { color: var(--color-main); background: var(--color-accent); font-weight: 700; }
.font-choices { display: grid; grid-template-columns: 1fr 1fr; border-radius: 22px; }
.font-choices button { padding-inline: 10px; }
.swatches { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; padding-block: 10px; }
.swatch { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid var(--line); border-radius: 50%; font-size: .9rem; font-weight: 700; transition: outline-color var(--dur-fast), transform var(--dur-fast) var(--ease-spring); outline: 2px solid transparent; outline-offset: 2px; }
.swatch.site { color: var(--color-text); background: linear-gradient(135deg, #f5f6f8 50%, #0f1216 50%); text-shadow: 0 0 3px #fff, 0 0 3px #fff; color: #14171c; }
.swatch[aria-pressed="true"] { outline-color: var(--color-accent); transform: scale(1.06); }
.custom-colors { flex-wrap: wrap; justify-content: flex-end; padding-block: 10px; }
.custom-colors label { display: inline-flex; align-items: center; gap: 10px; font-size: .8125rem; color: var(--color-text-muted); }
.custom-colors input { width: 48px; height: 40px; padding: 2px; border: 1px solid var(--line); border-radius: 10px; background: var(--color-panel); cursor: pointer; }
.contrast-note { width: 100%; color: var(--color-text-muted); font-size: .8125rem; text-align: right; }
.sheet-close { width: 100%; margin-top: 14px; }
@keyframes sheet-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

@media(max-width:600px) {
  .reader { padding-top: 22px; }
  .reader-head { margin-top: 28px; }
  .reader-pager { grid-template-columns: 1fr; margin-top: 56px; }
  .reader-pager > span { display: none; }
  .pager-next { order: -1; }
  .reader-toolbar { gap: 0; }
}
</style>
<style>
/* 読書中は、下へ読み進めるとサイトのヘッダーも一緒に隠れる。 */
.site-header { transition: transform .32s cubic-bezier(.16, 1, .3, 1); }
.reader-chrome-hidden .site-header { transform: translateY(-120%); }
/* 読者が選んだ配色。本文まわり（とフッター）だけを塗り替え、サイトのヘッダーはそのまま。 */
html.reader-themed body { background: var(--reader-bg); }
html.reader-themed .ambient-scene { display: none; }
html.reader-themed #main-content, html.reader-themed .footer {
  --color-main: var(--reader-bg); --color-main-strong: var(--reader-bg);
  --color-text: var(--reader-fg); --color-sub: var(--reader-fg); --color-sub-strong: var(--reader-fg);
  --color-text-muted: color-mix(in srgb, var(--reader-fg) 64%, var(--reader-bg));
  --line: color-mix(in srgb, var(--reader-fg) 20%, var(--reader-bg));
  --color-panel: color-mix(in srgb, var(--reader-fg) 5%, var(--reader-bg));
  --color-surface: color-mix(in srgb, var(--reader-fg) 12%, var(--reader-bg));
  --color-accent: var(--reader-fg); --color-accent-strong: var(--reader-fg);
  color: var(--reader-fg);
}
</style>

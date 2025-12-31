<template>
  <div
    class="screenshot-carousel"
    :style="{
      '--thumb-size': `${thumbSizePx}px`,
      '--thumb-gap': `${thumbGapPx}px`
    }"
  >
    <!-- メイン画像表示エリア -->
    <div
      class="carousel-main-area"
      @touchstart.passive="onCarouselTouchStart"
      @touchmove.passive="onCarouselTouchMove"
      @touchend.passive="onCarouselTouchEnd"
      @touchcancel.passive="onCarouselTouchCancel"
      @pointerdown="onCarouselPointerStart"
      @pointermove.passive="onCarouselPointerMove"
      @pointerup="onCarouselPointerEnd"
      @pointercancel="onCarouselPointerCancel"
    >
      <button class="carousel-btn carousel-btn-prev" @click="prevScreenshot">‹</button>
      <div class="carousel-image-container" @click="$emit('screenshot-click', screenshotCarouselIndex)">
        <Transition name="carousel-forward" mode="out-in">
          <img
            :key="screenshotCarouselIndex"
            :src="screenshots[screenshotCarouselIndex]"
            :alt="`Screenshot ${screenshotCarouselIndex + 1}`"
            class="carousel-screenshot"
          />
        </Transition>
      </div>
      <button class="carousel-btn carousel-btn-next" @click="nextScreenshot">›</button>
    </div>

    <!-- サムネイル行 -->
    <div
      class="carousel-thumbnails-area"
      @touchstart.passive="onThumbnailTouchStart"
      @touchend.passive="onThumbnailTouchEnd"
      @touchcancel.passive="onThumbnailTouchCancel"
      @pointerdown="onThumbnailPointerStart"
      @pointerup="onThumbnailPointerEnd"
    >
      <button class="thumbnail-btn thumbnail-btn-prev" @click="prevThumbnailScroll">‹</button>
      <div class="carousel-thumbnails-container" ref="thumbnailsContainerRef">
        <div
          class="carousel-thumbnails"
          :style="{
            transform: `translateX(calc(-${thumbnailScrollIndex * stepWidth}px))`
          }"
        >
          <img
            v-for="(screenshot, index) in screenshots"
            :key="`thumb-${index}`"
            :src="screenshot"
            :alt="`Thumbnail ${index + 1}`"
            class="carousel-thumbnail"
            :class="{ active: index === screenshotCarouselIndex }"
            @click="selectScreenshot(index)"
          />
        </div>
      </div>
      <button class="thumbnail-btn thumbnail-btn-next" @click="nextThumbnailScroll">›</button>
    </div>
    <div class="carousel-counter">{{ screenshotCarouselIndex + 1 }} / {{ screenshots.length }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  screenshots: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'screenshot-click': [index: number]
}>()

// カルーセル設定（JS と CSS を同期させるため、サイズは JS から制御）
const viewportWidth = ref(1024)
const clampValue = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const thumbSizePx = computed(() => Math.round(clampValue(viewportWidth.value * 0.06, 28, 40)))
const thumbGapPx = computed(() => Math.round(clampValue(viewportWidth.value * 0.005, 2, 4)))
const stepWidth = computed(() => thumbSizePx.value + thumbGapPx.value)

const screenshotCarouselIndex = ref(0)
const thumbnailScrollIndex = ref(0)
const visibleThumbCount = ref(1)
const thumbnailsContainerRef = ref<HTMLElement | null>(null)
const totalThumbs = computed(() => props.screenshots.length)
const maxThumbnailScroll = computed(() => Math.max(0, totalThumbs.value - visibleThumbCount.value))
const thumbnailStep = computed(() => Math.max(1, visibleThumbCount.value - 1))

const recalcVisibleThumbs = () => {
  const containerWidth = thumbnailsContainerRef.value?.clientWidth ?? 0
  const visible = Math.max(1, Math.floor((containerWidth + thumbGapPx.value) / stepWidth.value))
  visibleThumbCount.value = visible
  thumbnailScrollIndex.value = Math.min(thumbnailScrollIndex.value, maxThumbnailScroll.value)
}

const handleResize = () => {
  viewportWidth.value = window.innerWidth
  recalcVisibleThumbs()
}

// メイン画像操作
const nextScreenshot = () => {
  const newIndex = (screenshotCarouselIndex.value + 1) % props.screenshots.length
  screenshotCarouselIndex.value = newIndex
  updateThumbnailScroll(newIndex)
}

const prevScreenshot = () => {
  const newIndex = (screenshotCarouselIndex.value - 1 + props.screenshots.length) % props.screenshots.length
  screenshotCarouselIndex.value = newIndex
  updateThumbnailScroll(newIndex)
}

const selectScreenshot = (index: number) => {
  screenshotCarouselIndex.value = index
  updateThumbnailScroll(index)
}

const updateThumbnailScroll = (index: number) => {
  const halfVisible = Math.floor(visibleThumbCount.value / 2)
  const target = Math.min(
    Math.max(index - halfVisible, 0),
    maxThumbnailScroll.value
  )
  thumbnailScrollIndex.value = target
}

// サムネイルスクロール操作
const nextThumbnailScroll = () => {
  thumbnailScrollIndex.value = Math.min(
    thumbnailScrollIndex.value + thumbnailStep.value,
    maxThumbnailScroll.value
  )
}

const prevThumbnailScroll = () => {
  thumbnailScrollIndex.value = Math.max(thumbnailScrollIndex.value - thumbnailStep.value, 0)
}

// タッチ・ポインター操作
const swipeThreshold = 45
const carouselTouchStart = ref<{ x: number; y: number } | null>(null)
const carouselPointerStart = ref<{ x: number; y: number } | null>(null)
const isDraggingCarousel = ref(false)

const onCarouselTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (!touch) return
  carouselTouchStart.value = { x: touch.clientX, y: touch.clientY }
  isDraggingCarousel.value = false
}

const onCarouselTouchMove = (e: TouchEvent) => {
  if (!carouselTouchStart.value) return
  const touch = e.touches[0]
  if (!touch) return
  const dx = Math.abs(touch.clientX - carouselTouchStart.value.x)
  if (dx > swipeThreshold / 2) {
    isDraggingCarousel.value = true
  }
}

const onCarouselTouchEnd = (e: TouchEvent) => {
  if (!carouselTouchStart.value) return
  const touch = e.changedTouches[0]
  if (!touch) {
    carouselTouchStart.value = null
    isDraggingCarousel.value = false
    return
  }

  const dx = touch.clientX - carouselTouchStart.value.x
  const dy = touch.clientY - carouselTouchStart.value.y
  carouselTouchStart.value = null
  isDraggingCarousel.value = false

  if (Math.abs(dx) < swipeThreshold || Math.abs(dx) < Math.abs(dy)) return
  if (dx < 0) {
    nextScreenshot()
  } else {
    prevScreenshot()
  }
}

const onCarouselTouchCancel = () => {
  carouselTouchStart.value = null
  isDraggingCarousel.value = false
}

const onCarouselPointerStart = (e: PointerEvent) => {
  if (e.pointerType === 'touch') return
  carouselPointerStart.value = { x: e.clientX, y: e.clientY }
  isDraggingCarousel.value = false
}

const onCarouselPointerMove = (e: PointerEvent) => {
  if (e.pointerType === 'touch' || !carouselPointerStart.value) return
  const dx = Math.abs(e.clientX - carouselPointerStart.value.x)
  if (dx > swipeThreshold / 2) {
    isDraggingCarousel.value = true
  }
}

const onCarouselPointerEnd = (e: PointerEvent) => {
  if (e.pointerType === 'touch') return
  if (!carouselPointerStart.value) return
  const dx = e.clientX - carouselPointerStart.value.x
  const dy = e.clientY - carouselPointerStart.value.y
  carouselPointerStart.value = null
  isDraggingCarousel.value = false
  if (Math.abs(dx) < swipeThreshold || Math.abs(dx) < Math.abs(dy)) return
  if (dx < 0) {
    nextScreenshot()
  } else {
    prevScreenshot()
  }
}

const onCarouselPointerCancel = () => {
  carouselPointerStart.value = null
  isDraggingCarousel.value = false
}

// サムネイルスワイプハンドラ
const thumbnailTouchStart = ref<{ x: number; y: number } | null>(null)
const thumbnailPointerStart = ref<{ x: number; y: number } | null>(null)

const onThumbnailTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (!touch) return
  thumbnailTouchStart.value = { x: touch.clientX, y: touch.clientY }
}

const onThumbnailTouchEnd = (e: TouchEvent) => {
  if (!thumbnailTouchStart.value) return
  const touch = e.changedTouches[0]
  if (!touch) {
    thumbnailTouchStart.value = null
    return
  }

  const dx = touch.clientX - thumbnailTouchStart.value.x
  const dy = touch.clientY - thumbnailTouchStart.value.y
  thumbnailTouchStart.value = null

  if (Math.abs(dx) < swipeThreshold || Math.abs(dx) < Math.abs(dy)) return
  if (dx < 0) {
    nextThumbnailScroll()
  } else {
    prevThumbnailScroll()
  }
}

const onThumbnailTouchCancel = () => {
  thumbnailTouchStart.value = null
}

const onThumbnailPointerStart = (e: PointerEvent) => {
  if (e.pointerType === 'touch') return
  thumbnailPointerStart.value = { x: e.clientX, y: e.clientY }
}

const onThumbnailPointerEnd = (e: PointerEvent) => {
  if (e.pointerType === 'touch') return
  if (!thumbnailPointerStart.value) return
  const dx = e.clientX - thumbnailPointerStart.value.x
  const dy = e.clientY - thumbnailPointerStart.value.y
  thumbnailPointerStart.value = null
  if (Math.abs(dx) < swipeThreshold || Math.abs(dx) < Math.abs(dy)) return
  if (dx < 0) {
    nextThumbnailScroll()
  } else {
    prevThumbnailScroll()
  }
}

onMounted(() => {
  viewportWidth.value = window.innerWidth
  recalcVisibleThumbs()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.screenshot-carousel {
  display: flex;
  flex-direction: column;
  gap: clamp(0.25rem, 2vw, 0.75rem);
  margin-top: clamp(0.5rem, 2vw, 1rem);
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  overflow-x: hidden;
}

.carousel-main-area {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.carousel-image-container {
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid rgba(182, 141, 64, 0.35);
  aspect-ratio: 5 / 4;
  cursor: pointer;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.carousel-image-container:hover {
  border-color: rgba(182, 141, 64, 0.6);
}

.carousel-screenshot {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 6px;
  object-fit: cover;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  font-size: clamp(0.8rem, 2vw, 1.3rem);
  padding: clamp(1px, 0.4vw, 6px) clamp(3px, 0.8vw, 6px);
  cursor: pointer;
  border-radius: 3px;
  opacity: 0;
  transition: opacity 0.3s ease, background 0.3s ease;
  z-index: 10;
  box-sizing: border-box;
}

.carousel-main-area:hover .carousel-btn {
  opacity: 1;
}

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.9);
}

.carousel-btn-prev {
  left: clamp(1px, 0.3vw, 6px);
}

.carousel-btn-next {
  right: clamp(1px, 0.3vw, 6px);
}

/* サムネイル行 */
.carousel-thumbnails-area {
  display: flex;
  align-items: center;
  gap: clamp(3px, 1vw, 6px);
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.carousel-thumbnails-container {
  flex: 1;
  overflow: hidden;
  border-radius: 3px;
  background: rgba(20, 20, 20, 0.5);
  padding: calc(var(--thumb-gap) * 0.5);
  box-sizing: border-box;
}

.carousel-thumbnails {
  display: flex;
  gap: var(--thumb-gap);
  transition: transform 0.4s ease;
}

.carousel-thumbnail {
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 3px;
  border: 1px solid rgba(182, 141, 64, 0.3);
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s ease;
  flex-shrink: 0;
  object-fit: cover;
  box-sizing: border-box;
}

.carousel-thumbnail:hover {
  opacity: 0.85;
  transform: scale(1.05);
}

.carousel-thumbnail.active {
  border-color: rgba(182, 141, 64, 0.8);
  opacity: 1;
  box-shadow: 0 0 10px rgba(182, 141, 64, 0.4);
}

.thumbnail-btn {
  background: rgba(0, 0, 0, 0.55);
  border: none;
  color: white;
  font-size: clamp(0.7rem, 1.8vw, 0.9rem);
  padding: clamp(1px, 0.4vw, 4px) clamp(3px, 0.8vw, 6px);
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.3s ease;
  opacity: 0.7;
  transition: opacity 0.3s ease, background 0.3s ease;
  flex-shrink: 0;
  box-sizing: border-box;
}

.thumbnail-btn:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.8);
}

.carousel-counter {
  text-align: center;
  margin-top: 0.3rem;
  color: var(--color-sub);
  font-size: 0.75rem;
}
</style>

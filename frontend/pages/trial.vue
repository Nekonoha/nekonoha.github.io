<template>
  <div>
    <EerieBackground />
    <section class="game-page">
      <div class="header-section">
        <h1 class="game-title">{{ t('trial.title') }}</h1>
        <p class="game-description">{{ t('trial.description') }}</p>
      </div>

    <div class="content-section">
      <div class="info-card">
        <h2>▼{{ t('trial.gameInfo') }}</h2>
        <ul>
          <li>{{ t('trial.effectCount') }} <strong>{{ t('trial.effectTotal') }}</strong>{{ t('trial.period') }}</li>
          <li>{{ t('trial.edCount') }} <strong>{{ t('trial.edTotal') }}</strong> {{ t('trial.implemented') }}{{ t('trial.period') }}</li>
        </ul>
      </div>

      <div class="info-card">
        <h2>▼{{ t('trial.howToPlay') }}</h2>
        <p>{{ t('trial.gameplay1') }}</p>
        <p>{{ t('trial.gameplay2') }}</p>
        <p>{{ t('trial.gameplay3') }}</p>
        <p>{{ t('trial.gameplay4') }}</p>
        
        <h3>{{ t('trial.controls') }}</h3>
        <table class="control-table">
          <tbody>
            <tr>
              <td>{{ t('trial.move') }}</td>
              <td>{{ t('trial.moveKey') }}</td>
            </tr>
            <tr>
              <td>{{ t('trial.decide') }}</td>
              <td>{{ t('trial.decideKey') }}</td>
            </tr>
            <tr>
              <td>{{ t('trial.cancel') }}</td>
              <td>{{ t('trial.cancelKey') }}</td>
            </tr>
            <tr>
              <td>{{ t('trial.favorite') }}</td>
              <td>{{ t('trial.favoriteKey') }}</td>
            </tr>
            <tr>
              <td>{{ t('trial.action') }}</td>
              <td>{{ t('trial.actionKey') }}</td>
            </tr>
            <tr>
              <td>{{ t('trial.release') }}</td>
              <td>{{ t('trial.releaseKey') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="info-card">
        <h2>▼{{ t('trial.screenshots') }}</h2>
        <div class="screenshot-grid">
          <img src="/images/trial/1.png" alt="Screenshot 1" @click="openLightbox(0)" class="clickable" />
          <img src="/images/trial/2.png" alt="Screenshot 2" @click="openLightbox(1)" class="clickable" />
          <img src="/images/trial/3.png" alt="Screenshot 3" @click="openLightbox(2)" class="clickable" />
          <img src="/images/trial/4.png" alt="Screenshot 4" @click="openLightbox(3)" class="clickable" />
          <img src="/images/trial/5.png" alt="Screenshot 5" @click="openLightbox(4)" class="clickable" />
          <img src="/images/trial/6.png" alt="Screenshot 6" @click="openLightbox(5)" class="clickable" />
        </div>
      </div>

      <!-- ライトボックスモーダル -->
      <div
        v-if="lightboxOpen"
        class="lightbox-overlay"
        @click="closeLightbox"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
        @touchcancel.passive="onTouchCancel"
      >
        <div class="lightbox-content" @click.stop>
          <button class="lightbox-close" @click="closeLightbox">×</button>
          <button class="lightbox-nav lightbox-prev" @click="prevImage" v-if="currentImageIndex > 0">‹</button>
          <img :src="screenshots[currentImageIndex]" :alt="`Screenshot ${currentImageIndex + 1}`" class="lightbox-image" />
          <button class="lightbox-nav lightbox-next" @click="nextImage" v-if="currentImageIndex < screenshots.length - 1">›</button>
          <div class="lightbox-counter">{{ currentImageIndex + 1 }} / {{ screenshots.length }}</div>
        </div>
      </div>

      <div class="info-card">
        <h2>▼{{ t('trial.download') }}</h2>
        <p>{{ t('trial.downloadText') }} <strong>{{ t('trial.version') }}</strong> {{ t('trial.versionSuffix') }}</p>
        <p>{{ t('trial.downloadLink') }}</p>
        <a href="http://www1.axfc.net/u/3511483" target="_blank" class="download-btn">
          <i class="fas fa-download"></i> {{ t('trial.downloadButton') }}
        </a>
      </div>
    </div>
    </section>
  </div>
</template>

<style scoped>
.game-page {
  animation: fadeIn 1s ease-out;
  background: 
    linear-gradient(180deg, rgba(60, 47, 47, 0.88) 0%, rgba(48, 36, 32, 0.9) 50%, rgba(40, 31, 28, 0.92) 100%),
    url('/images/trial/back.png');
  background-size: cover, cover;
  background-position: center, center;
  background-repeat: no-repeat;
  min-height: 100vh;
  color: var(--color-text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  padding: 2rem;
  overflow-x: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
}

.game-title {
  font-family: 'Orbitron', monospace;
  font-size: clamp(2rem, 3.8vw + 0.25rem, 2.6rem);
  font-weight: 900;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-sub) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 
    0 0 20px rgba(182, 141, 64, 0.45),
    0 0 40px rgba(182, 141, 64, 0.3),
    0 0 60px rgba(182, 141, 64, 0.2);
  margin-bottom: 1rem;
  letter-spacing: 1px;
  white-space: nowrap;
  max-width: 70vw;
  margin-left: auto;
  margin-right: auto;
}

.game-description {
  font-size: 1.2rem;
  color: var(--color-sub);
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.content-section {
  display: grid;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.info-card {
  background: rgba(44, 35, 35, 0.86);
  border: 1px solid rgba(182, 141, 64, 0.35);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(182, 141, 64, 0.12);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  border-color: rgba(182, 141, 64, 0.55);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(182, 141, 64, 0.25);
}

.info-card h2 {
  font-family: 'Orbitron', monospace;
  color: var(--color-sub);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(182, 141, 64, 0.4);
}

.info-card h3 {
  font-family: 'Inter', sans-serif;
  color: var(--color-accent);
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem 0;
}

.info-card p {
  line-height: 1.7;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  color: var(--color-sub);
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.control-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.control-table td {
  padding: 0.8rem;
  border-bottom: 1px solid rgba(182, 141, 64, 0.25);
  color: var(--color-sub);
}

.control-table td:first-child {
  font-weight: 600;
  color: var(--color-accent);
  width: 50%;
}

.screenshot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.screenshot-grid img {
  width: 100%;
  border-radius: 8px;
  border: 2px solid rgba(182, 141, 64, 0.35);
  transition: all 0.3s ease;
  cursor: pointer;
}

.screenshot-grid img:hover {
  transform: scale(1.05);
  border-color: rgba(182, 141, 64, 0.6);
  box-shadow: 0 8px 25px rgba(182, 141, 64, 0.3);
}

.clickable {
  cursor: pointer;
}

/* ライトボックススタイル */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
}

.lightbox-close {
  position: absolute;
  top: -50px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
  padding: 10px;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.lightbox-nav {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 2rem;
  padding: 20px 15px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.3s ease;
  z-index: 1001;
  user-select: none;
}

.lightbox-nav:hover {
  background: rgba(0, 0, 0, 0.8);
}

.lightbox-prev {
  left: -60px;
}

.lightbox-next {
  right: -60px;
}

.lightbox-counter {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 1rem;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
}

.download-btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--color-accent) 0%, #8c6b3f 100%);
  color: var(--color-main-strong);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.download-btn:hover {
  background: linear-gradient(135deg, var(--color-sub) 0%, var(--color-accent) 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(182, 141, 64, 0.4);
  text-shadow: 0 0 10px rgba(75, 59, 48, 0.45);
}

.download-btn i {
  margin-right: 0.5rem;
}

.game-title:hover {
  text-shadow: 
    0 0 30px rgba(182, 141, 64, 0.7),
    0 0 60px rgba(182, 141, 64, 0.45),
    0 0 80px rgba(182, 141, 64, 0.25);
}

@media (max-width: 768px) {
  .game-page {
    padding: 1rem;
  }
  
  .screenshot-grid {
    grid-template-columns: 1fr;
  }
  
  .control-table td:first-child {
    width: 40%;
  }
  
  .lightbox-nav {
    position: static;
    margin: 10px;
    padding: 15px 20px;
  }
  
  .lightbox-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .lightbox-close {
    top: 10px;
    right: 10px;
    position: fixed;
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const { t } = useLocale()

// ページタイトル設定
useHead({
  title: 'TRIAL - 針の筜'
})

// 画像データ
const SCREENSHOT_COUNT = 6
const screenshots = Array.from({ length: SCREENSHOT_COUNT }, (_, i) => `/images/trial/${i + 1}.png`)

// ライトボックス関連
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)
const touchStart = ref<{ x: number; y: number } | null>(null)
const swipeThreshold = 45

const openLightbox = (index: number) => {
  if (index >= 0 && index < screenshots.length) {
    currentImageIndex.value = index
    lightboxOpen.value = true
    document.body.style.overflow = 'hidden'
  }
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = 'auto'
}

const nextImage = () => {
  currentImageIndex.value = Math.min(currentImageIndex.value + 1, screenshots.length - 1)
}

const prevImage = () => {
  currentImageIndex.value = Math.max(currentImageIndex.value - 1, 0)
}

const onTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (!touch) return
  touchStart.value = { x: touch.clientX, y: touch.clientY }
}

const onTouchEnd = (e: TouchEvent) => {
  if (!touchStart.value) return
  const touch = e.changedTouches[0]
  if (!touch) {
    touchStart.value = null
    return
  }

  const dx = touch.clientX - touchStart.value.x
  const dy = touch.clientY - touchStart.value.y
  touchStart.value = null

  if (Math.abs(dx) < swipeThreshold || Math.abs(dx) < Math.abs(dy)) return
  if (dx < 0) {
    nextImage()
  } else {
    prevImage()
  }
}

const onTouchCancel = () => {
  touchStart.value = null
}

// キーボードナビゲーション
const handleKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  
  switch (e.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      prevImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'auto'
})
</script>
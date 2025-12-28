<template>
  <div>
    <EerieBackground />
    <section class="game-page">
      <div class="header-section">
        <h1 class="game-title">{{ t('unrequited.title') }}</h1>
        <p class="game-description">{{ t('unrequited.description') }}</p>
      </div>

    <div class="content-section">
      <div class="info-card">
        <h2>▼{{ t('unrequited.gameInfo') }}</h2>
        <ul>
          <li>{{ t('unrequited.effectCount') }} <strong>{{ t('unrequited.effectTotal') }}</strong>{{ t('unrequited.period') }}</li>
          <li>{{ t('unrequited.edCount') }} <strong>{{ t('unrequited.edTotal') }}</strong> {{ t('unrequited.implemented') }}{{ t('unrequited.period') }}</li>
        </ul>
      </div>

      <div class="info-card">
        <h2>▼{{ t('unrequited.howToPlay') }}</h2>
        <p>{{ t('unrequited.gameplay1') }}</p>
        <p>{{ t('unrequited.gameplay2') }}</p>
        <p>{{ t('unrequited.gameplay3') }}</p>
        <p>{{ t('unrequited.gameplay4') }}</p>
        
        <h3>{{ t('unrequited.controls') }}</h3>
        <table class="control-table">
          <tbody>
            <tr>
              <td>{{ t('unrequited.move') }}</td>
              <td>{{ t('unrequited.moveKey') }}</td>
            </tr>
            <tr>
              <td>{{ t('unrequited.decide') }}</td>
              <td>{{ t('unrequited.decideKey') }}</td>
            </tr>
            <tr>
              <td>{{ t('unrequited.cancel') }}</td>
              <td>{{ t('unrequited.cancelKey') }}</td>
            </tr>
            <tr>
              <td>{{ t('unrequited.favorite') }}</td>
              <td>{{ t('unrequited.favoriteKey') }}</td>
            </tr>
            <tr>
              <td>{{ t('unrequited.action') }}</td>
              <td>{{ t('unrequited.actionKey') }}</td>
            </tr>
            <tr>
              <td>{{ t('unrequited.release') }}</td>
              <td>{{ t('unrequited.releaseKey') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="info-card">
        <h2>▼{{ t('unrequited.screenshots') }}</h2>
        <div class="screenshot-grid">
          <img src="https://nekonoha.github.io/web/img/unrequited/1.png" alt="Screenshot 1" @click="openLightbox(0)" class="clickable" />
          <img src="https://nekonoha.github.io/web/img/unrequited/2.png" alt="Screenshot 2" @click="openLightbox(1)" class="clickable" />
          <img src="https://nekonoha.github.io/web/img/unrequited/3.png" alt="Screenshot 3" @click="openLightbox(2)" class="clickable" />
          <img src="https://nekonoha.github.io/web/img/unrequited/4.png" alt="Screenshot 4" @click="openLightbox(3)" class="clickable" />
        </div>
      </div>

      <!-- ライトボックスモーダル -->
      <div v-if="lightboxOpen" class="lightbox-overlay" @click="closeLightbox">
        <div class="lightbox-content" @click.stop>
          <button class="lightbox-close" @click="closeLightbox">×</button>
          <button class="lightbox-nav lightbox-prev" @click="prevImage" v-if="currentImageIndex > 0">‹</button>
          <img :src="screenshots[currentImageIndex]" :alt="`Screenshot ${currentImageIndex + 1}`" class="lightbox-image" />
          <button class="lightbox-nav lightbox-next" @click="nextImage" v-if="currentImageIndex < screenshots.length - 1">›</button>
          <div class="lightbox-counter">{{ currentImageIndex + 1 }} / {{ screenshots.length }}</div>
        </div>
      </div>

      <div class="info-card">
        <h2>▼{{ t('unrequited.download') }}</h2>
        <p>{{ t('unrequited.downloadTextJp') }} <strong>{{ t('unrequited.versionJp') }}</strong>{{ t('unrequited.versionSuffix') }}</p>
        <p>{{ t('unrequited.downloadTextEn') }} <strong>{{ t('unrequited.versionEn') }}</strong>{{ t('unrequited.versionSuffix') }}</p>
        <p>{{ t('unrequited.downloadLink') }}</p>
        <div class="download-buttons">
          <a href="http://www1.axfc.net/u/3511483" target="_blank" class="download-btn">
            <i class="fas fa-download"></i> {{ t('unrequited.downloadButtonJp') }}
          </a>
          <a href="http://www1.axfc.net/u/3511484" target="_blank" class="download-btn">
            <i class="fas fa-download"></i> {{ t('unrequited.downloadButtonEn') }}
          </a>
        </div>
      </div>
    </div>
    </section>
  </div>
</template>

<style scoped>
.game-page {
  animation: fadeIn 1s ease-out;
  background: 
    linear-gradient(180deg, rgba(15, 25, 45, 0.9) 0%, rgba(25, 35, 60, 0.9) 50%, rgba(10, 20, 40, 0.95) 100%),
    url('https://nekonoha.github.io/web/img/unrequited/back.png');
  background-size: cover, cover;
  background-position: center, center;
  background-repeat: no-repeat;
  min-height: 100vh;
  color: #f0f0f0;
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
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #b3d9ff 0%, #87ceeb 25%, #6495ed 50%, #4682b4 75%, #2f4f4f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 
    0 0 20px rgba(135, 206, 235, 0.6),
    0 0 40px rgba(135, 206, 235, 0.4),
    0 0 60px rgba(135, 206, 235, 0.2);
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

.game-description {
  font-size: 1.2rem;
  color: #d0e6ff;
  opacity: 0.9;
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
  background: rgba(15, 25, 45, 0.85);
  border: 1px solid rgba(135, 206, 235, 0.3);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(135, 206, 235, 0.1);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  border-color: rgba(135, 206, 235, 0.5);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(135, 206, 235, 0.2);
}

.info-card h2 {
  font-family: 'Orbitron', monospace;
  color: #b3d9ff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(135, 206, 235, 0.5);
}

.info-card h3 {
  font-family: 'Inter', sans-serif;
  color: #87ceeb;
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem 0;
}

.info-card p {
  line-height: 1.7;
  margin-bottom: 1rem;
  color: #a0c8f0;
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  color: #a0c8f0;
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
  border-bottom: 1px solid rgba(135, 206, 235, 0.2);
  color: #a0c8f0;
}

.control-table td:first-child {
  font-weight: 600;
  color: #b3d9ff;
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
  border: 2px solid rgba(135, 206, 235, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.screenshot-grid img:hover {
  transform: scale(1.05);
  border-color: rgba(135, 206, 235, 0.6);
  box-shadow: 0 8px 25px rgba(135, 206, 235, 0.3);
}

.clickable {
  cursor: pointer;
}

/* ライトボックススタイル */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
  background: linear-gradient(135deg, #4682b4 0%, #2f4f4f 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.download-btn:hover {
  background: linear-gradient(135deg, #6495ed 0%, #4682b4 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(70, 130, 180, 0.4);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.download-btn i {
  margin-right: 0.5rem;
}

.download-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.download-buttons .download-btn {
  flex: 1;
  min-width: 250px;
  text-align: center;
}

.game-title:hover {
  text-shadow: 
    0 0 30px rgba(135, 206, 235, 0.8),
    0 0 60px rgba(135, 206, 235, 0.5),
    0 0 80px rgba(135, 206, 235, 0.3);
}

@media (max-width: 768px) {
  .game-page {
    padding: 1rem;
  }
  
  .game-title {
    font-size: 2.5rem;
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
import { ref } from 'vue'
const { t } = useLocale()

// ページタイトル設定
useHead({
  title: 'UnRequited - 針の筜'
})

// ライトボックス関連
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)
const screenshots = [
  'https://nekonoha.github.io/web/img/unrequited/1.png',
  'https://nekonoha.github.io/web/img/unrequited/2.png',
  'https://nekonoha.github.io/web/img/unrequited/3.png',
  'https://nekonoha.github.io/web/img/unrequited/4.png'
]

const openLightbox = (index: number) => {
  currentImageIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = 'auto'
}

const nextImage = () => {
  if (currentImageIndex.value < screenshots.length - 1) {
    currentImageIndex.value++
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
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
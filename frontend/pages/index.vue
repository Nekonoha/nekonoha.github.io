<template>
  <section class="hero">
    <div class="dots-text-container">
      <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
    <div class="subtitle-text">
      <p class="subtitle">{{ t('index.subtitle') }}</p>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

const { t, locale } = useLocale()
const canvas = ref<HTMLCanvasElement>()
const canvasWidth = ref(800)
const canvasHeight = ref(400)

// マウス位置を追跡
const mousePos = ref({ x: -1000, y: -1000 }) // 初期値は画面外

const updatePointerPosition = (clientX: number, clientY: number) => {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  mousePos.value = {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

const clearPointerPosition = () => {
  mousePos.value = { x: -1000, y: -1000 }
}

// 言語変更を監視してアニメーションを再初期化
watch(locale, () => {
  nextTick(() => {
    initDots()
  })
})

class Dot {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  radius: number
  opacity: number
  color: string
  scaleFactor: number
  
  constructor(x: number, y: number, targetX: number, targetY: number, scaleFactor = 1) {
    this.x = x
    this.y = y
    this.targetX = targetX
    this.targetY = targetY
    this.vx = 0
    this.vy = 0
    this.radius = Math.max(1, 2 * scaleFactor)
    this.opacity = 0
    this.scaleFactor = scaleFactor
    
    const themeDots = [
      '#B68D40', // accent gold
      '#EADBC8', // beige
      '#F5EFE6', // soft light
      '#D7C2A1', // warm sand
      '#A37B4F', // mid gold-brown
      '#8C6B3F', // deep accent
      '#6B4A38'  // shadowed brown
    ]
    this.color = themeDots[Math.floor(Math.random() * themeDots.length)]
  }
  
  update(mouseX: number, mouseY: number) {
    // マウスとの距離を計算
    const mouseDistance = Math.sqrt((this.x - mouseX) ** 2 + (this.y - mouseY) ** 2)
    const repelRadius = 80 * this.scaleFactor // 反発半径をスケール対応
    
    let targetX = this.targetX
    let targetY = this.targetY
    
    // マウスが近い場合は逃げる
    if (mouseDistance < repelRadius && mouseX > -500) { // マウスが画面内にある場合のみ
      const repelForce = (repelRadius - mouseDistance) / repelRadius
      const angle = Math.atan2(this.y - mouseY, this.x - mouseX)
      const repelDistance = repelForce * 60
      
      targetX = this.targetX + Math.cos(angle) * repelDistance
      targetY = this.targetY + Math.sin(angle) * repelDistance
    }
    
    const dx = targetX - this.x
    const dy = targetY - this.y
    // 螢のようにゆったりとした動きに調整
    this.vx += dx * 0.002
    this.vy += dy * 0.002
    this.vx *= 0.95
    this.vy *= 0.95
    
    // 小さなランダムな揺らぎを追加（螢のようなふわふり感）
    this.vx += (Math.random() - 0.5) * 0.02
    this.vy += (Math.random() - 0.5) * 0.02
    
    this.x += this.vx
    this.y += this.vy
    
    const distance = Math.sqrt((this.x - this.targetX) ** 2 + (this.y - this.targetY) ** 2)
    this.opacity = Math.max(0, Math.min(0.9, 1 - distance / 120))
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color
    ctx.shadowBlur = 8
    ctx.shadowColor = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

let dots: Dot[] = []
let animationId: number

const initDots = () => {
  if (!canvas.value) return
  
  // 隠しキャンバスでテキストのピクセル情報を取得
  const hiddenCanvas = document.createElement('canvas')
  hiddenCanvas.width = canvasWidth.value
  hiddenCanvas.height = canvasHeight.value
  const hiddenCtx = hiddenCanvas.getContext('2d')
  if (!hiddenCtx) return
  
  // 隠しキャンバスにテキストを描画
  const title = t('index.title')
  // キャンバスサイズに応じて文字サイズを調整
  const baseFontSize = title.length > 6 ? 56 : 72
  const scaleFactor = Math.min(canvasWidth.value / 800, canvasHeight.value / 400)
  const fontSize = Math.floor(baseFontSize * scaleFactor)
  
  hiddenCtx.font = `bold ${fontSize}px "Hiragino Kaku Gothic Pro", "Meiryo", Arial, sans-serif`
  hiddenCtx.fillStyle = '#000'
  hiddenCtx.textAlign = 'center'
  hiddenCtx.textBaseline = 'middle'
  hiddenCtx.fillText(title, canvasWidth.value / 2, canvasHeight.value / 2)
  
  const imageData = hiddenCtx.getImageData(0, 0, canvasWidth.value, canvasHeight.value)
  const pixels = imageData.data
  
  // 表示用キャンバスはクリアしたまま
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  
  dots = []
  
  // ピクセルをサンプリングしてドットを作成
  const isNarrow = canvasWidth.value < 480
  const samplingRate = Math.max(2, Math.floor(4 * scaleFactor) + (isNarrow ? 1 : 0))
  for (let y = 0; y < canvasHeight.value; y += samplingRate) {
    for (let x = 0; x < canvasWidth.value; x += samplingRate) {
      const index = (y * canvasWidth.value + x) * 4
      const alpha = pixels[index + 3]
      
      if (alpha > 128) {
        // ランダムな初期位置
        const startX = Math.random() * canvasWidth.value
        const startY = Math.random() * canvasHeight.value
        dots.push(new Dot(startX, startY, x, y, scaleFactor))
      }
    }
  }
}

const animate = () => {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  
  dots.forEach(dot => {
    dot.update(mousePos.value.x, mousePos.value.y)
    dot.draw(ctx)
  })
  
  animationId = requestAnimationFrame(animate)
}

// タッチ・マウス共通のポインタイベント
const setupPointerEvents = () => {
  if (!canvas.value) return

  const listenerOptions: AddEventListenerOptions = { passive: true }

  const handlePointerMove = (e: PointerEvent | MouseEvent) => {
    updatePointerPosition(e.clientX, e.clientY)
  }

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    updatePointerPosition(touch.clientX, touch.clientY)
  }

  canvas.value.addEventListener('pointermove', handlePointerMove, listenerOptions)
  canvas.value.addEventListener('pointerleave', clearPointerPosition, listenerOptions)
  canvas.value.addEventListener('pointercancel', clearPointerPosition, listenerOptions)
  canvas.value.addEventListener('touchmove', handleTouchMove, listenerOptions)
  canvas.value.addEventListener('touchend', clearPointerPosition, listenerOptions)
  canvas.value.addEventListener('touchcancel', clearPointerPosition, listenerOptions)

  // Safari で pointermove が無効な場合のフォールバック
  canvas.value.addEventListener('mousemove', handlePointerMove, listenerOptions)

  return () => {
    canvas.value?.removeEventListener('pointermove', handlePointerMove, listenerOptions)
    canvas.value?.removeEventListener('pointerleave', clearPointerPosition, listenerOptions)
    canvas.value?.removeEventListener('pointercancel', clearPointerPosition, listenerOptions)
    canvas.value?.removeEventListener('touchmove', handleTouchMove, listenerOptions)
    canvas.value?.removeEventListener('touchend', clearPointerPosition, listenerOptions)
    canvas.value?.removeEventListener('touchcancel', clearPointerPosition, listenerOptions)
    canvas.value?.removeEventListener('mousemove', handlePointerMove, listenerOptions)
  }
}

const handleResize = () => {
  const container = document.querySelector('.hero') as HTMLElement
  if (!container) return
  
  // コンテナの幅に基づいてキャンバスサイズを動的に調整
  const containerPadding = window.innerWidth < 480 ? 24 : 40
  const containerWidth = Math.max(280, container.clientWidth - containerPadding)
  const scaleFactor = Math.min(1, containerWidth / 800)
  
  canvasWidth.value = Math.min(800, containerWidth)
  canvasHeight.value = Math.floor(400 * scaleFactor)
  
  nextTick(() => {
    initDots()
  })
}

let mouseEventCleanup: (() => void) | null = null

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  
  setTimeout(() => {
    animate()
    const cleanup = setupPointerEvents()
    if (cleanup) {
      mouseEventCleanup = cleanup
    }
  }, 500)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
  mouseEventCleanup?.()
})
</script>
<style scoped>
.hero {
  text-align: center;
  padding: 4rem 0;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.dots-text-container {
  position: relative;
}

.subtitle-text {
  text-align: center;
  margin-top: 2rem;
}

.subtitle-text .subtitle {
  font-size: 1.2rem;
  color: var(--color-muted);
  margin: 0;
  font-weight: 400;
  font-family: 'Inter', 'Noto Sans JP', sans-serif;
}

canvas {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
  touch-action: pan-y pinch-zoom;
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 0;
    min-height: 60vh;
  }
  
  .subtitle-text .subtitle {
    font-size: 1rem;
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 1.5rem 0;
  }
  
  .subtitle-text {
    margin-top: 1rem;
  }
  
  .subtitle-text .subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 320px) {
  .hero {
    padding: 1rem 0;
  }
  
  .subtitle-text .subtitle {
    font-size: 0.8rem;
  }
}
</style>
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
  
  constructor(x: number, y: number, targetX: number, targetY: number) {
    this.x = x
    this.y = y
    this.targetX = targetX
    this.targetY = targetY
    this.vx = 0
    this.vy = 0
    this.radius = 2
    this.opacity = 0
    
    // やさしい星空配色のパステルカラー（いろいろな色を使用）
    const pastelColors = [
      '#F4C2C2', // ペールピンク
      '#E6B3B3', // ペールピンク薄
      '#D8A4A4', // ペールピンク濃
      '#C8B5D1', // くすみラベンダー
      '#B8A5C1', // くすみラベンダー薄
      '#A695B1', // くすみラベンダー濃
      '#F8F6F0', // ミルキーホワイト
      '#FFF9F5', // ミルキーホワイト薄
      '#E8D5E8', // 薄紫
      '#D6C9E3', // 薄ラベンダー
      '#B8E6B8', // ペールグリーン
      '#A8D8EA', // ペールブルー
      '#FFD93D', // ペールイエロー
      '#FFAAA5'  // ペールコーラル
    ]
    this.color = pastelColors[Math.floor(Math.random() * pastelColors.length)]
  }
  
  update(mouseX: number, mouseY: number) {
    // マウスとの距離を計算
    const mouseDistance = Math.sqrt((this.x - mouseX) ** 2 + (this.y - mouseY) ** 2)
    const repelRadius = 80 // 反発半径
    
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
  // 英語の場合はフォントサイズを少し小さくして調整
  const fontSize = title.length > 6 ? 56 : 72
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
  for (let y = 0; y < canvasHeight.value; y += 4) {
    for (let x = 0; x < canvasWidth.value; x += 4) {
      const index = (y * canvasWidth.value + x) * 4
      const alpha = pixels[index + 3]
      
      if (alpha > 128) {
        // ランダムな初期位置
        const startX = Math.random() * canvasWidth.value
        const startY = Math.random() * canvasHeight.value
        dots.push(new Dot(startX, startY, x, y))
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

// マウスイベントリスナー
const setupMouseEvents = () => {
  if (!canvas.value) return
  
  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvas.value!.getBoundingClientRect()
    mousePos.value = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }
  
  const handleMouseLeave = () => {
    // マウスがキャンバスから離れたら画面外に設定
    mousePos.value = { x: -1000, y: -1000 }
  }
  
  canvas.value.addEventListener('mousemove', handleMouseMove)
  canvas.value.addEventListener('mouseleave', handleMouseLeave)
  
  return () => {
    canvas.value?.removeEventListener('mousemove', handleMouseMove)
    canvas.value?.removeEventListener('mouseleave', handleMouseLeave)
  }
}

const handleResize = () => {
  const container = document.querySelector('.hero') as HTMLElement
  if (!container) return
  
  canvasWidth.value = Math.min(800, container.clientWidth - 40)
  canvasHeight.value = 400
  
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
    mouseEventCleanup = setupMouseEvents()
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
  color: rgba(248, 246, 240, 0.8);
  margin: 0;
  font-weight: 400;
  font-family: 'Inter', 'Noto Sans JP', sans-serif;
}

canvas {
  display: block;
  margin: 0 auto;
}

@media (max-width: 768px) {
  canvas {
    max-width: 100%;
    height: auto;
  }
  
  .subtitle-text .subtitle {
    font-size: 1rem;
  }
}
</style>
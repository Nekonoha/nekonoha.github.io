<template>
  <div class="background-animation">
    <div v-if="showEerieImages" class="eerie-background">
      <img 
        v-for="image in eerieImages" 
        :key="image.id"
        :src="image.src"
        :style="{
          left: image.x + 'px',
          top: image.y + 'px',
          opacity: image.opacity,
          transform: `rotate(${image.rotation}deg) scale(${image.scale})`
        }"
        class="eerie-image"
      />
    </div>
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface Props {
  showEerieImages?: boolean
  eerieMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showEerieImages: false,
  eerieMode: false
})

const canvas = ref<HTMLCanvasElement>()
const canvasWidth = ref(0)
const canvasHeight = ref(0)
const eerieImages = ref<Array<{
  id: number
  src: string
  x: number
  y: number
  opacity: number
  rotation: number
  scale: number
  vx: number
  vy: number
  rotationSpeed: number
}>>([])

// 不気味な画像のソース（実際のゲーム背景画像）
const eerieImageSources = [
  '/images/trial/back.png',
  '/images/unrequited/back.png',
  '/images/trial/1.png',
  '/images/unrequited/1.png',
  '/images/trial/2.png',
  '/images/unrequited/2.png'
]

let imageIdCounter = 0

// レスポンシブ対応のためのスケールファクター計算
const getScaleFactor = () => {
  const baseWidth = 1920 // 基準解像度
  const baseHeight = 1080
  const scaleX = canvasWidth.value / baseWidth
  const scaleY = canvasHeight.value / baseHeight
  return Math.min(scaleX, scaleY, 1) // 1を超えないように制限
}

const getResponsiveValue = (baseValue: number) => {
  return baseValue * getScaleFactor()
}

class ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  color: string
  opacity: number
  life: number
  maxLife: number
  exploding: boolean
  particles: Particle[]
  
  constructor() {
    const scaleFactor = getScaleFactor()
    
    // ランダムな開始位置（画面外から）
    const side = Math.random()
    const margin = getResponsiveValue(20)
    if (side < 0.25) { // 上から
      this.x = Math.random() * canvasWidth.value
      this.y = -margin
    } else if (side < 0.5) { // 右から
      this.x = canvasWidth.value + margin
      this.y = Math.random() * canvasHeight.value
    } else if (side < 0.75) { // 下から
      this.x = Math.random() * canvasWidth.value
      this.y = canvasHeight.value + margin
    } else { // 左から
      this.x = -margin
      this.y = Math.random() * canvasHeight.value
    }
    
    // 速度（画面中央方向に向かう）
    const centerX = canvasWidth.value / 2
    const centerY = canvasHeight.value / 2
    const angle = Math.atan2(centerY - this.y, centerX - this.x) + (Math.random() - 0.5) * 0.8
    const baseSpeed = (1 + Math.random() * 2) * scaleFactor
    this.vx = Math.cos(angle) * baseSpeed
    this.vy = Math.sin(angle) * baseSpeed
    
    this.length = getResponsiveValue(20 + Math.random() * 30)
    this.opacity = 0.3 + Math.random() * 0.4
    this.life = 0
    this.maxLife = 200 + Math.random() * 300
    this.exploding = false
    this.particles = []
    
    // やさしい星空配色のパステルカラー
    const pastelColors = [
      '#F4C2C2', '#E6B3B3', '#D8A4A4', '#C8B5D1', '#B8A5C1', 
      '#A695B1', '#F8F6F0', '#E8D5E8', '#D6C9E3', '#B8E6B8',
      '#A8D8EA', '#FFD93D', '#FFAAA5'
    ]
    this.color = pastelColors[Math.floor(Math.random() * pastelColors.length)]
  }
  
  explode() {
    this.exploding = true
    // 爆発時の粒子を生成
    const particleCount = Math.max(4, Math.floor(8 * getScaleFactor()))
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.5
      const baseSpeed = 0.5 + Math.random() * 1.5
      const speed = baseSpeed * getScaleFactor()
      this.particles.push(new Particle(
        this.x, this.y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        this.color
      ))
    }
  }
  
  update() {
    if (this.exploding) {
      this.particles.forEach(p => p.update())
      this.particles = this.particles.filter(p => p.life < p.maxLife)
      return this.particles.length === 0 // 全粒子が消えたら削除
    }
    
    this.x += this.vx
    this.y += this.vy
    this.life++
    
    // 一定確率で爆発
    if (this.life > 50 && Math.random() < 0.005) {
      this.explode()
      return false
    }
    
    // 画面外に出たか寿命が尽きたら削除
    const margin = getResponsiveValue(50)
    return this.life >= this.maxLife || 
           this.x < -margin || this.x > canvasWidth.value + margin || 
           this.y < -margin || this.y > canvasHeight.value + margin
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    if (this.exploding) {
      this.particles.forEach(p => p.draw(ctx))
      return
    }
    
    const scaleFactor = getScaleFactor()
    
    ctx.save()
    ctx.globalAlpha = this.opacity * 0.6 // 薄めに設定
    ctx.strokeStyle = this.color
    ctx.lineWidth = Math.max(1, 2 * scaleFactor)
    ctx.lineCap = 'round'
    
    // 尻尾の描画
    const tailX = this.x - this.vx * this.length
    const tailY = this.y - this.vy * this.length
    
    const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y)
    gradient.addColorStop(0, 'transparent')
    gradient.addColorStop(1, this.color)
    
    ctx.strokeStyle = gradient
    ctx.beginPath()
    ctx.moveTo(tailX, tailY)
    ctx.lineTo(this.x, this.y)
    ctx.stroke()
    
    // 先端の光る点
    ctx.shadowBlur = 10 * scaleFactor
    ctx.shadowColor = this.color
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, Math.max(1, 2 * scaleFactor), 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
}

class EerieParticle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  opacity: number
  life: number
  maxLife: number
  size: number
  pulseSpeed: number
  
  constructor() {
    this.x = Math.random() * canvasWidth.value
    this.y = Math.random() * canvasHeight.value
    const scaleFactor = getScaleFactor()
    this.vx = (Math.random() - 0.5) * 0.3 * scaleFactor
    this.vy = (Math.random() - 0.5) * 0.3 * scaleFactor
    this.opacity = 0.2 + Math.random() * 0.3
    this.life = 0
    this.maxLife = 300 + Math.random() * 500
    this.size = getResponsiveValue(1 + Math.random() * 3)
    this.pulseSpeed = 0.02 + Math.random() * 0.03
    
    // 不気味な色合い
    const eerieColors = [
      '#4a4a7a', '#5a5a8a', '#3a3a6a', '#6a4a7a',
      '#7a6a8a', '#5a6a7a', '#6a7a8a', '#4a6a7a'
    ]
    this.color = eerieColors[Math.floor(Math.random() * eerieColors.length)]
  }
  
  update() {
    this.x += this.vx
    this.y += this.vy
    this.life++
    
    // パルス効果
    this.opacity = (0.2 + Math.sin(this.life * this.pulseSpeed) * 0.1) * 
                   (1 - this.life / this.maxLife)
    
    // ランダムな方向変更
    if (Math.random() < 0.01) {
      const scaleFactor = getScaleFactor()
      this.vx += (Math.random() - 0.5) * 0.1 * scaleFactor
      this.vy += (Math.random() - 0.5) * 0.1 * scaleFactor
    }
    
    // 境界で跳ね返り
    if (this.x < 0 || this.x > canvasWidth.value) this.vx *= -1
    if (this.y < 0 || this.y > canvasHeight.value) this.vy *= -1
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color
    ctx.shadowBlur = 5
    ctx.shadowColor = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life: number
  maxLife: number
  
  constructor(x: number, y: number, vx: number, vy: number, color: string) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.color = color
    this.life = 0
    this.maxLife = 30 + Math.random() * 20
  }
  
  update() {
    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.98
    this.vy *= 0.98
    this.life++
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    const opacity = (1 - this.life / this.maxLife) * 0.8
    ctx.save()
    ctx.globalAlpha = opacity
    ctx.fillStyle = this.color
    ctx.shadowBlur = 5
    ctx.shadowColor = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

let stars: ShootingStar[] = []
let eerieParticles: EerieParticle[] = []
let animationId: number

const createEerieImage = () => {
  return {
    id: imageIdCounter++,
    src: eerieImageSources[Math.floor(Math.random() * eerieImageSources.length)],
    x: Math.random() * canvasWidth.value,
    y: Math.random() * canvasHeight.value,
    opacity: 0.05 + Math.random() * 0.1, // さらに薄く
    rotation: Math.random() * 360,
    scale: 0.3 + Math.random() * 0.7, // 少し小さめ
    vx: (Math.random() - 0.5) * 0.1, // ゆっくり移動
    vy: (Math.random() - 0.5) * 0.1,
    rotationSpeed: (Math.random() - 0.5) * 0.2 // ゆっくり回転
  }
}

const updateEerieImages = () => {
  if (!props.showEerieImages) return
  
  // 新しい画像を時々追加
  if (Math.random() < 0.005 && eerieImages.value.length < 8) {
    eerieImages.value.push(createEerieImage())
  }
  
  // 画像を更新
  eerieImages.value = eerieImages.value.map(img => ({
    ...img,
    x: img.x + img.vx,
    y: img.y + img.vy,
    rotation: img.rotation + img.rotationSpeed,
    opacity: img.opacity * 0.999 // ゆっくりフェード
  })).filter(img => 
    img.opacity > 0.05 && 
    img.x > -100 && img.x < canvasWidth.value + 100 &&
    img.y > -100 && img.y < canvasHeight.value + 100
  )
}

const animate = () => {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  
  // 不気味な画像を更新
  updateEerieImages()
  
  if (props.eerieMode) {
    // 不気味モード：不気味な粒子を管理
    if (Math.random() < 0.03 && eerieParticles.length < 15) {
      eerieParticles.push(new EerieParticle())
    }
    
    eerieParticles = eerieParticles.filter(particle => {
      particle.update()
      particle.draw(ctx)
      return particle.life < particle.maxLife
    })
  } else {
    // 通常モード：流れ星を管理
    if (Math.random() < 0.02) {
      stars.push(new ShootingStar())
    }
    
    stars = stars.filter(star => {
      const shouldRemove = star.update()
      if (!shouldRemove) {
        star.draw(ctx)
      }
      return !shouldRemove
    })
  }
  
  animationId = requestAnimationFrame(animate)
}

const handleResize = () => {
  // document.documentElementを使用してより信頼性の高いサイズ取得
  const width = Math.min(window.innerWidth, document.documentElement.clientWidth)
  const height = Math.min(window.innerHeight, document.documentElement.clientHeight)
  
  const oldWidth = canvasWidth.value
  const oldHeight = canvasHeight.value
  
  canvasWidth.value = width
  canvasHeight.value = height
  
  // キャンバス要素が存在する場合、スタイルも更新
  if (canvas.value) {
    canvas.value.style.width = width + 'px'
    canvas.value.style.height = height + 'px'
  }
  
  // 画面サイズが大幅に変わった場合、アニメーション要素をリセット
  if (oldWidth > 0 && oldHeight > 0) {
    const scaleChangeX = width / oldWidth
    const scaleChangeY = height / oldHeight
    
    // 大幅なサイズ変更の場合は要素をリセット
    if (Math.abs(scaleChangeX - 1) > 0.2 || Math.abs(scaleChangeY - 1) > 0.2) {
      // 既存の要素をクリア
      stars.length = 0
      particles.length = 0
      eerieParticles.length = 0
      eerieImages.value = []
    }
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  
  // ResizeObserver を使用してより精密なサイズ調整
  let resizeObserver: ResizeObserver | null = null
  if (canvas.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        canvasWidth.value = Math.floor(width)
        canvasHeight.value = Math.floor(height)
      }
    })
    resizeObserver.observe(canvas.value.parentElement!)
  }
  
  animate()
  
  // cleanup
  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    window.removeEventListener('resize', handleResize)
  })
})

// 元のonUnmountedは削除
</script>

<style scoped>
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.eerie-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.eerie-image {
  position: absolute;
  width: 120px;
  height: 120px;
  object-fit: cover;
  transition: opacity 0.3s ease;
  mix-blend-mode: overlay;
  filter: blur(2px) grayscale(0.3);
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  object-fit: cover;
}
</style>
<template>
  <div class="eerie-background">
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement>()
const canvasWidth = ref(0)
const canvasHeight = ref(0)

// 水滴クラス
class WaterDrop {
  x: number
  y: number
  speed: number
  length: number
  opacity: number
  width: number
  
  constructor() {
    this.x = Math.random() * canvasWidth.value
    this.y = -50
    this.speed = 2 + Math.random() * 4
    this.length = 20 + Math.random() * 40
    this.opacity = 0.3 + Math.random() * 0.4
    this.width = 1 + Math.random() * 2
  }
  
  update() {
    this.y += this.speed
    // 下に到達したら削除
    return this.y > canvasHeight.value + 50
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    
    // 水滴のグラデーション
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.length)
    gradient.addColorStop(0, 'rgba(182, 141, 64, 0.85)')
    gradient.addColorStop(0.3, 'rgba(160, 123, 56, 0.7)')
    gradient.addColorStop(1, 'rgba(110, 82, 50, 0.25)')
    
    ctx.strokeStyle = gradient
    ctx.lineWidth = this.width
    ctx.lineCap = 'round'
    
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.x, this.y + this.length)
    ctx.stroke()
    
    ctx.restore()
  }
}

// 影の塊クラス
class ShadowBlob {
  x: number
  y: number
  size: number
  opacity: number
  life: number
  maxLife: number
  vx: number
  vy: number
  pulsePhase: number
  
  constructor() {
    this.x = Math.random() * canvasWidth.value
    this.y = Math.random() * canvasHeight.value
    this.size = 20 + Math.random() * 60
    this.opacity = 0.2 + Math.random() * 0.3
    this.life = 0
    this.maxLife = 200 + Math.random() * 400
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.pulsePhase = Math.random() * Math.PI * 2
  }
  
  update() {
    this.x += this.vx
    this.y += this.vy
    this.life++
    
    // 境界で跳ね返り
    if (this.x < 0 || this.x > canvasWidth.value) this.vx *= -1
    if (this.y < 0 || this.y > canvasHeight.value) this.vy *= -1
    
    // パルス効果
    this.pulsePhase += 0.02
    
    // フェードアウト
    const lifeRatio = this.life / this.maxLife
    this.opacity = (0.4 * (1 - lifeRatio)) * (0.7 + 0.3 * Math.sin(this.pulsePhase))
    
    return this.life >= this.maxLife
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    
    // 影のグラデーション
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    )
    gradient.addColorStop(0, 'rgba(40, 30, 24, 0.85)')
    gradient.addColorStop(0.4, 'rgba(60, 45, 36, 0.45)')
    gradient.addColorStop(1, 'rgba(75, 55, 44, 0)')
    
    ctx.fillStyle = gradient
    
    // 不規則な形状
    ctx.beginPath()
    const points = 8
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2
      const variation = 0.7 + 0.3 * Math.sin(this.pulsePhase * 2 + i)
      const radius = this.size * variation
      const x = this.x + Math.cos(angle) * radius
      const y = this.y + Math.sin(angle) * radius
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    ctx.fill()
    
    ctx.restore()
  }
}

// 暗いオーブ（浮遊する暗い光）
class DarkOrb {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  pulsePhase: number
  
  constructor() {
    this.x = Math.random() * canvasWidth.value
    this.y = Math.random() * canvasHeight.value
    this.vx = (Math.random() - 0.5) * 0.3
    this.vy = (Math.random() - 0.5) * 0.3
    this.size = 5 + Math.random() * 15
    this.opacity = 0.1 + Math.random() * 0.2
    this.pulsePhase = Math.random() * Math.PI * 2
  }
  
  update() {
    this.x += this.vx
    this.y += this.vy
    this.pulsePhase += 0.01
    
    // ゆるやかな方向変更
    if (Math.random() < 0.005) {
      this.vx += (Math.random() - 0.5) * 0.1
      this.vy += (Math.random() - 0.5) * 0.1
    }
    
    // 境界で跳ね返り
    if (this.x < 0 || this.x > canvasWidth.value) this.vx *= -1
    if (this.y < 0 || this.y > canvasHeight.value) this.vy *= -1
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    
    const pulsedOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulsePhase))
    ctx.globalAlpha = pulsedOpacity
    
    // 暗いオーブのグラデーション
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    )
    gradient.addColorStop(0, 'rgba(150, 115, 70, 0.6)')
    gradient.addColorStop(0.6, 'rgba(115, 85, 55, 0.35)')
    gradient.addColorStop(1, 'rgba(55, 40, 30, 0)')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
}

let waterDrops: WaterDrop[] = []
let shadowBlobs: ShadowBlob[] = []
let darkOrbs: DarkOrb[] = []
let animationId: number

const animate = () => {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  
  // 暗い背景で前フレームを薄く残す（軌跡効果）
  ctx.fillStyle = 'rgba(34, 26, 22, 0.12)'
  ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value)
  
  // 水滴を追加
  if (Math.random() < 0.08) {
    waterDrops.push(new WaterDrop())
  }
  
  // 影の塊を追加
  if (Math.random() < 0.01 && shadowBlobs.length < 8) {
    shadowBlobs.push(new ShadowBlob())
  }
  
  // 暗いオーブを追加
  if (Math.random() < 0.02 && darkOrbs.length < 12) {
    darkOrbs.push(new DarkOrb())
  }
  
  // 水滴を更新・描画
  waterDrops = waterDrops.filter(drop => {
    const shouldRemove = drop.update()
    if (!shouldRemove) {
      drop.draw(ctx)
    }
    return !shouldRemove
  })
  
  // 影の塊を更新・描画
  shadowBlobs = shadowBlobs.filter(blob => {
    const shouldRemove = blob.update()
    if (!shouldRemove) {
      blob.draw(ctx)
    }
    return !shouldRemove
  })
  
  // 暗いオーブを更新・描画
  darkOrbs.forEach(orb => {
    orb.update()
    orb.draw(ctx)
  })
  
  animationId = requestAnimationFrame(animate)
}

const handleResize = () => {
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.eerie-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  background: radial-gradient(circle at center, rgba(44, 35, 35, 0.82) 0%, rgba(28, 21, 20, 0.9) 100%);
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
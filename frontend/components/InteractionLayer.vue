<template>
  <div class="ambient-scene" aria-hidden="true">
    <span class="ambient-orb orb-one"></span>
    <span class="ambient-orb orb-two"></span>
    <span class="ambient-orb orb-three"></span>
    <span class="ambient-grid"></span>
  </div>
</template>
<script setup lang="ts">
let reducedMotion: MediaQueryList | undefined
let revealObserver: IntersectionObserver | undefined
let pageObserver: MutationObserver | undefined
let revealFrame = 0
const onClick = (event: MouseEvent) => {
  if (reducedMotion?.matches || !event.isTrusted) return
  const target = event.target
  if (!(target instanceof Element) || target.closest('iframe')) return
  const burst = document.createElement('span')
  burst.className = 'click-burst'
  burst.style.left = `${event.clientX}px`
  burst.style.top = `${event.clientY}px`
  for (let i = 0; i < 8; i++) {
    const spark = document.createElement('i')
    const angle = Math.PI * 2 * i / 8
    const distance = 25 + Math.random() * 18
    spark.style.setProperty('--dx', `${Math.cos(angle) * distance}px`)
    spark.style.setProperty('--dy', `${Math.sin(angle) * distance}px`)
    burst.append(spark)
  }
  document.body.append(burst)
  burst.addEventListener('animationend', animation => { if (animation.target === burst) burst.remove() })
}
const setupReveals = () => {
  revealObserver?.disconnect()
  if (reducedMotion?.matches) return
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('reveal-visible')
      revealObserver?.unobserve(entry.target)
    }
  }, { rootMargin: '0px 0px -8% 0px' })
  const items = document.querySelectorAll<HTMLElement>('#main-content .section-head, #main-content .release, #main-content .game-tile, #main-content .illustration')
  items.forEach((item, index) => {
    if (item.getBoundingClientRect().top < window.innerHeight * .9) return
    item.style.setProperty('--reveal-delay', `${index % 3 * 65}ms`)
    item.classList.add('reveal-pending')
    revealObserver?.observe(item)
  })
}
const onScroll = () => {
  const remaining = document.documentElement.scrollHeight - window.innerHeight
  document.documentElement.style.setProperty('--page-progress', `${remaining > 0 ? window.scrollY / remaining * 100 : 0}%`)
}
onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  document.addEventListener('click', onClick)
  window.addEventListener('scroll', onScroll, { passive: true })
  const main = document.getElementById('main-content')
  if (main) {
    pageObserver = new MutationObserver(() => {
      cancelAnimationFrame(revealFrame)
      revealFrame = requestAnimationFrame(setupReveals)
    })
    pageObserver.observe(main, { childList: true })
  }
  setupReveals()
  onScroll()
})
onUnmounted(() => {
  document.removeEventListener('click', onClick)
  window.removeEventListener('scroll', onScroll)
  revealObserver?.disconnect()
  pageObserver?.disconnect()
  cancelAnimationFrame(revealFrame)
})
</script>
<style scoped>
.ambient-scene { position: fixed; z-index: 0; inset: 0; overflow: hidden; pointer-events: none; }
.ambient-orb { position: absolute; width: min(60vw, 720px); aspect-ratio: 1; border-radius: 50%; filter: blur(65px); opacity: .24; animation: drift 18s ease-in-out infinite alternate; }
.orb-one { top: -20%; left: -16%; background: #f0ad79; }
.orb-two { top: 28%; right: -20%; background: #66c4c6; animation-duration: 23s; animation-delay: -8s; }
.orb-three { bottom: -38%; left: 18%; background: #b5a0de; animation-duration: 21s; animation-delay: -13s; }
.ambient-grid { position: absolute; inset: 0; opacity: .14; background-image: radial-gradient(var(--color-accent) .65px, transparent .65px); background-size: 30px 30px; mask-image: linear-gradient(90deg, transparent, black 40%, transparent); }
@keyframes drift { to { transform: translate(16%, 12%) scale(1.22); } }
@media(prefers-reduced-motion:reduce) { .ambient-orb { animation: none; } }
</style>

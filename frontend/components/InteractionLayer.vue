<template>
  <div class="ambient-scene" aria-hidden="true"></div>
</template>
<script setup lang="ts">
/*
 * Pointer and scroll feedback for the whole site:
 * - a gentle lean on [data-tilt] elements
 * - the click ring on interactive targets
 * - card entrances and the scroll progress bar
 * All of it is skipped when the visitor prefers reduced motion.
 */
let reducedMotion: MediaQueryList | undefined
let finePointer: MediaQueryList | undefined
let revealObserver: IntersectionObserver | undefined
let pageObserver: MutationObserver | undefined
let revealFrame = 0
let scrollFrame = 0
let tilted: HTMLElement | null = null

const releaseTilt = () => {
  if (!tilted) return
  tilted.classList.remove('is-tilting')
  tilted.style.removeProperty('--rx')
  tilted.style.removeProperty('--ry')
  tilted = null
}
const onPointerMove = (event: PointerEvent) => {
  if (event.pointerType !== 'mouse' || reducedMotion?.matches || !finePointer?.matches) return
  const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-tilt]') : null
  if (target !== tilted) releaseTilt()
  if (!target) return
  const rect = target.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width - .5
  const py = (event.clientY - rect.top) / rect.height - .5
  tilted = target
  target.classList.add('is-tilting')
  target.style.setProperty('--rx', `${(-py * 5).toFixed(2)}deg`)
  target.style.setProperty('--ry', `${(px * 5).toFixed(2)}deg`)
}
const onPointerLeave = () => releaseTilt()
const onClick = (event: MouseEvent) => {
  if (reducedMotion?.matches || !event.isTrusted) return
  const target = event.target
  if (!(target instanceof Element) || !target.closest('a, button')) return
  const ring = document.createElement('span')
  ring.className = 'click-burst'
  ring.style.left = `${event.clientX}px`
  ring.style.top = `${event.clientY}px`
  document.body.append(ring)
  ring.addEventListener('animationend', () => ring.remove())
}
const setupReveals = () => {
  revealObserver?.disconnect()
  if (reducedMotion?.matches) return
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      // Anything already scrolled past is shown as well, so nothing can stay hidden.
      if (!entry.isIntersecting && entry.boundingClientRect.top > 0) continue
      entry.target.classList.add('reveal-visible')
      revealObserver?.unobserve(entry.target)
    }
  }, { rootMargin: '0px 0px -6% 0px' })
  const items = document.querySelectorAll<HTMLElement>('#main-content .release, #main-content .game-tile, #main-content .illustration')
  items.forEach((item, index) => {
    if (item.classList.contains('reveal-pending') || item.getBoundingClientRect().top < window.innerHeight * .9) return
    item.style.setProperty('--reveal-delay', `${index % 3 * 70}ms`)
    item.classList.add('reveal-pending')
    revealObserver?.observe(item)
  })
}
const updateProgress = () => {
  scrollFrame = 0
  const remaining = document.documentElement.scrollHeight - window.innerHeight
  document.querySelector<HTMLElement>('.site-header')?.style.setProperty('--page-progress', `${remaining > 0 ? Math.min(1, window.scrollY / remaining) : 0}`)
}
const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress) }
onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
  document.addEventListener('click', onClick)
  document.addEventListener('pointermove', onPointerMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onPointerLeave)
  window.addEventListener('scroll', onScroll, { passive: true })
  const main = document.getElementById('main-content')
  if (main) {
    pageObserver = new MutationObserver(() => {
      cancelAnimationFrame(revealFrame)
      revealFrame = requestAnimationFrame(() => { releaseTilt(); setupReveals(); updateProgress() })
    })
    pageObserver.observe(main, { childList: true })
  }
  setupReveals()
  updateProgress()
})
onUnmounted(() => {
  document.removeEventListener('click', onClick)
  document.removeEventListener('pointermove', onPointerMove)
  document.documentElement.removeEventListener('pointerleave', onPointerLeave)
  window.removeEventListener('scroll', onScroll)
  revealObserver?.disconnect()
  pageObserver?.disconnect()
  cancelAnimationFrame(revealFrame)
  cancelAnimationFrame(scrollFrame)
})
</script>
<style scoped>
/* A still, soft tint behind the page. Nothing here moves. */
.ambient-scene { position: fixed; z-index: 0; inset: 0; pointer-events: none; background: radial-gradient(ellipse 70% 55% at 85% -10%, color-mix(in srgb, var(--color-accent) 13%, transparent), transparent 70%); }
</style>

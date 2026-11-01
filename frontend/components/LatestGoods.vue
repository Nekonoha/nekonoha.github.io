<template>
  <div class="goods-grid">
    <a v-for="item in visibleItems" :key="item.id" class="goods" :href="item.url" target="_blank" rel="noopener noreferrer">
      <span class="goods-image">
        <img :src="item.image" :alt="item.name" width="620" height="620" loading="lazy">
        <span v-if="item.endOfSale || item.soldOut" class="goods-state">{{ state(item) }}</span>
        <span class="media-badge" aria-hidden="true">↗</span>
      </span>
      <span class="goods-caption">
        <strong>{{ item.name }}</strong>
        <span class="goods-meta"><span>{{ price(item.price) }}</span><span v-if="item.category">{{ item.category }}</span></span>
      </span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { boothItems, type BoothItem } from '~/data/booth'
const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 3 })
const { locale } = useLocale()
const visibleItems = computed(() => boothItems.slice(0, props.limit))
// BOOTH の表記「¥ 1,000~」を、サイトの書き方に合わせる。0円は「無料」。
const price = (value: string) => {
  const compact = value.replace(/^¥\s*/, '¥').replace(/~$/, '〜')
  return compact === '¥0' ? (locale.value === 'ja' ? '無料' : 'Free') : compact
}
const state = (item: BoothItem) => item.endOfSale
  ? (locale.value === 'ja' ? '販売終了' : 'No longer sold')
  : (locale.value === 'ja' ? '売り切れ' : 'Sold out')
</script>

<style scoped>
.goods-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; }
.goods { min-width: 0; text-decoration: none; }
.goods-image { display: block; aspect-ratio: 1; }
.goods img { width: 100%; height: 100%; object-fit: cover; }
.goods-state { position: absolute; z-index: 3; top: 12px; left: 12px; padding: 3px 12px; border-radius: var(--radius-pill); color: #fff; background: #11161acc; backdrop-filter: blur(8px); font-size: .78rem; }
.goods-caption { display: block; padding: 14px 2px 16px; border-bottom: 1px solid var(--line); transition: color var(--dur-fast), border-color var(--dur-fast); }
.goods-caption strong { display: -webkit-box; overflow: hidden; font-size: 1rem; font-weight: 500; line-height: 1.55; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.goods-meta { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-top: 4px; color: var(--color-text-muted); font-size: .8125rem; font-variant-numeric: tabular-nums; }
.goods:hover .goods-caption { color: var(--color-accent); border-color: var(--color-accent); }
@media(hover:hover) { .goods:hover .goods-image img { transform: scale(1.045); } }
.goods-image img { transition: transform var(--dur-slow) var(--ease-out); }
@media(max-width:760px) { .goods-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 16px; } }
</style>

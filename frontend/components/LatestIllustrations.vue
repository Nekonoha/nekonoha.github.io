<template>
  <div class="illustration-grid">
    <a v-for="work in visibleWorks" :key="work.id" class="illustration" :href="work.pixivUrl" target="_blank" rel="noopener noreferrer">
      <span class="illustration-image">
        <img :src="work.image" :alt="work.title" width="600" height="600" loading="lazy">
        <span v-if="work.pageCount > 1" class="page-count"><i class="fa-regular fa-images" aria-hidden="true"></i>{{ work.pageCount }}</span>
        <span class="media-badge" aria-hidden="true">↗</span>
      </span>
      <span class="illustration-caption">
        <strong>{{ work.title }}</strong>
        <time :datetime="work.postedAt">{{ formatDate(work.postedAt) }}</time>
      </span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { illustrations } from '~/data/illustrations'
const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 3 })
const visibleWorks = computed(() => illustrations.slice(0, props.limit))
const formatDate = (value: string) => value.slice(0, 10).replaceAll('-', '.')
</script>

<style scoped>
.illustration-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; }
.illustration { min-width: 0; text-decoration: none; }
.illustration-image { display: block; aspect-ratio: 1; }
.illustration img { width: 100%; height: 100%; object-fit: cover; }
.page-count { position: absolute; z-index: 3; top: 12px; right: 12px; display: grid; place-items: center; grid-auto-flow: column; gap: 7px; min-width: 42px; height: 30px; padding-inline: 10px; border-radius: var(--radius-pill); color: #fff; background: #11161acc; backdrop-filter: blur(8px); font-size: .78rem; }
.illustration-caption { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 14px 2px 16px; border-bottom: 1px solid var(--line); transition: color var(--dur-fast), border-color var(--dur-fast); }
.illustration-caption strong { overflow: hidden; font-size: 1rem; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.illustration-caption time { flex-shrink: 0; color: var(--color-text-muted); font-size: .8125rem; font-variant-numeric: tabular-nums; }
.illustration:hover .illustration-caption { color: var(--color-accent); border-color: var(--color-accent); }
@media(max-width:760px) { .illustration-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 24px 16px; } }
@media(max-width:420px) { .illustration-grid { grid-template-columns: 1fr; } }
</style>

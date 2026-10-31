<template>
  <form class="novel-jump" novalidate @submit.prevent="submit">
    <div class="jump-row">
      <label :for="id + '-number'">{{ locale === 'ja' ? '話数で移動' : 'Go to episode' }}</label>
      <div class="jump-field">
        <input :id="id + '-number'" ref="input" v-model="typed" type="text" inputmode="numeric" autocomplete="off" enterkeyhint="go" :placeholder="current !== undefined ? String(current + 1) : '1'" :aria-invalid="error ? 'true' : undefined" :aria-describedby="error ? id + '-error' : undefined" @input="error = ''">
        <span aria-hidden="true">/ {{ total }}</span>
        <button type="submit" class="pill pill-primary">{{ locale === 'ja' ? '移動' : 'Go' }}</button>
      </div>
    </div>
    <p v-if="error" :id="id + '-error'" class="jump-error" role="alert">{{ error }}</p>
    <div v-if="list" class="jump-row">
      <label :for="id + '-select'">{{ locale === 'ja' ? '一覧から選ぶ' : 'Pick from the list' }}</label>
      <div class="jump-select">
        <select :id="id + '-select'" :value="current ?? ''" @change="pick">
          <option v-if="current === undefined" value="" disabled>{{ locale === 'ja' ? '話を選ぶ' : 'Choose an episode' }}</option>
          <template v-if="chaptered">
            <optgroup v-for="group in groups" :key="group.title ?? ''" :label="group.title ?? (locale === 'ja' ? '章なし' : 'Other')">
              <option v-for="item in group.items" :key="item.episode.number" :value="item.index">{{ optionLabel(item.episode.title, item.index) }}</option>
            </optgroup>
          </template>
          <template v-else>
            <option v-for="(episode, index) in novel.episodes" :key="episode.number" :value="index">{{ optionLabel(episode.title, index) }}</option>
          </template>
        </select>
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </div>
    </div>
  </form>
</template>
<script setup lang="ts">
import type { Novel } from '~/composables/useNovels'
import { resolveEpisodeInput } from '~/utils/kakuyomu.mjs'
import { groupByChapter } from '~/utils/chapters.mjs'

// 話数の入力、または一覧のプルダウンから、同じ作品の別の話へ移動する。
const props = withDefaults(defineProps<{ novel: Novel; current?: number; list?: boolean }>(), { current: undefined, list: false })
const emit = defineEmits<{ go: [] }>()
const { locale } = useLocale()
const id = useId()
const input = ref<HTMLInputElement | null>(null)
const typed = ref('')
const error = ref('')
const total = computed(() => props.novel.episodes.length)
// novel.json に章があれば、プルダウンも章ごとにまとめる。
const groups = computed(() => groupByChapter(props.novel.episodes, props.novel.chapters))
const chaptered = computed(() => groups.value.some(group => group.title))
// タイトルが「第一話…」で始まる作品では、番号を重ねて付けない。
const optionLabel = (title: string, index: number) => /^第.{1,6}話/.test(title) ? title : `${index + 1}. ${title}`
const go = (index: number) => {
  typed.value = ''
  error.value = ''
  emit('go')
  if (index !== props.current) navigateTo(`/novels/${props.novel.slug}/${props.novel.episodes[index].number}`)
}
const submit = () => {
  const result = resolveEpisodeInput(typed.value, total.value)
  if ('index' in result) { go(result.index); return }
  error.value = locale.value === 'ja'
    ? `1〜${total.value} の数字を入れてください`
    : `Enter a number from 1 to ${total.value}`
  input.value?.focus()
}
const pick = (event: Event) => {
  const index = Number.parseInt((event.target as HTMLSelectElement).value, 10)
  if (Number.isInteger(index) && props.novel.episodes[index]) go(index)
}
defineExpose({ focus: () => input.value?.focus({ preventScroll: true }) })
</script>
<style scoped>
/* 警告の赤は文字色と混ぜて、明るい背景でも暗い背景でも読める濃さにする。 */
.novel-jump { --jump-error: color-mix(in srgb, #e5484d 72%, var(--color-text)); display: grid; gap: 12px; }
.jump-row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px 16px; }
.jump-row > label { color: var(--color-text-muted); font-size: .875rem; }
.jump-field { display: flex; align-items: center; gap: 10px; color: var(--color-text-muted); font-size: .875rem; font-variant-numeric: tabular-nums; white-space: nowrap; }
/* 16px 以上にして、iOS で入力時に画面が拡大されないようにする。 */
input { width: 4.6em; height: 44px; padding: 0 10px; border: 1px solid var(--line); border-radius: 12px; color: var(--color-text); background: var(--color-panel); font-size: 1rem; font-variant-numeric: tabular-nums; text-align: center; transition: border-color var(--dur-fast); }
input:focus-visible { border-color: var(--color-accent); outline-offset: 1px; }
input[aria-invalid="true"] { border-color: var(--jump-error); }
.jump-field .pill { min-height: 44px; padding-inline: 18px; }
.jump-error { color: var(--jump-error); font-size: .8125rem; text-align: right; }
.jump-select { position: relative; flex: 1 1 220px; min-width: 0; }
select { width: 100%; height: 46px; padding: 0 40px 0 14px; border: 1px solid var(--line); border-radius: 12px; color: var(--color-text); background: var(--color-panel); font: inherit; font-size: 1rem; text-overflow: ellipsis; appearance: none; -webkit-appearance: none; cursor: pointer; transition: border-color var(--dur-fast); }
select:hover { border-color: var(--color-accent); }
.jump-select i { position: absolute; top: 50%; right: 15px; color: var(--color-text-muted); font-size: .75rem; translate: 0 -50%; pointer-events: none; }
</style>

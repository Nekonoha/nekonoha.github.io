
<template>
  <div class="splide-carousel">
    <Splide
      :options="mainOptions"
      ref="mainSplide"
      @moved="onMainMoved"
      aria-label="Screenshots"
    >
      <SplideSlide v-for="(img, i) in screenshots" :key="i">
        <img :src="img" :alt="`Screenshot ${i + 1}`" class="main-image" />
      </SplideSlide>
    </Splide>
    <Splide
      :options="thumbOptions"
      ref="thumbSplide"
      class="thumbs"
      aria-label="Thumbnails"
    >
      <SplideSlide v-for="(img, i) in screenshots" :key="i">
        <img :src="img" :alt="`Thumbnail ${i + 1}`" class="thumb-image" @click="onThumbClick(i)" />
      </SplideSlide>
    </Splide>
    <!-- Splideのfractionページネーションを利用 -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/splide.min.css';

interface Props {
  screenshots: string[];
}
const props = defineProps<Props>();

const mainSplide = ref<any>(null);
const thumbSplide = ref<any>(null);
const currentIndex = ref(0);

const mainOptions = {
  type: 'loop',
  perPage: 1,
  pagination: 'fraction',
  arrows: true,
  heightRatio: 0.8,
  cover: true,
  breakpoints: {
    600: { heightRatio: 0.7 },
    400: { heightRatio: 0.6 },
  },
};

const thumbOptions = {
  type: 'slide',
  fixedWidth: 64,
  fixedHeight: 48,
  isNavigation: true,
  gap: 8,
  focus: 'center',
  pagination: false,
  cover: true,
  arrows: false,
  breakpoints: {
    600: { fixedWidth: 48, fixedHeight: 36 },
    400: { fixedWidth: 36, fixedHeight: 28 },
  },
};

const syncSplide = () => {
  if (mainSplide.value && thumbSplide.value) {
    mainSplide.value.sync(thumbSplide.value.splide);
  }
};

watch([mainSplide, thumbSplide], () => {
  nextTick(syncSplide);
});

// Splideのmovedイベントの引数は { newIndex } 形式
const onMainMoved = (args: { newIndex: number }) => {
  currentIndex.value = args.newIndex;
};

// サムネイルクリック時にもcurrentIndexを更新
const onThumbClick = (index: number) => {
  currentIndex.value = index;
};
</script>

<style scoped>
.splide-carousel {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.main-image {
  width: 100%;
  aspect-ratio: 5/4;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid rgba(182, 141, 64, 0.35);
}
.thumbs {
  margin-top: 0.2rem;
}
.thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 3px;
  border: 1px solid rgba(182, 141, 64, 0.3);
  opacity: 0.7;
  transition: border-color 0.2s, opacity 0.2s;
}
.splide__slide.is-active .thumb-image {
  border-color: rgba(182, 141, 64, 0.8);
  opacity: 1;
  box-shadow: 0 0 8px rgba(182, 141, 64, 0.3);
}
.carousel-counter {
  text-align: center;
  margin-top: 0.2rem;
  color: var(--color-sub, #b68d40);
  font-size: 0.8rem;
}
</style>

<template>
  <div class="app">
    <BackgroundAnimation />
    <Header />
    <SettingsModal v-model="settingsOpen" />
    <main id="main-content">
      <slot />
    </main>
    <Footer />
    <div v-if="isNavigating" class="route-loader" role="alert" aria-live="polite" aria-label="Loading">
      <div class="loader">
        <span v-for="i in 11" :key="i"></span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import SettingsModal from '~/components/SettingsModal.vue'
import BackgroundAnimation from '~/components/BackgroundAnimation.vue'

const settingsOpen = ref(false)
provide('settingsOpen', settingsOpen)
const router = useRouter()
const isNavigating = ref(false)
let loaderTimeout: number | null = null

const stopLoader = (delay = 200) => {
  if (loaderTimeout) {
    clearTimeout(loaderTimeout)
  }
  loaderTimeout = window.setTimeout(() => {
    isNavigating.value = false
    loaderTimeout = null
  }, delay)
}

onMounted(() => {
  router.beforeEach((_to, _from, next) => {
    if (loaderTimeout) {
      clearTimeout(loaderTimeout)
      loaderTimeout = null
    }
    isNavigating.value = true
    next()
  })

  router.afterEach(() => {
    stopLoader(250)
  })
})

onUnmounted(() => {
  if (loaderTimeout) {
    clearTimeout(loaderTimeout)
  }
})

// Google Fontsを読み込み
useHead({
  title: '針の筵 - nekonoha',
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect', 
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Noto+Sans+JP:wght@300;400;500;700&display=swap'
    }
  ]
})
</script>
<style>
 :root {
  --color-main: #3C2F2F;
  --color-main-strong: #2f2424;
  --color-surface: #4a3a32;
  --color-panel: #2f2624;
  --color-sub: #EADBC8;
  --color-sub-strong: #d8c7ae;
  --color-accent: #C7A860;
  --color-accent-strong: #9b7634;
  --color-text: #F5EFE6;
  --color-text-muted: #D4CDBF;
  --color-muted: rgba(234, 219, 200, 0.65);
  --color-rgb-main: 60, 47, 47;
  --color-rgb-accent: 199, 168, 96;
  --shadow-strong: 0 2px 16px rgba(0, 0, 0, 0.35);
  --shadow-soft: 0 10px 40px rgba(0, 0, 0, 0.28);
  --shadow-subtle: 0 4px 12px rgba(0, 0, 0, 0.15);
  --header-bg: linear-gradient(180deg, rgba(60, 47, 47, 0.96) 0%, rgba(44, 35, 35, 0.92) 100%);
  --footer-bg: linear-gradient(180deg, rgba(60, 47, 47, 0.98) 0%, rgba(44, 35, 35, 0.95) 100%);
 }

/* ラグジュアリーテーマ (元デフォルト) */
[data-theme="luxury"] {
  --color-main: #3C2F2F;
  --color-main-strong: #2f2424;
  --color-surface: #4a3a32;
  --color-panel: #2f2624;
  --color-sub: #EADBC8;
  --color-sub-strong: #d8c7ae;
  --color-accent: #C7A860;
  --color-accent-strong: #9b7634;
  --color-text: #F5EFE6;
  --color-text-muted: #D4CDBF;
  --color-muted: rgba(234, 219, 200, 0.65);
  --color-rgb-main: 60, 47, 47;
  --color-rgb-accent: 199, 168, 96;
  --shadow-strong: 0 2px 16px rgba(0, 0, 0, 0.35);
  --shadow-soft: 0 10px 40px rgba(0, 0, 0, 0.28);
  --shadow-subtle: 0 4px 12px rgba(0, 0, 0, 0.15);
  --header-bg: linear-gradient(180deg, rgba(60, 47, 47, 0.96) 0%, rgba(44, 35, 35, 0.92) 100%);
  --footer-bg: linear-gradient(180deg, rgba(60, 47, 47, 0.98) 0%, rgba(44, 35, 35, 0.95) 100%);
}

/* ライトテーマ */
[data-theme="light"] {
  --color-main: #F5F0E8;
  --color-main-strong: #EDE6DB;
  --color-surface: #FFFFFF;
  --color-panel: #FAFAF8;
  --color-sub: #2F2424;
  --color-sub-strong: #1a1515;
  --color-accent: #7a5e2a;
  --color-accent-strong: #5d4620;
  --color-text: #1a1a1a;
  --color-text-muted: #4a4a4a;
  --color-muted: rgba(74, 58, 50, 0.65);
  --color-rgb-main: 245, 240, 232;
  --color-rgb-accent: 122, 94, 42;
  --shadow-strong: 0 2px 16px rgba(0, 0, 0, 0.15);
  --shadow-soft: 0 10px 40px rgba(0, 0, 0, 0.1);
  --shadow-subtle: 0 4px 12px rgba(0, 0, 0, 0.06);
  --header-bg: linear-gradient(180deg, rgba(245, 240, 232, 0.98) 0%, rgba(237, 230, 219, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(245, 240, 232, 0.99) 0%, rgba(237, 230, 219, 0.96) 100%);
}

/* モダンテーマ */
[data-theme="modern"] {
  --color-main: #1a1a2e;
  --color-main-strong: #0f0f1e;
  --color-surface: #16213e;
  --color-panel: #1a1a2e;
  --color-sub: #ff6b6b;
  --color-sub-strong: #ff5252;
  --color-accent: #4ecdc4;
  --color-accent-strong: #45b7b0;
  --color-text: #ffffff;
  --color-text-muted: #d0d0d0;
  --color-muted: rgba(255, 255, 255, 0.65);
  --color-rgb-main: 26, 26, 46;
  --color-rgb-accent: 78, 205, 196;
  --shadow-strong: 0 2px 16px rgba(0, 0, 0, 0.6);
  --shadow-soft: 0 10px 40px rgba(0, 0, 0, 0.5);
  --shadow-subtle: 0 4px 12px rgba(0, 0, 0, 0.4);
  --header-bg: linear-gradient(180deg, rgba(26, 26, 46, 0.98) 0%, rgba(15, 15, 30, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(26, 26, 46, 0.99) 0%, rgba(15, 15, 30, 0.96) 100%);
}

/* ダークテーマ */
[data-theme="dark"] {
  --color-main: #0d0d1a;
  --color-main-strong: #05050d;
  --color-surface: #1a1a2d;
  --color-panel: #0d0d1a;
  --color-sub: #e0e0ff;
  --color-sub-strong: #c0c0ff;
  --color-accent: #7b68ee;
  --color-accent-strong: #6a5acd;
  --color-text: #f0f0ff;
  --color-text-muted: #b0b0d0;
  --color-muted: rgba(224, 224, 255, 0.65);
  --color-rgb-main: 13, 13, 26;
  --color-rgb-accent: 123, 104, 238;
  --shadow-strong: 0 2px 16px rgba(123, 104, 238, 0.25);
  --shadow-soft: 0 10px 40px rgba(123, 104, 238, 0.15);
  --shadow-subtle: 0 4px 12px rgba(123, 104, 238, 0.1);
  --header-bg: linear-gradient(180deg, rgba(13, 13, 26, 0.98) 0%, rgba(5, 5, 13, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(13, 13, 26, 0.99) 0%, rgba(5, 5, 13, 0.96) 100%);
}

/* サイバーテーマ */
[data-theme="cyber"] {
  --color-main: #0a0e27;
  --color-main-strong: #050810;
  --color-surface: #0f1535;
  --color-panel: #0a0e27;
  --color-sub: #00ff88;
  --color-sub-strong: #00cc6a;
  --color-accent: #ff00ff;
  --color-accent-strong: #cc00cc;
  --color-text: #00ff88;
  --color-text-muted: #00cc6a;
  --color-muted: rgba(0, 255, 136, 0.65);
  --color-rgb-main: 10, 14, 39;
  --color-rgb-accent: 255, 0, 255;
  --shadow-strong: 0 2px 16px rgba(0, 255, 136, 0.25);
  --shadow-soft: 0 10px 40px rgba(255, 0, 255, 0.15);
  --shadow-subtle: 0 4px 12px rgba(0, 255, 136, 0.1);
  --header-bg: linear-gradient(180deg, rgba(10, 14, 39, 0.98) 0%, rgba(5, 8, 16, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(10, 14, 39, 0.99) 0%, rgba(5, 8, 16, 0.96) 100%);
}

/* フォレストテーマ */
[data-theme="forest"] {
  --color-main: #1b3a2e;
  --color-main-strong: #0f2619;
  --color-surface: #2d5a47;
  --color-panel: #1b3a2e;
  --color-sub: #a8d5ba;
  --color-sub-strong: #7bc47b;
  --color-accent: #52b788;
  --color-accent-strong: #2d6a4f;
  --color-text: #e8f5e9;
  --color-text-muted: #c8e6c9;
  --color-muted: rgba(168, 213, 186, 0.65);
  --color-rgb-main: 27, 58, 46;
  --color-rgb-accent: 82, 183, 136;
  --shadow-strong: 0 2px 16px rgba(45, 106, 79, 0.35);
  --shadow-soft: 0 10px 40px rgba(45, 106, 79, 0.25);
  --shadow-subtle: 0 4px 12px rgba(45, 106, 79, 0.15);
  --header-bg: linear-gradient(180deg, rgba(27, 58, 46, 0.98) 0%, rgba(15, 38, 25, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(27, 58, 46, 0.99) 0%, rgba(15, 38, 25, 0.96) 100%);
}

/* サンセットテーマ */
[data-theme="sunset"] {
  --color-main: #2d1b1b;
  --color-main-strong: #1a0f0f;
  --color-surface: #4a2c2c;
  --color-panel: #2d1b1b;
  --color-sub: #ffb84d;
  --color-sub-strong: #ff9800;
  --color-accent: #ff6b6b;
  --color-accent-strong: #ff5252;
  --color-text: #fff3e0;
  --color-text-muted: #ffe0b2;
  --color-muted: rgba(255, 184, 77, 0.65);
  --color-rgb-main: 45, 27, 27;
  --color-rgb-accent: 255, 107, 107;
  --shadow-strong: 0 2px 16px rgba(255, 107, 107, 0.3);
  --shadow-soft: 0 10px 40px rgba(255, 107, 107, 0.2);
  --shadow-subtle: 0 4px 12px rgba(255, 107, 107, 0.1);
  --header-bg: linear-gradient(180deg, rgba(45, 27, 27, 0.98) 0%, rgba(26, 15, 15, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(45, 27, 27, 0.99) 0%, rgba(26, 15, 15, 0.96) 100%);
}

/* ラベンダーテーマ */
[data-theme="lavender"] {
  --color-main: #2d1b3d;
  --color-main-strong: #1a0f24;
  --color-surface: #4a2d5a;
  --color-panel: #2d1b3d;
  --color-sub: #d4a5ff;
  --color-sub-strong: #c08aff;
  --color-accent: #9d4edd;
  --color-accent-strong: #7209b7;
  --color-text: #f3e5ff;
  --color-text-muted: #dcc9ff;
  --color-muted: rgba(212, 165, 255, 0.65);
  --color-rgb-main: 45, 27, 61;
  --color-rgb-accent: 157, 78, 221;
  --shadow-strong: 0 2px 16px rgba(157, 78, 221, 0.3);
  --shadow-soft: 0 10px 40px rgba(157, 78, 221, 0.2);
  --shadow-subtle: 0 4px 12px rgba(157, 78, 221, 0.1);
  --header-bg: linear-gradient(180deg, rgba(45, 27, 61, 0.98) 0%, rgba(26, 15, 36, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(45, 27, 61, 0.99) 0%, rgba(26, 15, 36, 0.96) 100%);
}

/* オーシャンテーマ */
[data-theme="ocean"] {
  --color-main: #0b1f2a;
  --color-main-strong: #071520;
  --color-surface: #123447;
  --color-panel: #0b1f2a;
  --color-sub: #7fd8ff;
  --color-sub-strong: #4bbbe6;
  --color-accent: #2b9fff;
  --color-accent-strong: #1f7fcc;
  --color-text: #e3f6ff;
  --color-text-muted: #b3ddf5;
  --color-muted: rgba(127, 216, 255, 0.65);
  --color-rgb-main: 11, 31, 42;
  --color-rgb-accent: 43, 159, 255;
  --shadow-strong: 0 2px 16px rgba(43, 159, 255, 0.28);
  --shadow-soft: 0 10px 40px rgba(43, 159, 255, 0.2);
  --shadow-subtle: 0 4px 12px rgba(43, 159, 255, 0.12);
  --header-bg: linear-gradient(180deg, rgba(11, 31, 42, 0.98) 0%, rgba(7, 21, 32, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(11, 31, 42, 0.99) 0%, rgba(7, 21, 32, 0.96) 100%);
}

/* オーロラテーマ */
[data-theme="aurora"] {
  --color-main: #0b1220;
  --color-main-strong: #060a14;
  --color-surface: #14223a;
  --color-panel: #0b1220;
  --color-sub: #9efcff;
  --color-sub-strong: #6fe3e8;
  --color-accent: #b388ff;
  --color-accent-strong: #7f5ad8;
  --color-text: #eaf8ff;
  --color-text-muted: #c8e0f8;
  --color-muted: rgba(158, 252, 255, 0.65);
  --color-rgb-main: 11, 18, 32;
  --color-rgb-accent: 179, 136, 255;
  --shadow-strong: 0 2px 16px rgba(179, 136, 255, 0.28);
  --shadow-soft: 0 10px 40px rgba(179, 136, 255, 0.2);
  --shadow-subtle: 0 4px 12px rgba(179, 136, 255, 0.12);
  --header-bg: linear-gradient(180deg, rgba(11, 18, 32, 0.98) 0%, rgba(6, 10, 20, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(11, 18, 32, 0.99) 0%, rgba(6, 10, 20, 0.96) 100%);
}

/* ブラッシュテーマ */
[data-theme="blush"] {
  --color-main: #2b1a1f;
  --color-main-strong: #1d1116;
  --color-surface: #42252e;
  --color-panel: #2b1a1f;
  --color-sub: #ffccd9;
  --color-sub-strong: #ff9fb8;
  --color-accent: #ff7d9c;
  --color-accent-strong: #e45a7d;
  --color-text: #ffeef3;
  --color-text-muted: #f5cbd7;
  --color-muted: rgba(255, 204, 217, 0.65);
  --color-rgb-main: 43, 26, 31;
  --color-rgb-accent: 255, 125, 156;
  --shadow-strong: 0 2px 16px rgba(255, 125, 156, 0.28);
  --shadow-soft: 0 10px 40px rgba(255, 125, 156, 0.2);
  --shadow-subtle: 0 4px 12px rgba(255, 125, 156, 0.12);
  --header-bg: linear-gradient(180deg, rgba(43, 26, 31, 0.98) 0%, rgba(29, 17, 22, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(43, 26, 31, 0.99) 0%, rgba(29, 17, 22, 0.96) 100%);
}

/* ミントテーマ */
[data-theme="mint"] {
  --color-main: #14241c;
  --color-main-strong: #0d1713;
  --color-surface: #1f3a2c;
  --color-panel: #14241c;
  --color-sub: #c7ffef;
  --color-sub-strong: #98f7d9;
  --color-accent: #7df0c3;
  --color-accent-strong: #46c592;
  --color-text: #eafff7;
  --color-text-muted: #c5f2de;
  --color-muted: rgba(125, 240, 195, 0.65);
  --color-rgb-main: 20, 36, 28;
  --color-rgb-accent: 125, 240, 195;
  --shadow-strong: 0 2px 16px rgba(125, 240, 195, 0.28);
  --shadow-soft: 0 10px 40px rgba(125, 240, 195, 0.2);
  --shadow-subtle: 0 4px 12px rgba(125, 240, 195, 0.12);
  --header-bg: linear-gradient(180deg, rgba(20, 36, 28, 0.98) 0%, rgba(13, 23, 19, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(20, 36, 28, 0.99) 0%, rgba(13, 23, 19, 0.96) 100%);
}

/* ミッドナイトテーマ */
[data-theme="midnight"] {
  --color-main: #0a0a14;
  --color-main-strong: #05050c;
  --color-surface: #11112b;
  --color-panel: #0a0a14;
  --color-sub: #cfd9ff;
  --color-sub-strong: #a8b6ff;
  --color-accent: #5dade2;
  --color-accent-strong: #3b82c4;
  --color-text: #e6edff;
  --color-text-muted: #c2ccef;
  --color-muted: rgba(93, 173, 226, 0.65);
  --color-rgb-main: 10, 10, 20;
  --color-rgb-accent: 93, 173, 226;
  --shadow-strong: 0 2px 16px rgba(93, 173, 226, 0.28);
  --shadow-soft: 0 10px 40px rgba(93, 173, 226, 0.2);
  --shadow-subtle: 0 4px 12px rgba(93, 173, 226, 0.12);
  --header-bg: linear-gradient(180deg, rgba(10, 10, 20, 0.98) 0%, rgba(5, 5, 12, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(10, 10, 20, 0.99) 0%, rgba(5, 5, 12, 0.96) 100%);
}

/* サンライズテーマ */
[data-theme="sunrise"] {
  --color-main: #2e1c16;
  --color-main-strong: #1e120f;
  --color-surface: #43261c;
  --color-panel: #2e1c16;
  --color-sub: #ffd6a0;
  --color-sub-strong: #ffb574;
  --color-accent: #ff9f43;
  --color-accent-strong: #f3722c;
  --color-text: #fff3e5;
  --color-text-muted: #ffdcb8;
  --color-muted: rgba(255, 159, 67, 0.65);
  --color-rgb-main: 46, 28, 22;
  --color-rgb-accent: 255, 159, 67;
  --shadow-strong: 0 2px 16px rgba(255, 159, 67, 0.3);
  --shadow-soft: 0 10px 40px rgba(255, 159, 67, 0.22);
  --shadow-subtle: 0 4px 12px rgba(255, 159, 67, 0.12);
  --header-bg: linear-gradient(180deg, rgba(46, 28, 22, 0.98) 0%, rgba(30, 18, 15, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(46, 28, 22, 0.99) 0%, rgba(30, 18, 15, 0.96) 100%);
}

/* エンバーテーマ */
[data-theme="ember"] {
  --color-main: #1c0f0b;
  --color-main-strong: #110805;
  --color-surface: #2b1811;
  --color-panel: #1c0f0b;
  --color-sub: #ffc49f;
  --color-sub-strong: #ff9f76;
  --color-accent: #ff6f3c;
  --color-accent-strong: #d94a1e;
  --color-text: #ffe6d8;
  --color-text-muted: #ffc9ae;
  --color-muted: rgba(255, 111, 60, 0.65);
  --color-rgb-main: 28, 15, 11;
  --color-rgb-accent: 255, 111, 60;
  --shadow-strong: 0 2px 16px rgba(255, 111, 60, 0.3);
  --shadow-soft: 0 10px 40px rgba(255, 111, 60, 0.22);
  --shadow-subtle: 0 4px 12px rgba(255, 111, 60, 0.12);
  --header-bg: linear-gradient(180deg, rgba(28, 15, 11, 0.98) 0%, rgba(17, 8, 5, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(28, 15, 11, 0.99) 0%, rgba(17, 8, 5, 0.96) 100%);
}

/* さくらテーマ */
[data-theme="sakura"] {
  --color-main: #241219;
  --color-main-strong: #170b11;
  --color-surface: #3b1d29;
  --color-panel: #241219;
  --color-sub: #ffd9e8;
  --color-sub-strong: #ffb6d2;
  --color-accent: #ff8fb1;
  --color-accent-strong: #ff5c8a;
  --color-text: #fff4f8;
  --color-text-muted: #f8cadd;
  --color-muted: rgba(255, 143, 177, 0.65);
  --color-rgb-main: 36, 18, 25;
  --color-rgb-accent: 255, 143, 177;
  --shadow-strong: 0 2px 16px rgba(255, 143, 177, 0.3);
  --shadow-soft: 0 10px 40px rgba(255, 143, 177, 0.22);
  --shadow-subtle: 0 4px 12px rgba(255, 143, 177, 0.12);
  --header-bg: linear-gradient(180deg, rgba(36, 18, 25, 0.98) 0%, rgba(23, 11, 17, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(36, 18, 25, 0.99) 0%, rgba(23, 11, 17, 0.96) 100%);
}

/* ラグーンテーマ */
[data-theme="lagoon"] {
  --color-main: #0b1d24;
  --color-main-strong: #061119;
  --color-surface: #13303a;
  --color-panel: #0b1d24;
  --color-sub: #a8fff2;
  --color-sub-strong: #6bf0dc;
  --color-accent: #3ed6c6;
  --color-accent-strong: #21a89a;
  --color-text: #e5fffb;
  --color-text-muted: #c3efe7;
  --color-muted: rgba(62, 214, 198, 0.65);
  --color-rgb-main: 11, 29, 36;
  --color-rgb-accent: 62, 214, 198;
  --shadow-strong: 0 2px 16px rgba(62, 214, 198, 0.3);
  --shadow-soft: 0 10px 40px rgba(62, 214, 198, 0.22);
  --shadow-subtle: 0 4px 12px rgba(62, 214, 198, 0.12);
  --header-bg: linear-gradient(180deg, rgba(11, 29, 36, 0.98) 0%, rgba(6, 17, 25, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(11, 29, 36, 0.99) 0%, rgba(6, 17, 25, 0.96) 100%);
}

/* ゴールデンテーマ */
[data-theme="golden"] {
  --color-main: #2f240d;
  --color-main-strong: #1f1708;
  --color-surface: #3c2f10;
  --color-panel: #2f240d;
  --color-sub: #f0dfa6;
  --color-sub-strong: #e7c96b;
  --color-accent: #d4a017;
  --color-accent-strong: #a87a0d;
  --color-text: #fff7d6;
  --color-text-muted: #e8d7a3;
  --color-muted: rgba(212, 160, 23, 0.65);
  --color-rgb-main: 47, 36, 13;
  --color-rgb-accent: 212, 160, 23;
  --shadow-strong: 0 2px 16px rgba(212, 160, 23, 0.3);
  --shadow-soft: 0 10px 40px rgba(212, 160, 23, 0.22);
  --shadow-subtle: 0 4px 12px rgba(212, 160, 23, 0.12);
  --header-bg: linear-gradient(180deg, rgba(47, 36, 13, 0.98) 0%, rgba(31, 23, 8, 0.95) 100%);
  --footer-bg: linear-gradient(180deg, rgba(47, 36, 13, 0.99) 0%, rgba(31, 23, 8, 0.96) 100%);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* スクロールバーのスタイリング */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: var(--color-main);
}

::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: 6px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent-strong);
}

/* Firefox用スクロールバー */
* {
  scrollbar-color: var(--color-accent) var(--color-main);
  scrollbar-width: thin;
}

html {
  overflow-x: hidden;
}

body {
  font-family: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-size: clamp(15px, 0.5vw + 14px, 17px);
  background: radial-gradient(circle at 20% 20%, rgba(var(--color-rgb-accent), 0.08), transparent 35%),
              radial-gradient(circle at 80% 0%, rgba(var(--color-rgb-accent), 0.06), transparent 40%),
              linear-gradient(135deg, var(--color-main-strong) 0%, var(--color-main) 45%, var(--color-panel) 100%);
  color: var(--color-text);
  line-height: 1.65;
  letter-spacing: 0.3px;
  min-height: 100vh;
  font-weight: 400;
  overflow-x: hidden;
  transition: background 0.3s ease, color 0.3s ease;
}

[data-theme="light"] body,
[data-theme="modern"] body,
[data-theme="dark"] body,
[data-theme="luxury"] body,
[data-theme="cyber"] body,
[data-theme="forest"] body,
[data-theme="sunset"] body,
[data-theme="lavender"] body,
[data-theme="ocean"] body,
[data-theme="aurora"] body,
[data-theme="blush"] body,
[data-theme="mint"] body,
[data-theme="midnight"] body,
[data-theme="sunrise"] body,
[data-theme="ember"] body,
[data-theme="sakura"] body,
[data-theme="lagoon"] body,
[data-theme="golden"] body {
  background: radial-gradient(circle at 20% 20%, rgba(var(--color-rgb-accent), 0.08), transparent 35%),
              radial-gradient(circle at 80% 0%, rgba(var(--color-rgb-accent), 0.06), transparent 40%),
              linear-gradient(135deg, var(--color-main-strong) 0%, var(--color-main) 45%, var(--color-panel) 100%);
}

/* CSS変数でアニメーション時間を制御 */
:root {
  --transition-duration: 0.3s;
  --animation-duration: 0.6s;
}

[data-reduced-motion="true"] {
  --transition-duration: 0.01ms;
  --animation-duration: 0.01ms;
}

[data-reduced-motion="true"] * {
  animation-duration: var(--animation-duration) !important;
  transition-duration: var(--transition-duration) !important;
}

/* =====================================
   アクセシビリティ：キーボードフォーカス表示
   ===================================== */

a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* =====================================
   アクセシビリティ：モーション削減プリファレンス
   ===================================== */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* スクリーンリーダー専用テキスト */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
  min-height: 70vh;
  padding: clamp(1.75rem, 2vw + 1rem, 3rem) clamp(1.25rem, 5vw, 2.25rem);
  padding-top: calc(clamp(1.75rem, 2vw + 1rem, 3rem) + 70px);
  padding-bottom: calc(clamp(1.75rem, 2vw + 1rem, 3rem) + 80px);
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  animation: slideUp 0.6s ease-out;
}

.no-chrome main {
  padding: 0;
  max-width: none;
  width: 100%;
  min-height: 100vh;
  margin: 0;
  animation: none;
}

.route-loader {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 50%, rgba(var(--color-rgb-main), 0.45), rgba(var(--color-rgb-main), 0.8));
  backdrop-filter: blur(6px);
  z-index: 1200;
}

.route-loader .loader {
  display: flex;
  width: 190px;
  height: 110px;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
}

.route-loader .loader span {
  display: block;
  background: linear-gradient(180deg, var(--color-sub), var(--color-accent));
  width: 9px;
  height: 18%;
  border-radius: 14px;
  animation: barLoad 2.5s infinite linear;
  box-shadow: 0 0 10px rgba(var(--color-rgb-accent), 0.35);
}

.route-loader .loader span:nth-child(1) { animation-delay: 1.4s; }
.route-loader .loader span:nth-child(2) { animation-delay: 1.2s; }
.route-loader .loader span:nth-child(3) { animation-delay: 1s; }
.route-loader .loader span:nth-child(4) { animation-delay: 0.8s; }
.route-loader .loader span:nth-child(5) { animation-delay: 0.6s; }
.route-loader .loader span:nth-child(6) { animation-delay: 0.4s; }
.route-loader .loader span:nth-child(7) { animation-delay: 0.2s; }
.route-loader .loader span:nth-child(8) { animation-delay: 0s; }
.route-loader .loader span:nth-child(9) { animation-delay: 0.2s; }
.route-loader .loader span:nth-child(10) { animation-delay: 0.4s; }
.route-loader .loader span:nth-child(11) { animation-delay: 0.6s; }

@keyframes barLoad {
  0% { height: 20%; opacity: 0.35; }
  50% { height: 92%; opacity: 1; }
  100% { height: 20%; opacity: 0.35; }
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  main {
    padding: 1.5rem 1.25rem;
  }
}

@media (max-width: 540px) {
  main {
    padding: 1.25rem 1rem 1.5rem;
  }
}
</style>

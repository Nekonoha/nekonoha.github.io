<template>
  <header class="header" role="banner">
    <nav aria-label="メインナビゲーション" class="nav-main">
      <NuxtLink to="/" class="logo">針の筵</NuxtLink>
      <button 
        class="menu-btn" 
        @click="open = !open"
        @keydown.enter="open = !open"
        @keydown.space.prevent="open = !open"
        :aria-expanded="open"
        aria-label="ナビゲーションメニューの開閉"
        aria-controls="nav-menu"
      >
        <span class="bar" aria-hidden="true"></span>
        <span class="bar" aria-hidden="true"></span>
        <span class="bar" aria-hidden="true"></span>
      </button>
      <Transition name="menu-slide">
        <ul v-if="!isMobile || open" id="nav-menu" role="menubar">
          <li role="none"><NuxtLink to="/" @click="open = false" role="menuitem"><i class="fas fa-home" aria-hidden="true"></i> {{ t('header.top') }}</NuxtLink></li>
          <li role="none"><NuxtLink to="/about" @click="open = false" role="menuitem"><i class="fas fa-info-circle" aria-hidden="true"></i> {{ t('header.about') }}</NuxtLink></li>
          <li role="none"><NuxtLink to="/works" @click="open = false" role="menuitem"><i class="fas fa-briefcase" aria-hidden="true"></i> {{ t('header.works') }}</NuxtLink></li>
          <li role="none">
            <button 
              @click="openSettings" 
              class="lang-btn-header"
              role="menuitem"
              :aria-label="t('settings.title')"
            >
              <i class="fas fa-cog" aria-hidden="true"></i> {{ t('settings.title') }}
            </button>
          </li>
        </ul>
      </Transition>
    </nav>
  </header>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, inject } from 'vue'

const open = ref(false)
const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth <= 768 : false)
const { t, locale } = useLocale()
const settingsOpen = inject('settingsOpen') as any

const openSettings = () => {
  settingsOpen.value = true
  open.value = false
}

watch(open, (isOpen) => {
  document.documentElement.style.overflow = isOpen ? 'hidden' : ''
})

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile, { passive: true })
})

onUnmounted(() => {
  document.documentElement.style.overflow = ''
  window.removeEventListener('resize', updateIsMobile)
})
</script>
<style scoped>
.header {
  background: var(--header-bg);
  color: var(--color-text);
  padding: 1rem 2rem;
  box-shadow: var(--shadow-strong);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--color-rgb-accent), 0.35);
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
}

.nav-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  max-width: 1200px;
  flex: 1;
  gap: 1rem;
}

.logo {
  font-weight: bold;
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-sub) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeIn 0.8s ease-in;
  text-decoration: none;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 0 8px rgba(var(--color-rgb-accent), 0.25));
  padding: 0.5rem;
  border-radius: 4px;
  flex-shrink: 0;
}

.logo:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.logo:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 12px rgba(182, 141, 64, 0.4));
}
.menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  touch-action: manipulation;
}

.menu-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

.menu-btn .bar {
  width: 28px;
  height: 3px;
  background: var(--color-sub);
  border-radius: 3px;
  transition: all 0.3s ease;
}
.menu-btn:hover .bar {
  background: var(--color-accent);
  box-shadow: 0 0 8px rgba(182, 141, 64, 0.45);
}
ul {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
ul li a {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 600;
  position: relative;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  border-radius: 4px;
}

ul li a:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

ul li a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-sub));
  transition: width 0.3s ease;
  box-shadow: 0 0 4px rgba(var(--color-rgb-accent), 0.35);
}
ul li a:hover {
  color: var(--color-sub);
  transform: translateY(-2px);
  text-shadow: 0 0 8px rgba(var(--color-rgb-accent), 0.35);
}
ul li a:hover::after {
  width: 100%;
}
ul li a.router-link-active {
  color: var(--color-sub);
  text-shadow: 0 0 8px rgba(var(--color-rgb-accent), 0.35);
}
ul li a.router-link-active::after {
  width: 100%;
}

/* 言語切り替えボタン（ヘッダー右上・常時表示） */
.lang-btn-header {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-sub) 100%);
  color: var(--color-main-strong);
  border: 1px solid rgba(var(--color-rgb-accent), 0.45);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  flex-shrink: 0;
  white-space: nowrap;
}

.lang-btn-header:focus-visible {
  outline: 2px solid rgba(182, 141, 64, 0.8);
  outline-offset: 2px;
  box-shadow: 0 0 8px rgba(var(--color-rgb-accent), 0.5);
}

.lang-btn-header:hover {
  background: linear-gradient(135deg, var(--color-sub) 0%, var(--color-accent) 100%);
  color: var(--color-main-strong);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--color-rgb-accent), 0.35);
}

.lang-btn-header i {
  margin-right: 0.3rem;
}

.lang-switch {
  display: none;
}

/* 旧スタイル（後方互換性用） */
.lang-btn {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-sub) 100%);
  color: var(--color-main-strong);
  border: 1px solid rgba(var(--color-rgb-accent), 0.45);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.lang-btn:focus-visible {
  outline: 2px solid rgba(182, 141, 64, 0.8);
  outline-offset: 2px;
  box-shadow: 0 0 8px rgba(var(--color-rgb-accent), 0.5);
}

.lang-btn:hover {
  background: linear-gradient(135deg, var(--color-sub) 0%, var(--color-accent) 100%);
  color: var(--color-main-strong);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--color-rgb-accent), 0.35);
}
.lang-btn i {
  margin-right: 0.3rem;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .nav-main {
    width: 100%;
    gap: 0.5rem;
  }

  .menu-btn {
    display: flex;
    padding: 0.5rem 0.25rem;
    margin-left: auto;
  }

  .lang-btn-header {
    width: 100%;
    order: -1;
  }

  ul {
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 0;
    background: linear-gradient(135deg, rgba(var(--color-rgb-main), 0.95) 0%, rgba(var(--color-rgb-main), 0.9) 100%);
    width: 200px;
    padding: 1.5rem 0;
    gap: 0;
    box-shadow: -4px 4px 20px rgba(var(--color-rgb-accent), 0.25);
    border-radius: 8px 0 8px 8px;
    pointer-events: auto;
    margin-top: 0.5rem;
    border: 1px solid rgba(var(--color-rgb-accent), 0.35);
  }

  ul li {
    padding: 0 1.5rem;
  }

  ul li a {
    display: block;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(var(--color-rgb-accent), 0.2);
  }

  ul li:last-child a {
    border-bottom: none;
  }
}

  .menu-slide-enter-active,
  .menu-slide-leave-active {
    transition: transform 0.25s ease, opacity 0.25s ease;
  }

  .menu-slide-enter-from,
  .menu-slide-leave-to {
    transform: translateX(110%);
    opacity: 0;
  }

  .menu-slide-enter-to,
  .menu-slide-leave-from {
    transform: translateX(0);
    opacity: 1;
  }
</style>

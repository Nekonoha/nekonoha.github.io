<template>
  <header class="header">
    <nav>
      <NuxtLink to="/" class="logo">針の筵</NuxtLink>
      <button class="menu-btn" @click="open = !open">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
      <Transition name="menu-slide">
        <ul v-if="!isMobile || open">
          <li><NuxtLink to="/" @click="open = false"><i class="fas fa-home"></i> {{ t('header.top') }}</NuxtLink></li>
          <li><NuxtLink to="/about" @click="open = false"><i class="fas fa-info-circle"></i> {{ t('header.about') }}</NuxtLink></li>
          <li><NuxtLink to="/works" @click="open = false"><i class="fas fa-briefcase"></i> {{ t('header.works') }}</NuxtLink></li>
          <li class="lang-switch">
            <button @click="switchLanguage" class="lang-btn">
              <i class="fas fa-globe"></i> {{ locale === 'ja' ? 'JP' : 'EN' }}
            </button>
          </li>
        </ul>
      </Transition>
    </nav>
  </header>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const open = ref(false)
const isMobile = ref(false)
const { t, setLocale, locale } = useLocale()

const switchLanguage = () => {
  setLocale(locale.value === 'ja' ? 'en' : 'ja')
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
  background: linear-gradient(180deg, rgba(60, 47, 47, 0.96) 0%, rgba(44, 35, 35, 0.92) 100%);
  color: var(--color-text);
  padding: 1rem 2rem;
  box-shadow: var(--shadow-strong);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(182, 141, 64, 0.35);
}
nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
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
  filter: drop-shadow(0 0 8px rgba(182, 141, 64, 0.25));
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
  box-shadow: 0 0 4px rgba(182, 141, 64, 0.35);
}
ul li a:hover {
  color: var(--color-sub);
  transform: translateY(-2px);
  text-shadow: 0 0 8px rgba(182, 141, 64, 0.35);
}
ul li a:hover::after {
  width: 100%;
}
ul li a.router-link-active {
  color: var(--color-sub);
  text-shadow: 0 0 8px rgba(182, 141, 64, 0.35);
}
ul li a.router-link-active::after {
  width: 100%;
}
.lang-switch {
  display: flex;
  align-items: center;
}
.lang-btn {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-sub) 100%);
  color: var(--color-main-strong);
  border: 1px solid rgba(182, 141, 64, 0.45);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}
.lang-btn:hover {
  background: linear-gradient(135deg, var(--color-sub) 0%, var(--color-accent) 100%);
  color: var(--color-main-strong);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(182, 141, 64, 0.35);
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
  }
  .menu-btn {
    display: flex;
    padding: 0.5rem 0.25rem;
  }
  ul {
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: 0;
    background: linear-gradient(135deg, rgba(60, 47, 47, 0.95) 0%, rgba(44, 35, 35, 0.95) 100%);
    width: 200px;
    padding: 1.5rem 0;
    gap: 0;
    box-shadow: -4px 4px 20px rgba(0, 0, 0, 0.35);
    border-radius: 8px 0 0 8px;
    pointer-events: auto;
  }
  ul li {
    padding: 0 1.5rem;
  }
  ul li a {
    display: block;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(234, 219, 200, 0.12);
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

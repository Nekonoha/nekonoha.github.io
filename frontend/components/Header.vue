<template>
  <header class="header">
    <nav>
      <NuxtLink to="/" class="logo">針の筵</NuxtLink>
      <button class="menu-btn" @click="open = !open">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
      <ul :class="{ open }">
        <li><NuxtLink to="/" @click="open = false"><i class="fas fa-home"></i> {{ t('header.top') }}</NuxtLink></li>
        <li><NuxtLink to="/about" @click="open = false"><i class="fas fa-info-circle"></i> {{ t('header.about') }}</NuxtLink></li>
        <li><NuxtLink to="/works" @click="open = false"><i class="fas fa-briefcase"></i> {{ t('header.works') }}</NuxtLink></li>
        <li class="lang-switch">
          <button @click="switchLanguage" class="lang-btn">
            <i class="fas fa-globe"></i> {{ locale === 'ja' ? 'JP' : 'EN' }}
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const { t, setLocale, locale } = useLocale()

const switchLanguage = () => {
  setLocale(locale.value === 'ja' ? 'en' : 'ja')
  open.value = false
}
</script>
<style scoped>
.header {
  background: #1E1B2E;
  color: #F8F6F0;
  padding: 1rem 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(200, 181, 209, 0.2);
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
  background: linear-gradient(135deg, #C8B5D1 0%, #A695B1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeIn 0.8s ease-in;
  text-decoration: none;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 0 8px rgba(200, 181, 209, 0.3));
}
.logo:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 12px rgba(200, 181, 209, 0.5));
}
.menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}
.menu-btn .bar {
  width: 28px;
  height: 3px;
  background: #C8B5D1;
  border-radius: 3px;
  transition: all 0.3s ease;
}
.menu-btn:hover .bar {
  background: #A695B1;
  box-shadow: 0 0 8px rgba(200, 181, 209, 0.4);
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
  color: #F8F6F0;
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
  background: linear-gradient(90deg, #C8B5D1, #A695B1);
  transition: width 0.3s ease;
  box-shadow: 0 0 4px rgba(200, 181, 209, 0.4);
}
ul li a:hover {
  color: #C8B5D1;
  transform: translateY(-2px);
  text-shadow: 0 0 8px rgba(200, 181, 209, 0.3);
}
ul li a:hover::after {
  width: 100%;
}
ul li a.router-link-active {
  color: #C8B5D1;
  text-shadow: 0 0 8px rgba(200, 181, 209, 0.3);
}
ul li a.router-link-active::after {
  width: 100%;
}
.lang-switch {
  display: flex;
  align-items: center;
}
.lang-btn {
  background: linear-gradient(135deg, #B8A5C1 0%, #A695B1 100%);
  color: #F8F6F0;
  border: 1px solid rgba(200, 181, 209, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}
.lang-btn:hover {
  background: linear-gradient(135deg, #C8B5D1 0%, #B8A5C1 100%);
  color: #2D2B4A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 194, 194, 0.4);
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
  }
  ul {
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: -250px;
    background: linear-gradient(135deg, #3A3859 0%, #2D2B4A 100%);
    width: 200px;
    padding: 1.5rem 0;
    gap: 0;
    box-shadow: -4px 4px 20px rgba(0, 0, 0, 0.3);
    border-radius: 8px 0 0 8px;
  }
  ul.open {
    right: 0;
  }
  ul li {
    padding: 0 1.5rem;
  }
  ul li a {
    display: block;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(244, 166, 195, 0.1);
  }
  ul li:last-child a {
    border-bottom: none;
  }
}
</style>

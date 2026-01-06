<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click.self="close" @keydown.esc="close">
      <div class="modal-container" role="dialog" aria-labelledby="settings-title" aria-modal="true">
        <div class="modal-header">
          <h2 id="settings-title">{{ t('settings.title') }}</h2>
          <button @click="close" class="close-btn" aria-label="閉じる">
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- テーマ設定 -->
          <section class="setting-section">
            <h3><i class="fas fa-palette" aria-hidden="true"></i> {{ t('settings.theme') }}</h3>
            <div class="theme-options">
              <button
                v-for="theme in primaryThemes"
                :key="theme.id"
                @click="setTheme(theme.id)"
                :class="['theme-btn', { active: settings.theme === theme.id }]"
                :aria-pressed="settings.theme === theme.id"
                :title="t(`settings.themeDescriptions.${theme.id}`) || t(`settings.themes.${theme.id}`)"
                :style="{ background: theme.swatch, color: theme.textColor }"
              >
                <i :class="['fas', theme.icon]" aria-hidden="true"></i>
                <span>{{ t(`settings.themes.${theme.id}`) }}</span>
              </button>
            </div>

            <button
              class="theme-toggle"
              type="button"
              @click="toggleThemeList"
              :aria-expanded="showMoreThemes"
            >
              <i :class="['fas', showMoreThemes ? 'fa-chevron-up' : 'fa-chevron-down']" aria-hidden="true"></i>
              <span>{{ showMoreThemes ? t('settings.hideThemes') : t('settings.moreThemes') }}</span>
            </button>

            <Transition name="fade">
              <div v-if="showMoreThemes" class="theme-options extra">
                <button
                  v-for="theme in extraThemes"
                  :key="theme.id"
                  @click="setTheme(theme.id)"
                  :class="['theme-btn', { active: settings.theme === theme.id }]"
                  :aria-pressed="settings.theme === theme.id"
                  :title="t(`settings.themeDescriptions.${theme.id}`) || t(`settings.themes.${theme.id}`)"
                  :style="{ background: theme.swatch, color: theme.textColor }"
                >
                  <i :class="['fas', theme.icon]" aria-hidden="true"></i>
                  <span>{{ t(`settings.themes.${theme.id}`) }}</span>
                </button>
              </div>
            </Transition>

            <p class="hint">{{ t('settings.currentTheme') }}: {{ getThemeLabel(currentTheme) }}</p>
          </section>

          <!-- 言語設定 -->
          <section class="setting-section">
            <h3><i class="fas fa-globe" aria-hidden="true"></i> {{ t('settings.language') }}</h3>
            <div class="language-options">
              <button 
                @click="changeLanguage('ja')"
                :class="['lang-btn', { active: locale === 'ja' }]"
                :aria-pressed="locale === 'ja'"
              >
                🇯🇵 日本語
              </button>
              <button 
                @click="changeLanguage('en')"
                :class="['lang-btn', { active: locale === 'en' }]"
                :aria-pressed="locale === 'en'"
              >
                🇺🇸 English
              </button>
            </div>
          </section>

          <!-- フォントサイズ -->
          <section class="setting-section">
            <h3><i class="fas fa-text-height" aria-hidden="true"></i> {{ t('settings.fontSize') }}</h3>
            <div class="font-size-control">
              <button @click="setFontSize(settings.fontSize - 1)" class="size-btn" :disabled="settings.fontSize <= 12">
                <i class="fas fa-minus" aria-hidden="true"></i>
              </button>
              <span class="size-display">{{ settings.fontSize }}px</span>
              <button @click="setFontSize(settings.fontSize + 1)" class="size-btn" :disabled="settings.fontSize >= 24">
                <i class="fas fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </section>

          <!-- アニメーション設定 -->
          <section class="setting-section">
            <h3><i class="fas fa-running" aria-hidden="true"></i> {{ t('settings.motion') }}</h3>
            <label class="toggle-label">
              <input 
                type="checkbox" 
                :checked="settings.reducedMotion"
                @change="handleToggleMotion"
                class="toggle-input"
              />
              <span class="toggle-switch"></span>
              <span class="toggle-text">{{ t('settings.reduceMotion') }}</span>
            </label>
          </section>

          <!-- リセット -->
          <section class="setting-section">
            <button @click="handleReset" class="reset-btn">
              <i class="fas fa-undo" aria-hidden="true"></i> {{ t('settings.reset') }}
            </button>
          </section>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Theme } from '~/composables/useSettings'

type ThemeOption = {
  id: Theme
  icon: string
  swatch: string
  textColor: string
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { t, locale, setLocale } = useLocale()
const { settings, currentTheme, setTheme, setFontSize, setLanguage, toggleReducedMotion, resetSettings } = useSettings()

const themeOptions: ThemeOption[] = [
  { id: 'system', icon: 'fa-desktop', swatch: 'linear-gradient(135deg, #0d0d1a, #f5f0e8)', textColor: '#f5f5f5' },
  { id: 'luxury', icon: 'fa-gem', swatch: 'linear-gradient(135deg, #3c2f2f, #c7a860)', textColor: '#f7eddc' },
  { id: 'light', icon: 'fa-sun', swatch: 'linear-gradient(135deg, #f5f0e8, #ffffff)', textColor: '#2a1f1a' },
  { id: 'dark', icon: 'fa-moon', swatch: 'linear-gradient(135deg, #0d0d1a, #7b68ee)', textColor: '#f3f1ff' },
  { id: 'modern', icon: 'fa-shapes', swatch: 'linear-gradient(135deg, #1a1a2e, #4ecdc4)', textColor: '#e9fcfb' },
  { id: 'cyber', icon: 'fa-microchip', swatch: 'linear-gradient(135deg, #0a0e27, #ff00ff)', textColor: '#b8ffe0' },
  { id: 'forest', icon: 'fa-tree', swatch: 'linear-gradient(135deg, #1b3a2e, #52b788)', textColor: '#e8f5e9' },
  { id: 'sunset', icon: 'fa-cloud-sun', swatch: 'linear-gradient(135deg, #2d1b1b, #ff6b6b)', textColor: '#fff3e0' },
  { id: 'lavender', icon: 'fa-feather', swatch: 'linear-gradient(135deg, #2d1b3d, #9d4edd)', textColor: '#f3e5ff' },
  { id: 'ocean', icon: 'fa-water', swatch: 'linear-gradient(135deg, #0b1f2a, #2b9fff)', textColor: '#e3f6ff' },
  { id: 'aurora', icon: 'fa-magic', swatch: 'linear-gradient(135deg, #0b1220, #b388ff)', textColor: '#eaf8ff' },
  { id: 'blush', icon: 'fa-heart', swatch: 'linear-gradient(135deg, #2b1a1f, #ff7d9c)', textColor: '#ffeef3' },
  { id: 'mint', icon: 'fa-leaf', swatch: 'linear-gradient(135deg, #14241c, #7df0c3)', textColor: '#eafff7' },
  { id: 'midnight', icon: 'fa-star', swatch: 'linear-gradient(135deg, #0a0a14, #5dade2)', textColor: '#e6edff' },
  { id: 'sunrise', icon: 'fa-sun', swatch: 'linear-gradient(135deg, #2e1c16, #ff9f43)', textColor: '#fff3e5' },
  { id: 'ember', icon: 'fa-fire', swatch: 'linear-gradient(135deg, #1c0f0b, #ff6f3c)', textColor: '#ffe6d8' },
  { id: 'sakura', icon: 'fa-seedling', swatch: 'linear-gradient(135deg, #241219, #ff8fb1)', textColor: '#fff4f8' },
  { id: 'lagoon', icon: 'fa-anchor', swatch: 'linear-gradient(135deg, #0b1d24, #3ed6c6)', textColor: '#e5fffb' },
  { id: 'golden', icon: 'fa-crown', swatch: 'linear-gradient(135deg, #2f240d, #d4a017)', textColor: '#fff7d6' }
]

const primaryThemeIds: Theme[] = ['system', 'light', 'dark']
const primaryThemes = computed(() => themeOptions.filter(theme => primaryThemeIds.includes(theme.id)))
const extraThemes = computed(() => themeOptions.filter(theme => !primaryThemeIds.includes(theme.id)))
const showMoreThemes = ref(false)

const close = () => {
  emit('update:modelValue', false)
}

const handleReset = () => {
  if (confirm(t('settings.confirmReset'))) {
    resetSettings()
  }
}

const changeLanguage = (lang: 'ja' | 'en') => {
  setLocale(lang)
  setLanguage(lang)
}

const handleToggleMotion = () => {
  toggleReducedMotion()
}

const getThemeLabel = (theme: Theme) => {
  const themeKey = `settings.themes.${theme}`
  return t(themeKey)
}

const toggleThemeList = () => {
  showMoreThemes.value = !showMoreThemes.value
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--color-rgb-main), 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.modal-container {
  background: linear-gradient(180deg, rgba(var(--color-rgb-main), 0.98) 0%, rgba(var(--color-rgb-main), 0.95) 100%);
  border: 1px solid var(--color-accent);
  opacity: 0.9;
  border-radius: 16px;
  box-shadow: var(--shadow-strong);
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  margin: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-accent);
  opacity: 0.85;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
  border-radius: 50%;
}

.close-btn:hover {
  background: rgba(var(--color-rgb-accent), 0.2);
  color: var(--color-accent);
}

.modal-body {
  padding: 2rem;
}

.setting-section {
  margin-bottom: 2rem;
}

.setting-section:last-child {
  margin-bottom: 0;
}

.setting-section h3 {
  font-size: 1.1rem;
  color: var(--color-text);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting-section h3 i {
  color: var(--color-accent);
}

.theme-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.theme-options.extra {
  margin-top: 0.75rem;
}

.theme-toggle {
  margin: 0.75rem 0 0.25rem;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(var(--color-rgb-main), 0.4);
  color: var(--color-text);
  border: 1px solid var(--color-accent);
  border-radius: 10px;
  padding: 0.65rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: rgba(var(--color-rgb-accent), 0.15);
  box-shadow: 0 4px 14px rgba(var(--color-rgb-accent), 0.2);
}

.theme-btn {
  background: rgba(var(--color-rgb-main), 0.5);
  border: 2px solid var(--color-accent);
  opacity: 0.8;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
}

.theme-btn:hover {
  border-color: var(--color-accent);
  background: rgba(var(--color-rgb-accent), 0.1);
  opacity: 0.9;
}

.theme-btn.active {
  border-color: var(--color-accent);
  background: rgba(var(--color-rgb-accent), 0.2);
  opacity: 1;
  box-shadow: 0 0 20px rgba(var(--color-rgb-accent), 0.3);
}

.theme-btn i {
  font-size: 1.5rem;
}

.hint {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-duration) ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.language-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.lang-btn {
  background: rgba(var(--color-rgb-main), 0.5);
  border: 2px solid var(--color-accent);
  opacity: 0.8;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text);
  font-size: 1.1rem;
  font-weight: 600;
}

.lang-btn:hover {
  border-color: var(--color-accent);
  background: rgba(var(--color-rgb-accent), 0.1);
  opacity: 0.9;
}

.lang-btn.active {
  border-color: var(--color-accent);
  background: rgba(var(--color-rgb-accent), 0.2);
  opacity: 1;
  box-shadow: 0 0 20px rgba(var(--color-rgb-accent), 0.3);
}

.font-size-control {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.size-btn {
  background: rgba(var(--color-rgb-accent), 0.2);
  border: 1px solid var(--color-accent);
  opacity: 0.85;
  color: var(--color-text);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-btn:hover:not(:disabled) {
  background: rgba(var(--color-rgb-accent), 0.3);
  border-color: var(--color-accent);
  opacity: 1;
}

.size-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.size-display {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
  min-width: 60px;
  text-align: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.toggle-input {
  display: none;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 26px;
  background: rgba(var(--color-rgb-main), 0.8);
  border-radius: 13px;
  border: 2px solid var(--color-accent);
  opacity: 0.85;
  transition: all 0.3s ease;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: var(--color-text);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle-input:checked + .toggle-switch {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.toggle-input:checked + .toggle-switch::after {
  left: 26px;
}

.toggle-text {
  color: var(--color-text);
  font-size: 1rem;
}

.reset-btn {
  background: rgba(220, 80, 80, 0.2);
  border: 1px solid rgba(220, 80, 80, 0.4);
  color: #ff9999;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  width: 100%;
}

.reset-btn:hover {
  background: rgba(220, 80, 80, 0.3);
  border-color: #ff9999;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
}

@media (max-width: 640px) {
  .theme-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .language-options {
    grid-template-columns: 1fr;
  }
  
  .modal-container {
    margin: 0;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .modal-overlay {
    padding: 0;
  }
}
</style>

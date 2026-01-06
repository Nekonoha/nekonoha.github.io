import { ref, watch, onMounted } from 'vue'

export type Theme =
  | 'luxury'
  | 'light'
  | 'dark'
  | 'modern'
  | 'cyber'
  | 'forest'
  | 'sunset'
  | 'lavender'
  | 'ocean'
  | 'aurora'
  | 'blush'
  | 'mint'
  | 'midnight'
  | 'sunrise'
  | 'ember'
  | 'sakura'
  | 'lagoon'
  | 'golden'
  | 'system'

interface Settings {
  theme: Theme
  reducedMotion: boolean
  fontSize: number
  language: 'ja' | 'en'
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  reducedMotion: false,
  fontSize: 16,
  language: 'ja'
}

const settings = ref<Settings>({ ...DEFAULT_SETTINGS })
const currentTheme = ref<Theme>('luxury')

export const useSettings = () => {
  // ローカルストレージから設定を読み込み
  const loadSettings = () => {
    if (typeof window === 'undefined') return
    
    const saved = localStorage.getItem('site-settings')
    if (saved) {
      try {
        settings.value = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
    
    applyTheme()
    applyFontSize()
    applyMotionPreference()
  }

  // 設定を保存
  const saveSettings = () => {
    if (typeof window === 'undefined') return
    localStorage.setItem('site-settings', JSON.stringify(settings.value))
  }

  // テーマを適用
  const applyTheme = () => {
    if (typeof window === 'undefined') return
    
    let targetTheme: Theme = 'luxury'
    
    if (settings.value.theme === 'system') {
      targetTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      targetTheme = settings.value.theme
    }
    
    currentTheme.value = targetTheme
    document.documentElement.setAttribute('data-theme', targetTheme)
  }

  // フォントサイズを適用
  const applyFontSize = () => {
    if (typeof window === 'undefined') return
    document.documentElement.style.fontSize = `${settings.value.fontSize}px`
  }

  // モーション設定を適用
  const applyMotionPreference = () => {
    if (typeof window === 'undefined') return
    document.documentElement.setAttribute(
      'data-reduced-motion',
      settings.value.reducedMotion ? 'true' : 'false'
    )
    
    // CSS変数を使ってアニメーション時間を制御
    if (settings.value.reducedMotion) {
      document.documentElement.style.setProperty('--transition-duration', '0.01ms')
      document.documentElement.style.setProperty('--animation-duration', '0.01ms')
    } else {
      document.documentElement.style.setProperty('--transition-duration', '0.3s')
      document.documentElement.style.setProperty('--animation-duration', '0.6s')
    }
  }

  // 言語変更
  const setLanguage = (lang: 'ja' | 'en') => {
    settings.value.language = lang
    saveSettings()
  }

  // テーマ変更
  const setTheme = (theme: Theme) => {
    settings.value.theme = theme
    applyTheme()
    saveSettings()
  }

  // フォントサイズ変更
  const setFontSize = (size: number) => {
    settings.value.fontSize = Math.max(12, Math.min(24, size))
    applyFontSize()
    saveSettings()
  }

  // モーション削減切り替え
  const toggleReducedMotion = () => {
    settings.value.reducedMotion = !settings.value.reducedMotion
    applyMotionPreference()
    saveSettings()
  }

  // 設定リセット
  const resetSettings = () => {
    settings.value = { ...DEFAULT_SETTINGS }
    applyTheme()
    applyFontSize()
    applyMotionPreference()
    saveSettings()
  }

  // システムテーマ変更を監視
  onMounted(() => {
    loadSettings()
    
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (settings.value.theme === 'system') {
          applyTheme()
        }
      })
    }
  })

  return {
    settings,
    currentTheme,
    setLanguage,
    setTheme,
    setFontSize,
    toggleReducedMotion,
    resetSettings,
    loadSettings
  }
}

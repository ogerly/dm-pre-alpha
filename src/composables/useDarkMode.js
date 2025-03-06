import { ref, onMounted, watch } from 'vue'

/**
 * Dark mode implementation that integrates with Tailwind CSS and Inspira UI
 * Uses class strategy (adds .dark to html element) for compatibility
 */
export function useDarkMode() {
  const isDark = ref(false)
  const htmlElement = typeof document !== 'undefined' ? document.documentElement : null

  // Initial setup
  onMounted(() => {
    // Check localStorage first
    const storedTheme = localStorage.getItem('color-theme')
    
    if (storedTheme === 'dark' || 
       (storedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDark.value = true
    } else {
      isDark.value = false
    }
    
    // Apply initial theme
    applyTheme()
  })

  // Watch for changes and apply
  watch(isDark, () => {
    applyTheme()
    savePreference()
  })

  // Apply the current theme to the document
  function applyTheme() {
    if (!htmlElement) return
    
    if (isDark.value) {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }

  // Save user preference to localStorage
  function savePreference() {
    localStorage.setItem('color-theme', isDark.value ? 'dark' : 'light')
  }

  // Toggle between light and dark mode
  function toggleDarkMode() {
    isDark.value = !isDark.value
  }

  // Set a specific mode
  function setDarkMode(value) {
    isDark.value = Boolean(value)
  }
  
  return {
    isDark,
    toggleDarkMode, 
    setDarkMode
  }
}

/**
 * Create a global singleton instance for app-wide dark mode state
 */
export const darkModeGlobal = useDarkMode()

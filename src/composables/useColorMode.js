import { ref, watch } from 'vue'

/**
 * Simple color mode implementation (light/dark)
 * @param {Object} options - Configuration options
 * @param {string} [options.initialValue='light'] - Initial color mode
 * @param {string} [options.storageKey='color-mode'] - LocalStorage key to persist the mode
 * @returns {Object} The color mode controls
 */
export function useColorMode(options = {}) {
  const {
    initialValue = 'light',
    storageKey = 'color-mode'
  } = options
  
  // Try to get stored value, otherwise use initial value
  const getStoredValue = () => {
    if (typeof window === 'undefined') return initialValue
    try {
      const storedValue = localStorage.getItem(storageKey)
      return storedValue || initialValue
    } catch (e) {
      console.warn('Error reading from localStorage', e)
      return initialValue
    }
  }
  
  // Create a reactive ref with the initial value
  const mode = ref(getStoredValue())
  
  // Update document with the current mode
  const applyMode = (newMode) => {
    if (typeof window === 'undefined') return
    
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Store in localStorage
    try {
      localStorage.setItem(storageKey, newMode)
    } catch (e) {
      console.warn('Error writing to localStorage', e)
    }
  }
  
  // Toggle between light/dark
  const toggleMode = () => {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
  }
  
  // Set to specific mode
  const setMode = (newMode) => {
    if (newMode === 'light' || newMode === 'dark') {
      mode.value = newMode
    }
  }
  
  // Apply changes when mode changes
  watch(mode, (newMode) => {
    applyMode(newMode)
  }, { immediate: true })
  
  // Automatically detect system preference
  const detectSystemPreference = () => {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (mediaQuery.matches) {
        setMode('dark')
      } else {
        setMode('light')
      }
    }
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)
    
    // Initial check
    handleChange()
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange)
  }
  
  return {
    mode,
    value: mode,
    toggleMode,
    setMode,
    detectSystemPreference
  }
}

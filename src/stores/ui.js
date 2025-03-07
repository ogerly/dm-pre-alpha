import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import errorLogger from '@/services/errorLogger'

export const useUIStore = defineStore('ui', () => {
  // UI state
  const isChatOpen = ref(false)
  const isHelpOpen = ref(false)
  const isDebugOpen = ref(false)
  const activeTab = ref('home')
  const sidebarExpanded = ref(true)
  const darkMode = ref(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  
  // Computed properties
  const isOverlayOpen = computed(() => isChatOpen.value || isHelpOpen.value)
  
  // Actions
  function setActiveTab(tab) {
    activeTab.value = tab
  }
  
  function toggleSidebar() {
    sidebarExpanded.value = !sidebarExpanded.value
  }
  
  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    localStorage.setItem('darkMode', darkMode.value)
    
    // Apply dark mode to document
    if (darkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    errorLogger.debug('Dark mode toggled', { enabled: darkMode.value })
  }
  
  // Chat overlay
  function toggleChat() {
    isChatOpen.value = !isChatOpen.value
    
    // Close other overlays
    if (isChatOpen.value) {
      isHelpOpen.value = false
      isDebugOpen.value = false
    }
    
    errorLogger.debug('Chat toggled', { open: isChatOpen.value })
  }
  
  function closeChat() {
    isChatOpen.value = false
  }
  
  // Help overlay
  function toggleHelp() {
    isHelpOpen.value = !isHelpOpen.value
    
    // Close other overlays
    if (isHelpOpen.value) {
      isChatOpen.value = false
      isDebugOpen.value = false
    }
    
    errorLogger.debug('Help toggled', { open: isHelpOpen.value })
  }
  
  function closeHelp() {
    isHelpOpen.value = false
  }
  
  // Debug overlay
  function toggleDebug() {
    isDebugOpen.value = !isDebugOpen.value
    
    // Close other overlays
    if (isDebugOpen.value) {
      isChatOpen.value = false
      isHelpOpen.value = false
    }
    
    errorLogger.debug('Debug toggled', { open: isDebugOpen.value })
  }
  
  function closeDebug() {
    isDebugOpen.value = false
  }
  
  // Initialize dark mode on store creation
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
  }
  
  return {
    // State
    isChatOpen,
    isHelpOpen,
    isDebugOpen,
    activeTab,
    sidebarExpanded,
    darkMode,
    
    // Computed
    isOverlayOpen,
    
    // Actions
    setActiveTab,
    toggleSidebar,
    toggleDarkMode,
    toggleChat,
    closeChat,
    toggleHelp,
    closeHelp,
    toggleDebug,
    closeDebug
  }
})

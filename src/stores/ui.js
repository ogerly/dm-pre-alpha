import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    activeTab: 'home', // Default tab
    isChatOpen: false,
    theme: 'light'
  }),

  actions: {
    setActiveTab(tab) {
      this.activeTab = tab
    },
    
    toggleChat() {
      this.isChatOpen = !this.isChatOpen
    },
    
    setTheme(theme) {
      this.theme = theme
    }
  }
})

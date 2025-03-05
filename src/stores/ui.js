import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    activeTab: 'matching', // Default tab
    showChat: false,
    chatWithUserId: null,
    darkMode: false,
    modalOpen: false,
    modalContent: null,
  }),

  actions: {
    setActiveTab(tab) {
      this.activeTab = tab
    },
    
    toggleChat(value) {
      if (value !== undefined) {
        this.showChat = value
      } else {
        this.showChat = !this.showChat
      }
      
      if (!this.showChat) {
        this.chatWithUserId = null
      }
    },
    
    startChatWith(userId) {
      this.chatWithUserId = userId
      this.showChat = true
    },
    
    closeChat() {
      this.showChat = false
      this.chatWithUserId = null
    },
    
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      
      // Apply dark mode class to document
      if (this.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      // Save preference to localStorage
      localStorage.setItem('darkMode', this.darkMode ? 'enabled' : 'disabled')
    },
    
    initializeDarkMode() {
      // Check localStorage or system preference
      const savedMode = localStorage.getItem('darkMode')
      
      if (savedMode === 'enabled') {
        this.darkMode = true
        document.documentElement.classList.add('dark')
      } else if (savedMode === 'disabled') {
        this.darkMode = false
      } else {
        // Check system preference if no saved preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.darkMode = prefersDark
        
        if (prefersDark) {
          document.documentElement.classList.add('dark')
        }
      }
    }
  }
})

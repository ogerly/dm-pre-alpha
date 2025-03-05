import { reactive } from 'vue'

// Log levels
export const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

// Map string level from .env to numeric level
const getLevelValue = (levelString) => {
  const levels = {
    'debug': LOG_LEVEL.DEBUG,
    'info': LOG_LEVEL.INFO,
    'warn': LOG_LEVEL.WARN,
    'error': LOG_LEVEL.ERROR
  }
  return levels[levelString.toLowerCase()] || LOG_LEVEL.DEBUG
}

// Get config from environment variables
const isEnabled = import.meta.env.VITE_ERROR_CONSOLE_ENABLED === 'true'
const configLevel = getLevelValue(import.meta.env.VITE_ERROR_CONSOLE_LEVEL || 'debug')

// Reactive state for logs
const state = reactive({
  logs: [],
  isVisible: import.meta.env.VITE_DEBUG === 'true' && isEnabled,
  filter: 'all'
})

const errorLogger = {
  // Log methods
  debug(message, metadata = {}) {
    this.addLog(message, LOG_LEVEL.DEBUG, metadata)
  },
  
  info(message, metadata = {}) {
    this.addLog(message, LOG_LEVEL.INFO, metadata)
  },
  
  warn(message, metadata = {}) {
    this.addLog(message, LOG_LEVEL.WARN, metadata)
  },
  
  error(message, error = null, metadata = {}) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      ...error
    } : null
    
    this.addLog(message, LOG_LEVEL.ERROR, { ...metadata, error: errorData })
  },
  
  // Add log entry if enabled and level is appropriate
  addLog(message, level, metadata = {}) {
    // Only log if console is enabled and level is high enough
    if (isEnabled && level >= configLevel) {
      const timestamp = new Date()
      
      // Create log entry
      const log = {
        id: Date.now() + Math.random().toString(36).substr(2, 5),
        timestamp,
        formattedTime: timestamp.toLocaleTimeString(),
        message,
        level,
        levelName: Object.keys(LOG_LEVEL).find(key => LOG_LEVEL[key] === level),
        metadata: metadata
      }
      
      // Add to state
      state.logs.unshift(log)
      
      // Also output to browser console
      const consoleMethod = level === LOG_LEVEL.ERROR ? 'error' : 
                           level === LOG_LEVEL.WARN ? 'warn' :
                           level === LOG_LEVEL.INFO ? 'info' : 'log'
      
      console[consoleMethod](`[${log.levelName}] ${message}`, metadata)
    }
  },
  
  // Component lifecycle tracking
  trackComponentMount(componentName) {
    this.debug(`Component mounted: ${componentName}`, { type: 'component', lifecycle: 'mount' })
  },
  
  trackComponentUnmount(componentName) {
    this.debug(`Component unmounted: ${componentName}`, { type: 'component', lifecycle: 'unmount' })
  },
  
  trackViewLoad(viewName) {
    this.info(`View loaded: ${viewName}`, { type: 'view', lifecycle: 'load' })
  },
  
  // Clear logs
  clear() {
    state.logs = []
  },
  
  // Toggle visibility
  toggleVisibility() {
    state.isVisible = !state.isVisible
  },
  
  // Filter logs
  setFilter(filter) {
    state.filter = filter
  },
  
  // Get filtered logs
  get filteredLogs() {
    if (state.filter === 'all') {
      return state.logs
    }
    
    const filterLevel = getLevelValue(state.filter)
    return state.logs.filter(log => log.level === filterLevel)
  },
  
  // State access
  get logs() {
    return state.logs
  },
  
  get isVisible() {
    return state.isVisible
  },
  
  get filter() {
    return state.filter
  }
}

// Export singleton
export default errorLogger

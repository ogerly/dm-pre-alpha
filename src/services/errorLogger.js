/* eslint-disable no-console */
// Add eslint-disable for console statements at the top of the file

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
  return levels[levelString?.toLowerCase()] || LOG_LEVEL.DEBUG
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

/**
 * Enhanced error logger with console handling for development/production
 */
class ErrorLogger {
  constructor() {
    this.maxLogs = 100;
    this.filteredLogs = [];
  }

  /**
   * Log debug message (only visible in development)
   */
  debug(message, metadata = {}) {
    this._addLog('DEBUG', message, metadata);
    if (import.meta.env.DEV) {
      console.debug(`[DEBUG] ${message}`, metadata);
    }
  }

  /**
   * Log info message
   */
  info(message, metadata = {}) {
    this._addLog('INFO', message, metadata);
    if (import.meta.env.DEV) {
      console.info(`[INFO] ${message}`, metadata);
    }
  }

  /**
   * Log warning message
   */
  warn(message, metadata = {}) {
    this._addLog('WARN', message, metadata);
    if (import.meta.env.DEV) {
      console.warn(`[WARN] ${message}`, metadata);
    }
  }

  /**
   * Log error message (always logged to console in both dev and prod)
   */
  error(message, error = null) {
    const metadata = { error };
    this._addLog('ERROR', message, metadata);
    // Errors are important enough to always log
    console.error(`[ERROR] ${message}`, error);
  }

  // Add log entry if enabled and level is appropriate
  _addLog(level, message, metadata = {}) {
    // Only log if console is enabled and level is high enough
    if (isEnabled && getLevelValue(level.toLowerCase()) >= configLevel) {
      const timestamp = new Date()
      
      // Create log entry
      const log = {
        id: Date.now() + Math.random().toString(36).substr(2, 5),
        timestamp,
        formattedTime: timestamp.toLocaleTimeString(),
        message,
        level,
        levelName: level,
        metadata: metadata
      }
      
      // Add to state
      state.logs.unshift(log)
      
      // Keep logs at a reasonable size
      if (state.logs.length > this.maxLogs) {
        state.logs.pop()
      }
    }
  }

  // Component lifecycle tracking
  trackComponentMount(componentName) {
    this.debug(`Component mounted: ${componentName}`, { type: 'component', lifecycle: 'mount' })
  }
  
  trackComponentUnmount(componentName) {
    this.debug(`Component unmounted: ${componentName}`, { type: 'component', lifecycle: 'unmount' })
  }
  
  trackViewLoad(viewName) {
    this.info(`View loaded: ${viewName}`, { type: 'view', lifecycle: 'load' })
  }
  
  // Clear logs
  clear() {
    state.logs = []
  }
  
  // Toggle visibility
  toggleVisibility() {
    state.isVisible = !state.isVisible
  }
  
  // Filter logs
  setFilter(filter) {
    state.filter = filter
  }
  
  // Get filtered logs
  get filteredLogs() {
    if (state.filter === 'all') {
      return state.logs
    }
    
    const filterLevel = getLevelValue(state.filter)
    return state.logs.filter(log => log.level === filterLevel)
  }
  
  // State access
  get logs() {
    return state.logs
  }
  
  get isVisible() {
    return state.isVisible
  }
  
  get filter() {
    return state.filter
  }
}

// Export singleton
export default new ErrorLogger()

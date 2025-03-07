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
 * Error logging service for the application
 * Provides methods to log errors, warnings, info and debug messages
 * Also provides a filtering mechanism to only show certain log levels
 */

// Log levels in order of severity
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// Default log level from environment or default to INFO
const defaultLevel = (
  import.meta.env.VITE_ERROR_CONSOLE_LEVEL?.toUpperCase() || 'INFO'
);

class ErrorLogger {
  constructor() {
    // Initialize private properties
    this._logs = [];
    this._level = LOG_LEVELS[defaultLevel] || LOG_LEVELS.INFO;
    this._filterText = '';
    this._enabled = import.meta.env.DEV || 
      import.meta.env.VITE_ERROR_CONSOLE_ENABLED === 'true';
    
    // Track metrics for logging
    this._metrics = {
      errors: 0,
      warnings: 0,
      info: 0,
      debug: 0,
      viewLoads: {}
    };
    
    // Instead of setting filteredLogs directly, we'll use a getter
    // and compute it when needed
  }
  
  // Getter for filteredLogs that computes on-demand
  get filteredLogs() {
    if (!this._filterText) {
      return this._logs.filter(log => log.level >= this._level);
    }
    
    const filter = this._filterText.toLowerCase();
    return this._logs.filter(log => 
      log.level >= this._level && 
      (log.message.toLowerCase().includes(filter) || 
       JSON.stringify(log.data).toLowerCase().includes(filter))
    );
  }
  
  // Log level setter and getter
  setLevel(level) {
    if (typeof level === 'string') {
      this._level = LOG_LEVELS[level.toUpperCase()] || this._level;
    } else if (typeof level === 'number' && level >= 0 && level <= 3) {
      this._level = level;
    }
    return this;
  }
  
  getLevel() {
    return Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === this._level) || 'INFO';
  }
  
  // Filter text setter and getter
  setFilter(text) {
    this._filterText = text || '';
    return this;
  }
  
  getFilter() {
    return this._filterText;
  }
  
  // Enable/disable the logger
  enable(value = true) {
    this._enabled = !!value;
    return this;
  }
  
  isEnabled() {
    return this._enabled;
  }
  
  // Clear all logs
  clear() {
    this._logs = [];
    return this;
  }
  
  // Core logging method - all other methods call this
  _log(level, message, data = {}, timestamp = new Date()) {
    if (!this._enabled) return this;
    
    // Add the log entry
    this._logs.push({
      level,
      message: String(message),
      data,
      timestamp,
      id: Math.random().toString(36).substring(2, 10) // Simple unique ID
    });
    
    // Keep logs under a reasonable limit
    if (this._logs.length > 1000) {
      this._logs.shift();
    }
    
    // Update metrics
    this._updateMetrics(level);
    
    // Also log to console in development
    if (import.meta.env.DEV || this._enabled) {
      this._logToConsole(level, message, data);
    }
    
    return this;
  }
  
  // Helper method to update metrics
  _updateMetrics(level) {
    if (level === LOG_LEVELS.ERROR) this._metrics.errors++;
    else if (level === LOG_LEVELS.WARN) this._metrics.warnings++;
    else if (level === LOG_LEVELS.INFO) this._metrics.info++;
    else if (level === LOG_LEVELS.DEBUG) this._metrics.debug++;
  }
  
  // Helper method for console output
  _logToConsole(level, message, data) {
    const consoleMethod = 
      level === LOG_LEVELS.ERROR ? 'error' :
      level === LOG_LEVELS.WARN ? 'warn' :
      level === LOG_LEVELS.INFO ? 'info' : 'log';
    
    console[consoleMethod](`[${this.getLevel()}] ${message}`, data);
  }
  
  // Public logging methods
  debug(message, data) {
    return this._log(LOG_LEVELS.DEBUG, message, data);
  }
  
  info(message, data) {
    return this._log(LOG_LEVELS.INFO, message, data);
  }
  
  warn(message, data) {
    return this._log(LOG_LEVELS.WARN, message, data);
  }
  
  error(message, error, data = {}) {
    // If second param is an Error object, extract info
    let errorData = data;
    if (error instanceof Error) {
      errorData = {
        ...data,
        errorMessage: error.message,
        stack: error.stack,
        name: error.name
      };
    } else if (error && typeof error === 'object') {
      errorData = { ...errorData, ...error };
    }
    
    return this._log(LOG_LEVELS.ERROR, message, errorData);
  }
  
  // View tracking
  trackViewLoad(viewName) {
    if (!viewName) return this;
    
    // Track view loads
    this._metrics.viewLoads[viewName] = (this._metrics.viewLoads[viewName] || 0) + 1;
    
    return this.debug(`View loaded: ${viewName}`, { 
      count: this._metrics.viewLoads[viewName] 
    });
  }
  
  // Get metrics
  getMetrics() {
    return { ...this._metrics };
  }
  
  // Get all logs (for export)
  getLogs() {
    return [...this._logs];
  }
}

// Create and export singleton instance
const errorLogger = new ErrorLogger();
export default errorLogger;

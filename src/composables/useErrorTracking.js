import { onMounted, onUnmounted } from 'vue'
import errorLogger from '@/services/errorLogger'

/**
 * Composable for tracking component lifecycle and errors
 * @param {string} componentName - The name of the component
 * @returns {Object} - Error tracking methods
 */
export function useErrorTracking(componentName) {
  onMounted(() => {
    errorLogger.trackComponentMount(componentName)
  })
  
  onUnmounted(() => {
    errorLogger.trackComponentUnmount(componentName)
  })
  
  // Helper function to wrap async functions with error logging
  const trackAsyncOperation = async (operationName, asyncFn) => {
    try {
      errorLogger.debug(`${componentName}: Starting ${operationName}`)
      const result = await asyncFn()
      errorLogger.debug(`${componentName}: Completed ${operationName}`)
      return result
    } catch (error) {
      errorLogger.error(`${componentName}: Failed ${operationName}`, error)
      throw error
    }
  }
  
  return {
    errorLogger,
    trackAsyncOperation
  }
}

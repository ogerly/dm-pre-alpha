import { ref, onMounted, onUnmounted } from 'vue'
import errorLogger from '@/services/errorLogger'

/**
 * Composable to provide error tracking functionality for components
 * Enhanced with chat-specific tracking capabilities
 * @param {string} componentName - Name of the component using this composable
 * @returns {Object} Error tracking methods
 */
export function useErrorTracking(componentName) {
  const isLoading = ref(false)
  const hasError = ref(false)
  const errorMessage = ref('')

  // Customize logger for this component
  const logger = {
    debug: (message, data) => errorLogger.debug(message, { component: componentName, ...data }),
    info: (message, data) => errorLogger.info(message, { component: componentName, ...data }),
    warn: (message, data) => errorLogger.warn(message, { component: componentName, ...data }),
    error: (message, error, data) => errorLogger.error(message, error, { component: componentName, ...data })
  }

  onMounted(() => {
    errorLogger.trackComponentMount(componentName)
  })
  
  onUnmounted(() => {
    errorLogger.trackComponentUnmount(componentName)
  })

  /**
   * Track an asynchronous operation and handle errors
   * @param {string} operationName - Name of the operation for logging
   * @param {Function} operation - The async function to execute
   * @returns {Promise<any>} Result of the operation
   */
  const trackAsyncOperation = async (operationName, operation) => {
    isLoading.value = true
    hasError.value = false
    errorMessage.value = ''
    
    try {
      logger.debug(`Starting operation: ${operationName}`)
      const result = await operation()
      logger.debug(`Successfully completed: ${operationName}`)
      return result
    } catch (error) {
      hasError.value = true
      errorMessage.value = error.message || 'An error occurred'
      logger.error(`Operation failed: ${operationName}`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // CHAT-SPECIFIC TRACKING FUNCTIONS
  
  /**
   * Track chat connection events
   * @param {string} status - Connection status (connected/disconnected)
   * @param {string} socketId - Socket ID if connected
   * @param {Object} metadata - Additional data about the connection
   */
  const trackChatConnection = (status, socketId = null, metadata = {}) => {
    if (status === 'connected') {
      logger.info(`Chat connected with socket ID: ${socketId}`, {
        category: 'chat-connection',
        socketId,
        ...metadata
      })
    } else {
      logger.warn(`Chat disconnected`, {
        category: 'chat-connection',
        lastSocketId: socketId,
        ...metadata
      })
    }
  }

  /**
   * Track chat message events
   * @param {string} type - Message type (sent/received)
   * @param {Object} message - Message data
   * @param {boolean} success - Whether the operation succeeded
   */
  const trackChatMessage = (type, message, success = true) => {
    const action = type === 'sent' ? 'Sent message' : 'Received message';
    
    if (success) {
      logger.debug(`${action}`, {
        category: 'chat-message',
        type,
        messageId: message.id || 'unknown',
        timestamp: message.timestamp || new Date().toISOString(),
        recipientId: message.to || 'all',
        senderId: message.from || 'unknown'
      })
    } else {
      logger.warn(`Failed to ${type} message`, {
        category: 'chat-message',
        type,
        message,
        error: 'Message could not be processed'
      })
    }
  }

  /**
   * Track WebRTC signaling events
   * @param {string} type - Signal type (offer/answer/ice-candidate)
   * @param {string} peerId - ID of the peer involved
   * @param {Object} metadata - Additional data
   */
  const trackSignaling = (type, peerId, metadata = {}) => {
    logger.debug(`WebRTC signaling: ${type}`, {
      category: 'webrtc',
      type,
      peerId,
      ...metadata
    })
  }

  /**
   * Track chat room events
   * @param {string} event - Event type (join/leave/update)
   * @param {string} roomId - ID of the room
   * @param {Object} metadata - Additional data
   */
  const trackRoomEvent = (event, roomId, metadata = {}) => {
    logger.info(`Room ${event}: ${roomId}`, {
      category: 'chat-room',
      event,
      roomId,
      ...metadata
    })
  }
  
  /**
   * Track chat-related errors with enhanced context
   * @param {string} context - Context of the error (connection/message/signaling)
   * @param {Error} error - Error object
   * @param {Object} metadata - Additional data
   */
  const trackChatError = (context, error, metadata = {}) => {
    logger.error(`Chat error in ${context}`, error, {
      category: 'chat-error',
      context,
      ...metadata
    })
    
    hasError.value = true
    errorMessage.value = error.message || `Error in chat ${context}`
  }

  /**
   * Track chat user status changes
   * @param {string} userId - User ID
   * @param {string} status - New status
   */
  const trackUserStatus = (userId, status) => {
    logger.debug(`User ${userId} is now ${status}`, {
      category: 'chat-user-status',
      userId,
      status
    })
  }

  return {
    isLoading,
    hasError,
    errorMessage,
    errorLogger: logger,
    trackAsyncOperation,
    // Chat-specific trackers
    trackChatConnection,
    trackChatMessage,
    trackSignaling,
    trackRoomEvent,
    trackChatError,
    trackUserStatus
  }
}

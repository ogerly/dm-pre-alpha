import { io } from 'socket.io-client';
import errorLogger from '@/services/errorLogger';

// Simple mock chat service - would be replaced with actual WebSocket/Socket.IO implementation
const STORAGE_KEY = 'dreammall_chats';

// Initialize chats in localStorage
function initializeChats() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
  }
}

// Get chats for a specific conversation
export function getMessages(conversationId) {
  initializeChats();
  const chats = JSON.parse(localStorage.getItem(STORAGE_KEY));
  return chats[conversationId] || [];
}

// Send a new message
export function sendMessage(conversationId, message) {
  initializeChats();
  const chats = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
  if (!chats[conversationId]) {
    chats[conversationId] = [];
  }
  
  // Add timestamp and ID to the message
  const newMessage = {
    ...message,
    id: Date.now(),
    timestamp: new Date().toISOString()
  };
  
  chats[conversationId].push(newMessage);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  
  return newMessage;
}

// Get list of conversations for a user
export function getUserConversations(userId) {
  initializeChats();
  const chats = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
  // Filter conversations that involve this user
  const userConversations = [];
  
  for (const [convId, messages] of Object.entries(chats)) {
    if (messages.length > 0) {
      const [user1, user2] = convId.split('_');
      if (user1 == userId || user2 == userId) {
        const otherUserId = user1 == userId ? user2 : user1;
        const lastMessage = messages[messages.length - 1];
        
        userConversations.push({
          id: convId,
          otherUserId: parseInt(otherUserId),
          lastMessage,
          unread: messages.filter(m => m.senderId != userId && !m.read).length
        });
      }
    }
  }
  
  return userConversations;
}

// Mark messages as read
export function markAsRead(conversationId, userId) {
  initializeChats();
  const chats = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
  if (chats[conversationId]) {
    chats[conversationId] = chats[conversationId].map(msg => {
      if (msg.senderId != userId && !msg.read) {
        return { ...msg, read: true };
      }
      return msg;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }
}

// Helper to create a conversation ID from two user IDs
export function getConversationId(userId1, userId2) {
  // Ensure consistent ordering of IDs to create the same key regardless of order
  const sortedIds = [userId1, userId2].sort((a, b) => a - b);
  return `${sortedIds[0]}_${sortedIds[1]}`;
}

/**
 * Creates a test welcome message for new conversations
 * @param {number} userId - The ID of the user creating the conversation
 * @param {string} conversationId - The ID of the conversation
 */
export function createWelcomeMessageIfNeeded(userId, conversationId) {
  initializeChats();
  const chats = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
  // Only create welcome message if this conversation doesn't exist yet
  if (!chats[conversationId] || chats[conversationId].length === 0) {
    const welcomeMessage = {
      id: Date.now(),
      text: "Herzlich Willkommen zum Chat! Hier kannst du direkt mit deinem Match kommunizieren.",
      senderId: 0, // System message
      timestamp: new Date().toISOString(),
      read: false
    };
    
    chats[conversationId] = [welcomeMessage];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }
}

class ChatService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.socketId = null;
    this.handlers = {
      chatMessage: [],
      connected: [],
      disconnected: [],
      newUser: [],
      userDisconnected: [],
      userCount: [],
    };
  }

  connect() {
    if (this.socket) return;
    
    try {
      // Connect to localhost for development
      // The port should match the port your socket.io server is running on
      const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
      this.socket = io(serverUrl);
      
      this.socket.on('connect', () => {
        this.connected = true;
        this.socketId = this.socket.id;
        errorLogger.info(`Connected to server with ID: ${this.socketId}`);
        this._notifyHandlers('connected', { id: this.socketId });
      });

      this.socket.on('disconnect', () => {
        this.connected = false;
        errorLogger.warn('Disconnected from server');
        this._notifyHandlers('disconnected');
      });

      this.socket.on('chatMessage', (data) => {
        errorLogger.debug(`Received message: ${data.message} from ${data.id}`);
        this._notifyHandlers('chatMessage', data);
      });

      this.socket.on('newUser', (data) => {
        errorLogger.debug(`New user connected: ${data.id}`);
        this._notifyHandlers('newUser', data);
      });

      this.socket.on('userDisconnected', (data) => {
        errorLogger.debug(`User disconnected: ${data.id}`);
        this._notifyHandlers('userDisconnected', data);
      });

      this.socket.on('userCount', (count) => {
        errorLogger.debug(`User count updated: ${count}`);
        this._notifyHandlers('userCount', count);
      });

    } catch (error) {
      errorLogger.error('Error connecting to socket server', error);
      throw error;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.socketId = null;
      errorLogger.info('Manually disconnected from server');
    }
  }

  sendMessage(message) {
    if (!this.connected || !this.socket) {
      errorLogger.error('Cannot send message: not connected to server');
      return false;
    }

    try {
      this.socket.emit('chatMessage', { message });
      return true;
    } catch (error) {
      errorLogger.error('Error sending message', error);
      return false;
    }
  }

  on(event, handler) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  off(event, handler) {
    if (!this.handlers[event]) return;
    this.handlers[event] = this.handlers[event].filter(h => h !== handler);
  }

  _notifyHandlers(event, data) {
    if (!this.handlers[event]) return;
    this.handlers[event].forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        errorLogger.error(`Error in ${event} handler`, error);
      }
    });
  }

  isConnected() {
    return this.connected;
  }

  getSocketId() {
    return this.socketId;
  }
}

// Singleton instance
const chatService = new ChatService();
export default chatService;

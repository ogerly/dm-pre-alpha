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

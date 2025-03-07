<template>
  <div
    class="chat-window"
    :class="{ 'expanded': expanded }"
  >
    <div
      class="chat-header"
      @click="expanded = !expanded"
    >
      <div class="chat-title">
        <span v-if="otherUser">Chat mit {{ otherUser.name }}</span>
        <span v-else>Chat</span>
      </div>
      <div class="chat-controls">
        <button
          class="control-btn minimize-btn"
          @click.stop="expanded = !expanded"
        >
          {{ expanded ? '−' : '+' }}
        </button>
        <button
          class="control-btn close-btn"
          @click.stop="$emit('close')"
        >
          ×
        </button>
      </div>
    </div>
    
    <div
      v-show="expanded"
      class="chat-body"
    >
      <div
        ref="messagesContainer"
        class="messages-container"
      >
        <div
          v-for="message in messages"
          :key="message.id" 
          class="message" 
          :class="{ 'outgoing': message.senderId === currentUserId }"
        >
          <div class="message-content">
            {{ message.text }}
          </div>
          <div class="message-time">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
        <div
          v-if="messages.length === 0"
          class="no-messages"
        >
          Beginne deine Unterhaltung...
        </div>
      </div>
      
      <div class="message-input">
        <input 
          v-model="newMessage" 
          type="text" 
          placeholder="Nachricht eingeben..."
          :disabled="!otherUser" 
          @keyup.enter="sendMessage"
        >
        <button
          :disabled="!newMessage.trim() || !otherUser"
          @click="sendMessage"
        >
          Senden
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { sendMessage, getMessages, markAsRead, createWelcomeMessageIfNeeded } from '../../services/ChatService.js';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChatWindow',
  
  props: {
    currentUserId: {
      type: Number,
      required: true
    },
    otherUser: {
      type: Object,
      default: null
    },
    conversationId: {
      type: String,
      default: null
    }
  },
  
  emits: ['close'],
  data() {
    return {
      messages: [],
      newMessage: '',
      expanded: true
    };
  },
  watch: {
    conversationId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          // Create welcome message for first-time chats
          createWelcomeMessageIfNeeded(this.currentUserId, newVal);
          this.loadMessages();
          this.markMessagesAsRead();
        } else {
          this.messages = [];
        }
      }
    },
    messages: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    }
  },
  methods: {
    loadMessages() {
      if (this.conversationId) {
        this.messages = getMessages(this.conversationId);
      }
    },
    sendMessage() {
      if (!this.newMessage.trim() || !this.conversationId) return;
      
      const message = {
        text: this.newMessage,
        senderId: this.currentUserId,
        read: false
      };
      
      sendMessage(this.conversationId, message);
      this.loadMessages();
      this.newMessage = '';
    },
    markMessagesAsRead() {
      if (this.conversationId && this.currentUserId) {
        markAsRead(this.conversationId, this.currentUserId);
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
      }
    }
  }
});
</script>

<style scoped>
.chat-window {
  position: fixed;
  bottom: 0;
  right: 20px;
  width: 320px;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.chat-header {
  padding: 10px 15px;
  background-color: #4f46e5;
  color: white;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.chat-controls {
  display: flex;
}

.control-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  margin-left: 10px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.control-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.chat-body {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex-grow: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message {
  margin-bottom: 10px;
  max-width: 80%;
  clear: both;
}

.message.outgoing {
  align-self: flex-end;
  float: right;
}

.message-content {
  padding: 8px 12px;
  border-radius: 18px;
  background-color: #f3f4f6;
  display: inline-block;
}

.message.outgoing .message-content {
  background-color: #4f46e5;
  color: white;
}

.message-time {
  font-size: 0.7rem;
  color: #9ca3af;
  margin-top: 2px;
  text-align: right;
}

.no-messages {
  color: #9ca3af;
  text-align: center;
  margin-top: 20px;
}

.message-input {
  padding: 15px;
  border-top: 1px solid #e5e7eb;
  display: flex;
}

.message-input input {
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  margin-right: 8px;
}

.message-input button {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  cursor: pointer;
}

.message-input button:hover {
  background-color: #4338ca;
}

.message-input button:disabled {
  background-color: #c7d2fe;
  cursor: not-allowed;
}

.expanded {
  height: auto;
}

.chat-window:not(.expanded) {
  height: auto;
}
</style>

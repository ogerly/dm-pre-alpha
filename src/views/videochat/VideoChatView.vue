<template>
  <div class="video-chat-view">
    <div class="header">
      <h1>WebRTC Videochat</h1>
    </div>
    
    <VideoChat />
    
    <div class="footer">
      <p>© 2025 WebRTC Videochat App</p>
    </div>
  </div>
</template>

<script>
import VideoChat from '../components/VideoChat.vue';

export default {
  name: 'VideoChatView',
  components: {
    VideoChat
  }
}
</script>

<style>
.video-chat-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: #333;
  color: white;
  padding: 15px;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.footer {
  background-color: #333;
  color: white;
  padding: 15px;
  text-align: center;
  margin-top: auto;
}
</style>
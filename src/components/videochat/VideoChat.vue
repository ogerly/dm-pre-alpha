<template>
  <div class="video-chat-container">
    <h2>Video Chat</h2>
    
    <div
      v-if="error"
      class="error-message"
    >
      {{ error }}
    </div>
    
    <div class="status-indicator">
      Status: {{ status }}
    </div>
    
    <div class="video-streams">
      <div class="local-stream">
        <video
          ref="localVideoRef"
          autoplay
          muted
          playsinline
          class="video-element"
        />
        <div class="stream-label">
          You
        </div>
      </div>
      
      <div class="remote-stream">
        <video
          v-if="remoteStream"
          ref="remoteVideoRef"
          autoplay
          playsinline
          class="video-element"
        />
        <div
          v-else
          class="no-remote-stream"
        >
          Waiting for other person to join...
        </div>
        <div class="stream-label">
          Remote
        </div>
      </div>
    </div>
    
    <div class="video-controls">
      <button
        class="control-btn"
        :class="{ 'active': isMuted }"
        @click="toggleMute"
      >
        <i
          class="fas"
          :class="isMuted ? 'fa-microphone-slash' : 'fa-microphone'"
        />
        {{ isMuted ? 'Unmute' : 'Mute' }}
      </button>
      <button
        class="control-btn"
        :class="{ 'active': isVideoOff }"
        @click="toggleVideo"
      >
        <i
          class="fas"
          :class="isVideoOff ? 'fa-video-slash' : 'fa-video'"
        />
        {{ isVideoOff ? 'Start Video' : 'Stop Video' }}
      </button>
      <button
        class="end-call-btn"
        @click="endCall"
      >
        <i class="fas fa-phone-slash" />
        End Call
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import io from 'socket.io-client';

// Fix imports by using relative path if necessary
// import { WebRTCService } from '../../services/WebRTCService';

export default {
  name: 'VideoChat',
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    const receiverId = ref(route.params.receiverId);
    
    const localVideoRef = ref(null);
    const remoteVideoRef = ref(null);
    const localStream = ref(null);
    const remoteStream = ref(null);
    const peerConnection = ref(null);
    const socket = ref(null);
    
    const status = ref('Initializing...');
    const error = ref(null);
    const isConnected = ref(false);
    const isMuted = ref(false);
    const isVideoOff = ref(false);
    
    // WebRTC configuration
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
    
    onMounted(async () => {
      // Initialize Socket.io connection
      socket.value = io(import.meta.env.VITE_SOCKET_SERVER || 'http://localhost:5000');
      
      // Setup socket event listeners
      setupSocketListeners();
      
      try {
        // Get user media
        localStream.value = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        // Attach stream to video element
        if (localVideoRef.value) {
          localVideoRef.value.srcObject = localStream.value;
        }
        
        status.value = 'Media initialized. Waiting for peer...';
        
        // Emit join-room event to signal server
        socket.value.emit('join-room', {
          userId: localStorage.getItem('userId'),
          receiverId: receiverId.value
        });
      } catch (err) {
        error.value = `Failed to access media devices: ${err.message}`;
        status.value = 'Error initializing media';
      }
    });
    
    onBeforeUnmount(() => {
      // Clean up resources
      if (localStream.value) {
        localStream.value.getTracks().forEach(track => track.stop());
      }
      
      if (peerConnection.value) {
        peerConnection.value.close();
      }
      
      if (socket.value) {
        socket.value.disconnect();
      }
    });
    
    // Socket event listeners setup
    const setupSocketListeners = () => {
      socket.value.on('connect', () => {
        status.value = 'Socket connected. Getting user media...';
      });
      
      socket.value.on('offer', handleOffer);
      socket.value.on('answer', handleAnswer);
      socket.value.on('ice-candidate', handleIceCandidate);
      socket.value.on('user-connected', handleUserConnected);
      socket.value.on('user-disconnected', handleUserDisconnected);
    };
    
    const createPeerConnection = () => {
      try {
        const pc = new RTCPeerConnection(configuration);
        
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.value.emit('ice-candidate', {
              candidate: event.candidate,
              to: receiverId.value
            });
          }
        };
        
        pc.ontrack = (event) => {
          remoteStream.value = event.streams[0];
          if (remoteVideoRef.value) {
            remoteVideoRef.value.srcObject = event.streams[0];
          }
          isConnected.value = true;
          status.value = 'Connected';
        };
        
        // Add local tracks to peer connection
        if (localStream.value) {
          localStream.value.getTracks().forEach(track => {
            pc.addTrack(track, localStream.value);
          });
        }
        
        peerConnection.value = pc;
        return pc;
      } catch (err) {
        error.value = `Failed to create peer connection: ${err.message}`;
        return null;
      }
    };
    
    const handleUserConnected = async () => {
      status.value = 'Peer connected. Creating offer...';
      const pc = createPeerConnection();
      
      if (!pc) return;
      
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        socket.value.emit('offer', {
          offer,
          to: receiverId.value
        });
      } catch (err) {
        error.value = `Failed to create offer: ${err.message}`;
      }
    };
    
    const handleOffer = async (data) => {
      status.value = 'Received offer. Creating answer...';
      const pc = createPeerConnection();
      
      if (!pc) return;
      
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        socket.value.emit('answer', {
          answer,
          to: data.from
        });
      } catch (err) {
        error.value = `Failed to handle offer: ${err.message}`;
      }
    };
    
    const handleAnswer = async (data) => {
      status.value = 'Received answer. Connecting...';
      
      if (!peerConnection.value) return;
      
      try {
        await peerConnection.value.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      } catch (err) {
        error.value = `Failed to handle answer: ${err.message}`;
      }
    };
    
    const handleIceCandidate = async (data) => {
      if (!peerConnection.value) return;
      
      try {
        await peerConnection.value.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      } catch (err) {
        error.value = `Failed to add ICE candidate: ${err.message}`;
      }
    };
    
    const handleUserDisconnected = () => {
      status.value = 'Peer disconnected';
      isConnected.value = false;
      remoteStream.value = null;
      
      if (remoteVideoRef.value) {
        remoteVideoRef.value.srcObject = null;
      }
    };
    
    const toggleMute = () => {
      if (!localStream.value) return;
      
      const audioTrack = localStream.value.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        isMuted.value = !audioTrack.enabled;
      }
    };
    
    const toggleVideo = () => {
      if (!localStream.value) return;
      
      const videoTrack = localStream.value.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        isVideoOff.value = !videoTrack.enabled;
      }
    };
    
    const endCall = () => {
      if (localStream.value) {
        localStream.value.getTracks().forEach(track => track.stop());
      }
      
      if (peerConnection.value) {
        peerConnection.value.close();
      }
      
      router.push('/messages');
    };
    
    return {
      localVideoRef,
      remoteVideoRef,
      remoteStream,
      status,
      error,
      isMuted,
      isVideoOff,
      toggleMute,
      toggleVideo,
      endCall
    };
  }
};
</script>

<style>
.video-chat-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.video-streams {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0;
}

.local-stream, .remote-stream {
  position: relative;
  width: calc(50% - 10px);
  min-height: 300px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #2d2d2d;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stream-label {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
}

.no-remote-stream {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: white;
  font-size: 1.2em;
}

.video-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.control-btn, .end-call-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}

.control-btn {
  background-color: #007bff;
  color: white;
}

.control-btn:hover {
  background-color: #0069d9;
}

.control-btn.active {
  background-color: #6c757d;
}

.end-call-btn {
  background-color: #dc3545;
  color: white;
}

.end-call-btn:hover {
  background-color: #c82333;
}

.status-indicator {
  background-color: #f8f9fa;
  padding: 8px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 0.9em;
}

.error-message {
  color: #dc3545;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #f8d7da;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .local-stream, .remote-stream {
    width: 100%;
  }
  
  .video-controls {
    flex-direction: column;
    align-items: center;
  }
}
</style>
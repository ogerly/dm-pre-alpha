// This file will be served at /client.js

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on a page with chat elements
  if (document.getElementById('chat')) {
    initChat();
  }
});

// Initialize the chat functionality
function initChat() {
  const socket = io();
  const peerConnections = {};
  const dataChannels = {};
  const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  // UI-Elemente
  const chat = document.getElementById('chat');
  const messageInput = document.getElementById('messageInput');
  const myIdSpan = document.getElementById('myId');

  if (!chat || !messageInput || !myIdSpan) {
    console.error('Required chat elements not found in DOM');
    return;
  }

  // Expose sendMessage to the global scope for onclick handlers
  window.sendMessage = function() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add to chat first for immediate feedback
    addToChat(`Du: ${message}`);

    // Send via Socket.IO first (more reliable)
    socket.emit('chatMessage', { message });

    // Then try to send via WebRTC if available
    Object.values(dataChannels).forEach(dc => {
      if (dc.readyState === 'open') {
        dc.send(message);
      }
    });

    messageInput.value = '';
  };

  // Socket.IO event handlers
  socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id);
    myIdSpan.textContent = socket.id;
  });

  socket.on('connected', (data) => {
    console.log('Server confirmed connection:', data);
    myIdSpan.textContent = data.id;
    addToChat(`Connected to server: ${data.message || 'Success'}`);
  });

  socket.on('newUser', (data) => {
    addToChat(`New user connected: ${data.id}`);
    initiatePeerConnection(data.id);
  });

  socket.on('userDisconnected', (data) => {
    addToChat(`User disconnected: ${data.id}`);
    if (peerConnections[data.id]) {
      peerConnections[data.id].close();
      delete peerConnections[data.id];
      delete dataChannels[data.id];
    }
  });

  socket.on('chatMessage', (data) => {
    if (data.id !== socket.id) {
      addToChat(`${data.id.substring(0, 6)}...: ${data.message}`);
    }
  });

  socket.on('userCount', (count) => {
    addToChat(`Users online: ${count}`);
  });

  // WebRTC Signaling
  socket.on('offer', async (data) => {
    try {
      const pc = createPeerConnection(data.from, false);
      peerConnections[data.from] = pc;

      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { answer, target: data.from });
      
      addToChat(`Answered call from ${data.from.substring(0, 6)}...`);
    } catch (err) {
      console.error('Error handling offer:', err);
      addToChat(`Failed to answer call: ${err.message}`);
    }
  });

  socket.on('answer', async (data) => {
    try {
      const pc = peerConnections[data.from];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        addToChat(`Connection established with ${data.from.substring(0, 6)}...`);
      }
    } catch (err) {
      console.error('Error handling answer:', err);
    }
  });

  socket.on('candidate', async (data) => {
    try {
      const pc = peerConnections[data.from];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    } catch (err) {
      console.error('Error handling ICE candidate:', err);
    }
  });

  // WebRTC helper functions
  function initiatePeerConnection(peerId) {
    try {
      const pc = createPeerConnection(peerId, true);
      peerConnections[peerId] = pc;
      
      // Create and send offer
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => {
          socket.emit('offer', { offer: pc.localDescription, target: peerId });
          addToChat(`Initiated connection with ${peerId.substring(0, 6)}...`);
        })
        .catch(err => console.error('Error creating offer:', err));
    } catch (err) {
      console.error('Error initiating peer connection:', err);
    }
  }

  function createPeerConnection(remoteId, isInitiator) {
    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('candidate', { candidate: event.candidate, target: remoteId });
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'closed') {
        addToChat(`Connection with ${remoteId.substring(0, 6)}... was closed`);
      }
    };

    // Create data channel if initiator
    if (isInitiator) {
      const dc = pc.createDataChannel('chat');
      setupDataChannel(dc, remoteId);
    }

    // Handle incoming data channels
    pc.ondatachannel = event => {
      setupDataChannel(event.channel, remoteId);
    };

    return pc;
  }

  function setupDataChannel(dc, remoteId) {
    dataChannels[remoteId] = dc;

    dc.onopen = () => {
      addToChat(`Direct connection established with ${remoteId.substring(0, 6)}...`);
    };

    dc.onmessage = event => {
      addToChat(`${remoteId.substring(0, 6)}... (direct): ${event.data}`);
    };

    dc.onclose = () => {
      addToChat(`Direct connection with ${remoteId.substring(0, 6)}... closed`);
    };
  }

  function addToChat(message) {
    const div = document.createElement('div');
    div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  // Enter key to send message
  messageInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') window.sendMessage();
  });

  // Inform user that chat is ready
  addToChat('Chat initialized, connecting to server...');
}
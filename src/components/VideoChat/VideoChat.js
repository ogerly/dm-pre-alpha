import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './VideoChat.css';

const VideoChat = () => {
  const { receiverId } = useParams();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  
  // WebRTC configuration
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    // Initialize Socket.io connection
    socketRef.current = io(process.env.REACT_APP_SOCKET_SERVER || 'http://localhost:5000');
    
    // Setup socket event listeners
    socketRef.current.on('connect', () => {
      setStatus('Socket connected. Getting user media...');
      socketRef.current.emit('join-room', {
        userId: localStorage.getItem('userId'),
        receiverId
      });
    });
    
    socketRef.current.on('offer', handleOffer);
    socketRef.current.on('answer', handleAnswer);
    socketRef.current.on('ice-candidate', handleIceCandidate);
    socketRef.current.on('user-connected', handleUserConnected);
    socketRef.current.on('user-disconnected', handleUserDisconnected);
    
    // Get user media and initialize local stream
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        setStatus('Media initialized. Waiting for peer...');
      } catch (err) {
        setError(`Failed to access media devices: ${err.message}`);
        setStatus('Error initializing media');
      }
    };
    
    initializeMedia();
    
    // Clean up on component unmount
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      socketRef.current.disconnect();
    };
  }, [receiverId]);

  const createPeerConnection = () => {
    try {
      const peerConnection = new RTCPeerConnection(configuration);
      
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('ice-candidate', {
            candidate: event.candidate,
            to: receiverId
          });
        }
      };
      
      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
        setIsConnected(true);
        setStatus('Connected');
      };
      
      // Add local tracks to peer connection
      if (localStream) {
        localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream);
        });
      }
      
      peerConnectionRef.current = peerConnection;
      return peerConnection;
    } catch (err) {
      setError(`Failed to create peer connection: ${err.message}`);
      return null;
    }
  };

  const handleUserConnected = async () => {
    setStatus('Peer connected. Creating offer...');
    const peerConnection = createPeerConnection();
    
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      socketRef.current.emit('offer', {
        offer,
        to: receiverId
      });
    } catch (err) {
      setError(`Failed to create offer: ${err.message}`);
    }
  };

  const handleOffer = async (data) => {
    setStatus('Received offer. Creating answer...');
    const peerConnection = createPeerConnection();
    
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      socketRef.current.emit('answer', {
        answer,
        to: data.from
      });
    } catch (err) {
      setError(`Failed to handle offer: ${err.message}`);
    }
  };

  const handleAnswer = async (data) => {
    setStatus('Received answer. Connecting...');
    try {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    } catch (err) {
      setError(`Failed to handle answer: ${err.message}`);
    }
  };

  const handleIceCandidate = async (data) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    } catch (err) {
      setError(`Failed to add ICE candidate: ${err.message}`);
    }
  };

  const handleUserDisconnected = () => {
    setStatus('Peer disconnected');
    setIsConnected(false);
    setRemoteStream(null);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    window.location.href = '/messages';
  };

  return (
    <div className="video-chat-container">
      <h2>Video Chat</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="status-indicator">Status: {status}</div>
      
      <div className="video-streams">
        <div className="local-stream">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="video-element"
          />
          <div className="stream-label">You</div>
        </div>
        
        <div className="remote-stream">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="video-element"
            />
          ) : (
            <div className="no-remote-stream">
              Waiting for other person to join...
            </div>
          )}
          <div className="stream-label">Remote</div>
        </div>
      </div>
      
      <div className="video-controls">
        <button onClick={toggleMute} className="control-btn">
          Toggle Mute
        </button>
        <button onClick={toggleVideo} className="control-btn">
          Toggle Video
        </button>
        <button onClick={endCall} className="end-call-btn">
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoChat;

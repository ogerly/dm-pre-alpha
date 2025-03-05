// WebRTCService.js - Service für die Verwaltung von WebRTC-Verbindungen

class WebRTCService {
    constructor() {
      this.peerConnections = {};
      this.localStream = null;
      this.onTrackCallback = null;
      
      // STUN-Server für die Ermittlung der öffentlichen IP-Adresse
      this.iceServers = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' }
        ]
      };
    }
  
    // Lokalen Medienstream initialisieren
    async initLocalStream(constraints = { audio: true, video: true }) {
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
        return this.localStream;
      } catch (error) {
        console.error('Fehler beim Zugriff auf lokale Mediengeräte:', error);
        throw error;
      }
    }
  
    // Lokalen Stream beenden
    stopLocalStream() {
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
    }
  
    // Peer-Verbindung initialisieren
    createPeerConnection(peerId) {
      if (this.peerConnections[peerId]) {
        console.warn(`PeerConnection für ${peerId} existiert bereits.`);
        return this.peerConnections[peerId];
      }
  
      try {
        const peerConnection = new RTCPeerConnection(this.iceServers);
        
        // Event-Handler für ICE-Kandidaten
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            this.onIceCandidate(peerId, event.candidate);
          }
        };
        
        // Event-Handler für Verbindungsstatus
        peerConnection.onconnectionstatechange = () => {
          console.log(`Verbindungsstatus mit ${peerId}: ${peerConnection.connectionState}`);
        };
        
        // Event-Handler für Remote-Streams
        peerConnection.ontrack = (event) => {
          if (this.onTrackCallback) {
            this.onTrackCallback(peerId, event.streams[0]);
          }
        };
        
        // Lokalen Stream hinzufügen, wenn vorhanden
        if (this.localStream) {
          this.localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, this.localStream);
          });
        }
        
        this.peerConnections[peerId] = peerConnection;
        return peerConnection;
      } catch (error) {
        console.error(`Fehler beim Erstellen der PeerConnection für ${peerId}:`, error);
        throw error;
      }
    }
  
    // SDP-Angebot erstellen
    async createOffer(peerId) {
      const peerConnection = this.getPeerConnection(peerId);
      
      try {
        const offer = await peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        
        await peerConnection.setLocalDescription(offer);
        return offer;
      } catch (error) {
        console.error(`Fehler beim Erstellen des Angebots für ${peerId}:`, error);
        throw error;
      }
    }
  
    // SDP-Angebot setzen und Antwort erstellen
    async handleOffer(peerId, offer) {
      const peerConnection = this.getPeerConnection(peerId);
      
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        return answer;
      } catch (error) {
        console.error(`Fehler beim Verarbeiten des Angebots von ${peerId}:`, error);
        throw error;
      }
    }
  
    // SDP-Antwort verarbeiten
    async handleAnswer(peerId, answer) {
      const peerConnection = this.getPeerConnection(peerId);
      
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error(`Fehler beim Verarbeiten der Antwort von ${peerId}:`, error);
        throw error;
      }
    }
  
    // ICE-Kandidaten hinzufügen
    async addIceCandidate(peerId, candidate) {
      const peerConnection = this.getPeerConnection(peerId);
      
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error(`Fehler beim Hinzufügen des ICE-Kandidaten von ${peerId}:`, error);
        throw error;
      }
    }
  
    // Peer-Verbindung abrufen oder erstellen
    getPeerConnection(peerId) {
      if (!this.peerConnections[peerId]) {
        return this.createPeerConnection(peerId);
      }
      return this.peerConnections[peerId];
    }
  
    // Peer-Verbindung schließen
    closePeerConnection(peerId) {
      const peerConnection = this.peerConnections[peerId];
      
      if (peerConnection) {
        peerConnection.onicecandidate = null;
        peerConnection.onconnectionstatechange = null;
        peerConnection.ontrack = null;
        
        peerConnection.close();
        delete this.peerConnections[peerId];
        
        console.log(`PeerConnection mit ${peerId} geschlossen.`);
      }
    }
  
    // Alle Peer-Verbindungen schließen
    closeAllPeerConnections() {
      Object.keys(this.peerConnections).forEach(peerId => {
        this.closePeerConnection(peerId);
      });
    }
  
    // Event-Handler für Remote-Tracks
    onTrack(callback) {
      this.onTrackCallback = callback;
    }
  
    // Event-Handler für ICE-Kandidaten
    onIceCandidate(peerId, candidate) {
      // Diese Methode sollte überschrieben werden, um ICE-Kandidaten an den Signaling-Server zu senden
      console.log(`ICE-Kandidat für ${peerId} generiert:`, candidate);
    }
  }
  
  export default new WebRTCService();
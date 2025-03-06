import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

// Configure CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"]
  }
});

// First, serve static files from the dist directory
app.use(express.static('dist'));

// Then, serve static files from the public directory for client.js etc.
app.use(express.static('public'));

// API routes would go here

// For client-side routing (SPA) - serve index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Connection counter
let connectedUsers = 0;

io.on('connection', socket => {
  connectedUsers++;
  console.log('Neuer Client verbunden:', socket.id);
  console.log(`Anzahl verbundener Clients: ${connectedUsers}`);

  // Broadcast updated user count
  io.emit('userCount', connectedUsers);
  
  // Send connection confirmation to the client
  socket.emit('connected', { 
    id: socket.id,
    message: 'Erfolgreich mit dem Server verbunden'
  });

  // Inform other clients about new user
  socket.broadcast.emit('newUser', { 
    id: socket.id, 
    timestamp: new Date().toISOString()
  });

  // Handle chat messages
  socket.on('chatMessage', data => {
    console.log(`Message from ${socket.id}: ${data.message}`);
    
    // Broadcast to all other clients
    io.emit('chatMessage', {
      id: socket.id,
      message: data.message,
      timestamp: new Date().toISOString()
    });
  });

  // WebRTC signaling
  socket.on('offer', data => {
    socket.to(data.target).emit('offer', { 
      offer: data.offer, 
      from: socket.id 
    });
  });

  socket.on('answer', data => {
    socket.to(data.target).emit('answer', { 
      answer: data.answer, 
      from: socket.id 
    });
  });

  socket.on('candidate', data => {
    socket.to(data.target).emit('candidate', { 
      candidate: data.candidate, 
      from: socket.id 
    });
  });

  socket.on('disconnect', () => {
    connectedUsers--;
    console.log(`Client disconnected: ${socket.id}`);
    console.log(`Anzahl verbundener Clients: ${connectedUsers}`);
    
    io.emit('userDisconnected', {
      id: socket.id,
      timestamp: new Date().toISOString()
    });
    
    io.emit('userCount', connectedUsers);
  });
});

// Use a consistent port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
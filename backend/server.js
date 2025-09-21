const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');
const noteRoutes = require('./routes/notes');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);

// Socket.IO for real‑time updates
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('taskUpdated', (task) => {
    // Broadcast the updated task to other clients
    socket.broadcast.emit('taskUpdated', task);
  });

  socket.on('whiteboardEvent', (data) => {
    // Broadcast canvas drawing events to other clients
    socket.broadcast.emit('whiteboardEvent', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
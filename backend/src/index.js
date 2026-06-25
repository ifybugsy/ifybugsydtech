const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
require('express-async-errors');

const { connectDB } = require('./config/database');
const apiRoutes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Join community room
  socket.on('join-community', (data) => {
    socket.join('community');
    socket.broadcast.to('community').emit('user-joined', {
      message: `User ${data.userId} joined the community`,
    });
  });

  // New community post
  socket.on('new-community-post', (data) => {
    io.to('community').emit('community-post-created', data);
  });

  // New community reply
  socket.on('new-community-reply', (data) => {
    io.to('community').emit('community-reply-created', data);
  });

  // Join course room
  socket.on('join-course', (courseId) => {
    socket.join(`course-${courseId}`);
    io.to(`course-${courseId}`).emit('user-joined-course', {
      message: 'User joined course session',
    });
  });

  // Course progress update
  socket.on('course-progress', (data) => {
    io.to(`course-${data.courseId}`).emit('progress-updated', data);
  });

  // New blog post
  socket.on('new-blog-post', (data) => {
    io.emit('blog-post-published', data);
  });

  // New order
  socket.on('new-order', (data) => {
    io.emit('order-created', data);
    io.to('admin').emit('new-order-admin', data);
  });

  // Payment completed
  socket.on('payment-completed', (data) => {
    io.emit('payment-success', data);
    io.to('admin').emit('payment-received-admin', data);
  });

  // Join admin room
  socket.on('join-admin', (adminId) => {
    socket.join('admin');
    console.log('Admin connected:', adminId);
  });

  // User joins their private messaging room
  socket.on('join-messages', (userId) => {
    socket.join(`user-messages-${userId}`);
    console.log('User joined messages room:', userId);
  });

  // Send direct message (user to user)
  socket.on('send-message', (data) => {
    const { senderId, recipientId, content, timestamp } = data;
    const message = {
      id: Date.now().toString(),
      senderId,
      recipientId,
      content,
      timestamp: timestamp || new Date(),
      isRead: false,
    };
    
    // Send to recipient's private room
    io.to(`user-messages-${recipientId}`).emit('receive-message', message);
    // Send confirmation back to sender
    socket.emit('message-sent', message);
    
    console.log(`Message from ${senderId} to ${recipientId}`);
  });

  // Send message to admin
  socket.on('message-to-admin', (data) => {
    const { userId, content, timestamp } = data;
    const message = {
      id: Date.now().toString(),
      userId,
      content,
      timestamp: timestamp || new Date(),
      isRead: false,
    };
    
    // Broadcast to all admins
    io.to('admin').emit('user-message-admin', message);
    // Confirm to user
    socket.emit('message-sent', message);
    
    console.log(`Message from user ${userId} to admin`);
  });

  // Admin sends message to user
  socket.on('admin-message-to-user', (data) => {
    const { adminId, userId, content, timestamp } = data;
    const message = {
      id: Date.now().toString(),
      senderId: adminId,
      senderRole: 'admin',
      content,
      timestamp: timestamp || new Date(),
      isRead: false,
    };
    
    // Send to user's private room
    io.to(`user-messages-${userId}`).emit('admin-message', message);
    // Confirm to admin
    socket.emit('message-sent', message);
    
    console.log(`Admin ${adminId} sent message to user ${userId}`);
  });

  // Mark message as read
  socket.on('mark-message-read', (data) => {
    const { messageId, userId } = data;
    io.to(`user-messages-${userId}`).emit('message-read', { messageId });
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { senderId, recipientId } = data;
    io.to(`user-messages-${recipientId}`).emit('user-typing', { senderId });
  });

  // Stop typing
  socket.on('stop-typing', (data) => {
    const { senderId, recipientId } = data;
    io.to(`user-messages-${recipientId}`).emit('user-stop-typing', { senderId });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit('user-disconnected', { userId: socket.id });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('\n========================================');
    console.log('Starting Ifybugsy Backend Server...');
    console.log('========================================\n');
    
    // Connect to database (with retries and DNS check)
    console.log('[SERVER] Connecting to MongoDB Atlas...\n');
    await connectDB();
    console.log('[SERVER] Database initialization completed.\n');

    // Start server immediately
    server.listen(PORT, () => {
      console.log('========================================');
      console.log('✅ SERVER STARTED SUCCESSFULLY');
      console.log('========================================');
      console.log(`\n✓ Server running on port ${PORT}`);
      console.log(`✓ Socket.io ready for real-time connections`);
      console.log(`✓ Express API ready`);
      console.log(`\n🌐 Frontend: http://localhost:3000`);
      console.log(`📡 Backend:  http://localhost:${PORT}`);
      console.log(`✅ Health:   http://localhost:${PORT}/health`);
      console.log('\n========================================\n');
    });
  } catch (error) {
    console.error('[SERVER] Fatal error:', error.message);
    process.exit(1);
  }
};

console.log('[SERVER] Process environment loaded');
startServer().catch(err => {
  console.error('[SERVER] Uncaught startup error:', err);
  process.exit(1);
});

module.exports = server;

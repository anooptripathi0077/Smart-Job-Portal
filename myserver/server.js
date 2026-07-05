import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import blogRoutes from './routes/blog.js';
import jobRoutes from './routes/job.js';
import messageRoutes from './routes/messageRoutes.js';
import Message from './models/Message.js';
import applicationRoutes from './routes/application.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('✅ MongoDB Atlas connected successfully');
};

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/chats', messageRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (req, res) => res.send('API is running...'));

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

if (process.env.ENABLE_SOCKET === 'true') {
  io.on('connection', (socket) => {
    socket.on('join', ({ userId }) => socket.join(userId));
    socket.on('send', async (data) => {
      console.log('📩 Incoming message data:', data);
      const { from, to, body } = data;

      if (!from || !to || !body) {
        console.error('❌ Missing fields in message:', { from, to, body });
        return;
      }

      try {
        const msg = await Message.create({ from, to, body });
        io.to(to).emit('receive', msg);
      } catch (err) {
        console.error('💥 Message save error:', err);
      }
    });

    socket.on('deleteChat', ({ from, to }) => {
      console.log(`🗑 Chat deleted between ${from} and ${to}`);
      io.to(to).emit('chatDeleted', { from });
      io.to(from).emit('chatDeleted', { from });
    });
  });
}

const startServer = async () => {
  try {
    await connectDB();

    if (process.env.VERCEL !== '1') {
      server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    }
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app, server, io, startServer };
export default app;

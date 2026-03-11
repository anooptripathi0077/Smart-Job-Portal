import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import path from "path";//
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import blogRoutes from './routes/blog.js';
import jobRoutes from './routes/job.js';
import userRoutes_ from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import Message from './models/Message.js';
import applicationRoutes from './routes/application.js';
import { fileURLToPath} from "url";//
import resumeRoutes from "./routes/resumeRoutes.js";//
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: 'http://localhost:3000',methods :['GET','POST'],credentials : true} });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB Atlas connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB().then(() => {

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use("/api/resume",resumeRoutes);//
  // app.use('/api/users', userRoutes_);
app.use('/api/chats', messageRoutes);
  app.use('/api/applications', applicationRoutes);

  app.get('/', (req, res) => res.send('API is running...'));

  app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  });
 io.on('connection', (socket) => {
  socket.on('join', ({ userId }) => socket.join(userId));
  socket.on('send', async (data) => {
  console.log('📩 Incoming message data:', data); // ADD THIS
  const { from, to, body } = data;

  if (!from || !to || !body) {
    console.error('❌ Missing fields in message:', { from, to, body });
    return;
  }

  try {
    const msg = await Message.create({ from, to, body });
    io.to(to).emit('receive', msg);
    // io.to(from).emit('receive', msg);
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
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

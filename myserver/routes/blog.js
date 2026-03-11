import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import BlogPost from '../models/BlogPost.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  const posts = await BlogPost.find()
    .populate('author', 'name profilePicUrl followers')
    .populate('comments.author', 'name profilePicUrl')
    .sort({ createdAt: -1 });
  res.json(posts);
});

// Create a new post
router.post('/', authenticateJWT, async (req, res) => {
  const { mediaUrl, mediaType, description } = req.body;
  const post = new BlogPost({
    author: req.user.userId,
    mediaUrl,
    mediaType,
    description
  });
  await post.save();
  const populated = await post.populate('author', 'name profilePicUrl');
  res.json(populated);
});

// Like/unlike post
router.post('/like/:id', authenticateJWT, async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  
  const idx = post.likes.indexOf(req.user.userId);
  let action;
  if (idx === -1) {
    post.likes.push(req.user.userId);
    action = 'liked';
  } else {
    post.likes.splice(idx, 1);
    action = 'unliked';
  }
  
  await post.save();
  res.json({ action, likes: post.likes.length });
});

// Comment on post
router.post('/comment/:id', authenticateJWT, async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  
  post.comments.push({ author: req.user.userId, text: req.body.text });
  await post.save();
  
  const populated = await BlogPost.findById(post._id)
    .populate('comments.author', 'name profilePicUrl');
  res.json(populated.comments.pop());
});

// Delete a post
router.delete('/:id', authenticateJWT, async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (String(post.author) !== String(req.user.userId)) {
    return res.status(403).json({ message: 'You can only delete your own post' });
  }

  await post.deleteOne();
  res.json({ success: true });
});

// Get all posts by a user
router.get('/user/:id', async (req, res) => {
  const posts = await BlogPost.find({ author: req.params.id })
    .populate('author', 'name profilePicUrl')
    .populate('comments.author', 'name profilePicUrl')
    .sort({ createdAt: -1 });
  res.json(posts);
});

export default router;

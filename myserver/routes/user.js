import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

// Search users by name or college, optionally filter by role
router.get('/search', authenticateJWT, async (req, res) => {
  try {
    const { term = '', role } = req.query;
    const regex = new RegExp(term, 'i');
    const query = {
      $and: [
        role ? { role } : {},
        { $or: [{ name: regex }, { college: regex }] }
      ]
    };
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch a single user’s public profile by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Follow a user
router.post('/follow/:id', authenticateJWT, async (req, res) => {
  const userToFollow = await User.findById(req.params.id);
  if (!userToFollow) return res.status(404).json({ message: 'User not found.' });

  if (!userToFollow.followers.includes(req.user.userId)) {
    userToFollow.followers.push(req.user.userId);
    await userToFollow.save();
  }
  res.json({ followed: true });
});

// Unfollow a user
router.post('/unfollow/:id', authenticateJWT, async (req, res) => {
  const userToUnfollow = await User.findById(req.params.id);
  if (!userToUnfollow) return res.status(404).json({ message: 'User not found.' });

  userToUnfollow.followers = userToUnfollow.followers.filter(
    f => String(f) !== String(req.user.userId)
  );
  await userToUnfollow.save();
  res.json({ followed: false });
});

export default router;

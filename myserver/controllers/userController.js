import User from '../models/user.js';

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user);
};

export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

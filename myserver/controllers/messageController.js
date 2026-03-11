import mongoose from 'mongoose';
import Message from '../models/Message.js';

// Get chat history between two users
export const getChatHistory = async (req, res) => {
  const { userId1, userId2 } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId1) || !mongoose.Types.ObjectId.isValid(userId2)) {
    return res.status(400).json({ error: 'Invalid user IDs' });
  }

  try {
    const messages = await Message.find({
      $or: [
        { from: userId1, to: userId2 },
        { from: userId2, to: userId1 }
      ],
    })
      .sort({ createdAt: 1 })
      .populate('from to', 'name email') // Keep it, we’ll extract useful info
      .lean(); // Important: converts mongoose docs to plain JS objects

    // Normalize data for frontend
    const normalized = messages.map(msg => ({
      ...msg,
      from: msg.from?._id?.toString() || msg.from?.toString(),
      to: msg.to?._id?.toString() || msg.to?.toString(),
      fromName: msg.from?.name || '',  // optional
      toName: msg.to?.name || ''       // optional
    }));

    res.json(normalized);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get inbox list
// 

export const getUserChats = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const chats = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: new mongoose.Types.ObjectId(userId) },
            { to: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: 1 } // sort before grouping gives chronological last message
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$from', new mongoose.Types.ObjectId(userId)] },
              '$to',
              '$from',
            ],
          },
          lastMessage: { $last: '$body' },
          lastDate: { $last: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users', // make sure collection name is lowercase 'users'
          localField: '_id',
          foreignField: '_id',
          as: 'partner'
        }
      },
      { $unwind: '$partner' }, // de-array partner after $lookup
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          lastDate: 1,
          username: '$partner.name', // project username for frontend
          email: '$partner.email'
        }
      },
      {
        $sort: { lastDate: -1 } // latest chats first
      }
    ]);

    res.json(chats);
  } catch (err) {
    console.error('Error fetching inbox:', err);
    res.status(500).json({ error: 'Server error' });
  }
};



export const deleteChatHistory = async(req,res)=>{
  const {userId1,userId2} = req.params;
  try{
    await Message.deleteMany({
      $or: [
        {from : userId1, to : userId2},
        {from : userId2, to : userId1}
      ]
    });

    res.json({success: true,message:  'Chat deleted successfuly'});
  }catch (err){
    console.error('Error deleting Chat : ',err);
    res.status(500).json({error: 'Server error'});
  }
};

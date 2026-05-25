import express from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message.js';
import auth from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    
    if (!recipientId || !message) {
      return res.status(400).json({ message: 'Recipient ID and message are required' });
    }

    const newMessage = new Message({
      senderId: req.user.id,
      recipientId,
      message: message.trim()
    });

    await newMessage.save();

    // Emit real-time events via Socket.io
    const io = req.app.get('io');
    if (io) {
      const recipientStr = recipientId.toString();
      const senderStr = req.user.id.toString();

      console.log(`[Socket] Emitting message to recipient room: ${recipientStr}`);
      io.to(recipientStr).emit('message', newMessage);
      console.log(`[Socket] Emitting message to sender room: ${senderStr}`);
      io.to(senderStr).emit('message', newMessage);
      
      console.log(`[Socket] Emitting notification to recipient room: ${recipientStr}`);
      io.to(recipientStr).emit('notification', { 
        type: 'message', 
        from: senderStr, 
        senderName: req.user.name,
        senderRole: req.user.role,
        message: newMessage.message, 
        at: newMessage.createdAt 
      });
    }
    
    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

// Get messages between current user and another user
router.get('/:otherUserId', auth, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.id;

    // Find all messages between these two users
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: currentUserId }
      ]
    })
    .sort({ createdAt: 1 }) // Oldest first
    .populate('senderId', 'name email role profileImage')
    .populate('recipientId', 'name email role profileImage');

    // Mark messages as read where current user is recipient
    await Message.updateMany(
      { senderId: otherUserId, recipientId: currentUserId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
});

// Get all conversations (list of users the current user has chatted with)
router.get('/conversations/list', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get all unique user IDs that current user has chatted with
    const sentMessages = await Message.distinct('recipientId', { senderId: currentUserId });
    const receivedMessages = await Message.distinct('senderId', { recipientId: currentUserId });
    
    // Combine and get unique user IDs
    const userIds = [...new Set([...sentMessages, ...receivedMessages])];

    // Get user details - import at top if User model exists
    const User = mongoose.model('User');
    const users = await User.find({ _id: { $in: userIds } })
      .select('name email role profileImage');

    res.json(users);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ message: 'Server error while fetching conversations' });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipientId: req.user.id,
      read: false
    });

    res.json({ unreadCount: count });
  } catch (err) {
    console.error('Error counting unread messages:', err);
    res.status(500).json({ message: 'Server error while counting unread messages' });
  }
});

// Mark messages from a specific sender as read
router.patch('/read/:senderId', auth, async (req, res) => {
  try {
    const { senderId } = req.params;
    const recipientId = req.user.id;

    await Message.updateMany(
      { senderId, recipientId, read: false },
      { $set: { read: true } }
    );

    console.log(`[Socket] Marking messages from ${senderId} as read by ${recipientId}`);
    const io = req.app.get('io');
    if (io) {
      console.log(`[Socket] Emitting messages_read to sender room: ${senderId}`);
      io.to(senderId.toString()).emit('messages_read', { by: recipientId });
    }

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking messages as read' });
  }
});

export default router;

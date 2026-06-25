const Message = require('../models/Message');
const User = require('../models/User');

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: userId },
        { sender: userId, recipient: senderId },
      ],
    })
      .populate('sender', 'name email profileImage')
      .populate('recipient', 'name email profileImage')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { recipient: senderId, sender: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all conversations for a user (latest messages)
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all unique conversations
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: mongoose.Types.ObjectId(userId) }, { recipient: mongoose.Types.ObjectId(userId) }],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', mongoose.Types.ObjectId(userId)] },
              '$recipient',
              '$sender',
            ],
          },
          lastMessage: { $last: '$content' },
          lastMessageTime: { $last: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastMessageTime: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          user: {
            _id: '$user._id',
            name: '$user.name',
            email: '$user.email',
            profileImage: '$user.profileImage',
          },
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1,
        },
      },
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user.id;

    // Validate recipient
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await message.save();
    await message.populate('sender', 'name email profileImage');
    await message.populate('recipient', 'name email profileImage');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all messages for moderation
exports.getAllMessagesAdmin = async (req, res) => {
  try {
    const { flagged } = req.query;

    let query = {};
    if (flagged === 'true') {
      query.flaggedByAdmin = true;
    }

    const messages = await Message.find(query)
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Flag a message
exports.flagMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { adminNotes } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        flaggedByAdmin: true,
        adminNotes,
      },
      { new: true }
    );

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a message (soft delete)
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete their own message
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Message.findByIdAndDelete(messageId);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

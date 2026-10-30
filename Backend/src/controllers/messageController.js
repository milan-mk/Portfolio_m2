import mongoose from 'mongoose';
import { Message } from '../models/Message.js';

/**
 * @desc    Submit a new contact / hire me missive
 * @route   POST /api/messages or POST /api/contact
 * @access  Public
 */
export const createMessage = async (req, res) => {
  try {
    const { name, email, orders, message, role } = req.body;
    const finalOrders = (orders || message || '').trim();

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Chief / Recruiter name is required',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Carrier Pigeon / Email address is required',
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address (e.g. recruiter@company.com)',
      });
    }

    if (!finalOrders) {
      return res.status(400).json({
        success: false,
        error: 'Battle Orders / Message is required',
      });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database is currently offline. Please ensure MongoDB is running and MONGODB_URI in Backend/.env is valid.',
      });
    }


    const clientIp =
      req.headers['x-forwarded-for'] ||
      req.socket?.remoteAddress ||
      '';

    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      orders: finalOrders,
      role: role ? String(role).trim() : 'junior',
      ipAddress: Array.isArray(clientIp) ? clientIp[0] : String(clientIp),
    });

    console.log(`[Missive Received] From: ${newMessage.name} <${newMessage.email}>`);

    return res.status(201).json({
      success: true,
      message: 'Battle Scroll Dispatched! Chief Milan will review your missive.',
      data: {
        id: newMessage._id,
        name: newMessage.name,
        email: newMessage.email,
        role: newMessage.role,
        orders: newMessage.orders,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (error) {
    console.error('[Create Message Error]', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }

    return res.status(500).json({
      success: false,
      error: 'An internal fortress error occurred while dispatching your missive.',
    });
  }
};

/**
 * @desc    Get all contact messages (for review / admin)
 * @route   GET /api/messages or GET /api/contact
 * @access  Public (or protected if auth is added later)
 */
export const getMessages = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database is currently offline. Check MongoDB connection.',
      });
    }

    const { status, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (numericPage - 1) * numericLimit;

    const [messages, totalCount] = await Promise.all([
      Message.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit)
        .lean(),
      Message.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: messages.length,
      total: totalCount,
      page: numericPage,
      totalPages: Math.ceil(totalCount / numericLimit),
      data: messages,
    });
  } catch (error) {
    console.error('[Get Messages Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve missives.',
    });
  }
};

/**
 * @desc    Get single message by ID
 * @route   GET /api/messages/:id
 */
export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message ID format',
      });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('[Get Single Message Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve message.',
    });
  }
};

/**
 * @desc    Update message status (e.g., mark as read/unread/archived)
 * @route   PATCH /api/messages/:id/status
 */
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['unread', 'read', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be one of: unread, read, archived',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message ID format',
      });
    }

    const updated = await Message.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Message status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error('[Update Message Status Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update message status.',
    });
  }
};

/**
 * @desc    Delete message
 * @route   DELETE /api/messages/:id
 */
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message ID format',
      });
    }

    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('[Delete Message Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete message.',
    });
  }
};

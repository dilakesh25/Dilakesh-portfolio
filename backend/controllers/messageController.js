import Message from "../models/Message.js";

// @desc    Send a contact message
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Please provide your name, email, and message",
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      subject: subject || "Portfolio Inquiry",
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message received successfully. Thank you!",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Admin)
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};

// @desc    Mark message as read
// @route   PATCH /api/messages/:id/read
// @access  Private (Admin)
export const markMessageAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, error: "Message not found" });
    }

    message.read = true;
    await message.save();

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update message" });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, error: "Message not found" });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete message" });
  }
};

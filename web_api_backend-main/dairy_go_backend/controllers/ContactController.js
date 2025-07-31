const ContactMessage = require("../models/ContactMessage");

// Save a new contact message
exports.saveMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newMessage = new ContactMessage({ name, email, phone, subject, message });
    await newMessage.save();
    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
};

// Get all contact messages (admin only)
exports.getAllMessages = async (req, res) => {
  try {
    console.log("[DEBUG] GET /api/v1/contact called by user:", req.user);
    const messages = await ContactMessage.find().sort({ date: -1 });
    console.log("[DEBUG] Messages found:", messages);
    res.status(200).json(messages);
  } catch (err) {
    console.error("[DEBUG] Error in getAllMessages:", err);
    res.status(500).json({ success: false, message: "Failed to fetch messages." });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ success: false, message: "Message not found." });
    res.status(200).json({ success: true, message: "Marked as read.", data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to mark as read." });
  }
};

// Delete a contact message (admin only)
exports.deleteMessage = async (req, res) => {
  try {
    console.log("Deleting message with ID:", req.params.id);
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    
    if (!message) {
      console.log("Message not found with ID:", req.params.id);
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    
    console.log("Message deleted successfully:", req.params.id);
    res.status(200).json({ success: true, message: "Message deleted successfully." });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ success: false, message: "Failed to delete message." });
  }
}; 
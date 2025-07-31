const express = require("express");
const router = express.Router();
const { saveMessage, getAllMessages, markAsRead, deleteMessage } = require("../controllers/ContactController");
const { protect, authorize } = require("../middleware/auth");

// Public: Save a contact message
router.post("/", saveMessage);
// Admin only: Get all contact messages
router.get("/", protect, authorize("admin"), getAllMessages);
// Admin only: Mark a message as read
router.patch("/:id/read", protect, authorize("admin"), markAsRead);
// Admin only: Delete a message
router.delete("/:id", protect, authorize("admin"), deleteMessage);

module.exports = router; 
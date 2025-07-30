const express = require("express");
const router = express.Router();
const { saveMessage, getAllMessages, markAsRead } = require("../controllers/ContactController");
const { protect, authorize } = require("../middleware/auth");



module.exports = router; 
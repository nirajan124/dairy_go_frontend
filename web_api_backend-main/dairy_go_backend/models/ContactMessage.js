const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model("ContactMessage", contactMessageSchema); 
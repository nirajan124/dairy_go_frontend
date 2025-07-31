const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: false },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  pickupLocation: { type: String },
  paymentMethod: { type: String, enum: ["credit-card", "debit-card", "upi", "paypal", "cash_on_delivery"], required: true },
  paymentId: { type: String }, // For storing payment transaction IDs
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);

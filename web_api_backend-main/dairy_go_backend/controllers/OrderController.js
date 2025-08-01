const Order = require("../models/Order");

// Create a new order
const createOrder = async (req, res) => {
  try {
    // Add customer ID from authenticated user if available
    const orderData = {
      ...req.body,
      customerId: req.user?.id || req.body.customerId || null,
      status: "pending" // Explicitly set status to pending
    };
    
    console.log("Creating order with data:", orderData);
    console.log("User from request:", req.user);
    console.log("Customer ID being set:", orderData.customerId);
    console.log("Order status being set:", orderData.status);
    
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    console.log("Order created successfully:", savedOrder._id);
    console.log("Saved order customer ID:", savedOrder.customerId);
    console.log("Saved order status:", savedOrder.status);
    res.status(201).json({ message: "Order successful!", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    console.log("Fetching all orders...");
    const orders = await Order.find().populate(["packageId", "customerId"]);
    console.log(`Found ${orders.length} orders:`, orders.map(o => ({ id: o._id, status: o.status, customer: o.customerId?.fname || o.fullName })));
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("packageId");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Confirm an order
const confirmOrder = async (req, res) => {
  try {
    console.log("=== CONFIRM ORDER REQUEST ===");
    console.log("Order ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true }
    );
    
    if (!updatedOrder) {
      console.log("Order not found for ID:", req.params.id);
      return res.status(404).json({ error: "Order not found" });
    }
    
    console.log("Order confirmed successfully:", updatedOrder._id, "Status:", updatedOrder.status);
    console.log("=== END CONFIRM ORDER ===");
    res.status(200).json({ message: "Order confirmed", order: updatedOrder });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ error: "Failed to confirm order" });
  }
};

// Cancel an order
const cancelOrder = async (req, res) => {
  try {
    console.log("=== CANCEL ORDER REQUEST ===");
    console.log("Order ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    
    if (!updatedOrder) {
      console.log("Order not found for ID:", req.params.id);
      return res.status(404).json({ error: "Order not found" });
    }
    
    console.log("Order cancelled successfully:", updatedOrder._id, "Status:", updatedOrder.status);
    console.log("=== END CANCEL ORDER ===");
    res.status(200).json({ message: "Order cancelled", order: updatedOrder });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
};

// Delete an order permanently
const deleteOrder = async (req, res) => {
  try {
    console.log("=== DELETE ORDER REQUEST ===");
    console.log("Order ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    
    if (!deletedOrder) {
      console.log("Order not found for ID:", req.params.id);
      return res.status(404).json({ error: "Order not found" });
    }
    
    console.log("Order deleted successfully:", deletedOrder._id);
    console.log("=== END DELETE ORDER ===");
    res.status(200).json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

// Get orders by user ID
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching orders for user ID:", userId);
    const orders = await Order.find({ customerId: userId }).populate(["packageId", "customerId"]);
    console.log("Found orders:", orders.length);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

// Test endpoint to verify routes are working
const testOrderRoutes = async (req, res) => {
  try {
    console.log("=== TEST ORDER ROUTES ===");
    console.log("Test endpoint hit successfully");
    res.status(200).json({ message: "Order routes are working!", timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    res.status(500).json({ error: "Test endpoint failed" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  confirmOrder,
  cancelOrder,
  deleteOrder,
  getOrdersByUserId,
  testOrderRoutes,
};

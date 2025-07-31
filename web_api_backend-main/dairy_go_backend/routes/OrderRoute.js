const express = require("express")

const { cancelOrder, createOrder, getAllOrders, getOrderById, getOrdersByUserId, confirmOrder, testOrderRoutes } = require("../controllers/OrderController");
const router = express.Router();

router.post("/", createOrder); // Create order
router.get("/", getAllOrders); // Get all orders
router.get("/user/:userId", getOrdersByUserId); // Get orders by user ID
router.get("/:id", getOrderById); // Get a specific order by ID
router.put("/:id/confirm", confirmOrder); // Confirm an order
router.put("/:id/cancel", cancelOrder); // Cancel an order
router.get("/test/routes", testOrderRoutes); // Test endpoint
module.exports = router;

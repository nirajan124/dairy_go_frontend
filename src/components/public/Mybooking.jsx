import React, { useState, useEffect } from "react";
import Footer from "../common/customer/Footer";
import Navbar from "../common/customer/Navbar";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder data for dairy orders
  const placeholderOrders = [
    {
      _id: "order1",
      product: { name: "Fresh Whole Milk", imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
      date: new Date().toISOString(),
      totalPrice: 45,
      quantity: 1,
      status: "Confirmed",
    },
    {
      _id: "order2",
      product: { name: "Aged Cheddar Cheese", imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80" },
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      totalPrice: 120,
      quantity: 1,
      status: "Delivered",
    },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to see your orders.");
          setLoading(false);
          return;
        }

        // Decode token to get user ID
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.id;
        console.log("Decoded token:", decodedToken);
        console.log("User ID from token:", userId);

                  // First try to get orders by user ID
          try {
            console.log("Trying to fetch orders for user ID:", userId);
            const response = await axios.get(`http://localhost:3001/api/v1/orders/user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Orders fetched successfully:", response.data);
            setOrders(response.data);
            setError(null);
          } catch (userOrderError) {
            console.log("User-specific orders not found, trying all orders...");
            console.log("Error:", userOrderError.response?.data || userOrderError.message);
            // If user-specific endpoint fails, get all orders and filter by customerId
            const allOrdersResponse = await axios.get("http://localhost:3001/api/v1/orders", {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log("All orders fetched:", allOrdersResponse.data);
            const userOrders = allOrdersResponse.data.filter(order => 
              order.customerId === userId || order.customerId?._id === userId
            );
            console.log("Filtered user orders:", userOrders);
            setOrders(userOrders);
            setError(null);
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
          if (err.response?.status === 401) {
            setError("Please login to view your orders.");
          } else {
            setError("Failed to load orders. Please try again.");
          }
          setOrders([]);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
      
             // Refresh orders every 30 seconds to get real-time status updates
       const interval = setInterval(fetchOrders, 30000);
       return () => clearInterval(interval);
     }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "text-green-600";
      case "delivered": return "text-blue-600";
      case "pending": return "text-yellow-600";
      case "cancelled": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed": 
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>;
      case "pending": 
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case "cancelled": 
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>;
      default: 
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">
          My Orders
        </h1>
        <p className="text-lg text-center text-gray-600 mb-12">
          Track your recent dairy orders and their status.
        </p>

        {error && (
          <div className="text-center mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col items-center space-y-6">
          {loading ? (
            <div className="dairy-spinner mx-auto"></div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg flex items-start space-x-6 border border-gray-100"
              >
                <img
                  src={order.packageId?.image ? `http://localhost:3001/uploads/${order.packageId.image}` : "https://via.placeholder.com/150"}
                  alt={order.packageId?.name || "Product"}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <h2 className="text-2xl font-semibold text-blue-800">
                    {order.packageId?.name || "Product"}
                  </h2>
                  <p className="text-gray-600">Order ID: {order._id}</p>
                  <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-600">Quantity: {order.quantity}</p>
                  <p className="text-gray-600">Price per unit: ₹{order.packageId?.price || "N/A"}</p>
                  <p className="text-gray-600">Total Amount: ₹{(order.packageId?.price * order.quantity) || "N/A"}</p>
                  <p className="text-gray-600">Payment Method: {order.paymentMethod}</p>
                  <p className="text-gray-600">Description: {order.packageId?.description || "No description available"}</p>
                  <div className="mt-2">
                    {getStatusBadge(order.status)}
                  </div>
                  {order.status === "confirmed" && (
                    <p className="text-sm text-green-600 mt-1">✅ Your order has been approved and is being processed!</p>
                  )}
                  {order.status === "cancelled" && (
                    <p className="text-sm text-red-600 mt-1">❌ Your order has been cancelled. Please contact support if you have questions.</p>
                  )}
                  {order.status === "pending" && (
                    <p className="text-sm text-yellow-600 mt-1">⏳ Your order is pending approval. We'll notify you once it's confirmed.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-800 text-center">You have no orders yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;

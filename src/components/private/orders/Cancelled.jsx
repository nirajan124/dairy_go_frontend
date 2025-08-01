import React, { useEffect, useState } from "react";
import { FaEye, FaTrash, FaTimes, FaClock, FaUser, FaBox } from "react-icons/fa";
import axios from "axios";

const CancelledOrders = () => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchCancelledOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/orders");
        const cancelled = res.data.filter(order => order.status === "cancelled");
        setCancelledOrders(cancelled);
        setLastUpdate(new Date());
      } catch (err) {
        console.error("Error fetching cancelled orders:", err);
        setCancelledOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledOrders();
    
    // Refresh data every 30 seconds to get real-time updates
    const interval = setInterval(fetchCancelledOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleViewDetails = (order) => {
    const details = `Order Details:

Order ID: ${order._id}
Customer: ${order.customerId?.fname || order.fullName}
Email: ${order.email}
Phone: ${order.phone}
Product: ${order.packageId?.name}
Description: ${order.packageId?.description}
Quantity: ${order.quantity}
Price per unit: ₹${order.packageId?.price}
Total Amount: ₹${order.packageId?.price * order.quantity}
Payment Method: ${order.paymentMethod}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Status: ${order.status}`;
    
    alert(details);
  };

  const handleDeleteOrder = async (orderId) => {
    if (confirm("Are you sure you want to permanently delete this cancelled order? This action cannot be undone.")) {
      try {
        console.log("Attempting to delete order:", orderId);
        
        // Delete the order from the backend
        const response = await axios.delete(`http://localhost:3001/api/v1/orders/${orderId}`);
        
        console.log("Delete response:", response.data);
        
        // Remove the order from the local state
        setCancelledOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        
        alert("✅ Order deleted successfully!");
      } catch (err) {
        console.error("Error deleting order:", err);
        console.error("Error response:", err.response);
        
        let errorMessage = "Failed to delete order";
        if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        alert(`❌ ${errorMessage}`);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Real-time Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-blue-800 dairy-heading">Cancelled Orders</h2>
          <p className="text-gray-600 dairy-text">Last updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">Live Data</span>
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dairy-heading">Total Cancelled</h3>
              <p className="text-3xl font-bold text-red-600">{cancelledOrders.length}</p>
            </div>
            <div className="p-4 rounded-full bg-red-50 text-red-600">
              <FaTimes size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dairy-heading">Card Payments</h3>
              <p className="text-3xl font-bold text-blue-600">
                {cancelledOrders.filter(order => 
                  order.paymentMethod === "credit-card" || order.paymentMethod === "debit-card"
                ).length}
              </p>
            </div>
            <div className="p-4 rounded-full bg-blue-50 text-blue-600">
              <FaUser size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dairy-heading">Cash on Delivery</h3>
              <p className="text-3xl font-bold text-green-600">
                {cancelledOrders.filter(order => order.paymentMethod === "cash_on_delivery").length}
              </p>
            </div>
            <div className="p-4 rounded-full bg-green-50 text-green-600">
              <FaClock size={24} />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="dairy-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dairy-text">Loading cancelled orders...</p>
        </div>
      ) : cancelledOrders.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <FaTimes className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dairy-text">No cancelled orders found.</p>
            <p className="text-sm text-gray-500 mt-2">All orders are active</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-blue-800 dairy-heading">Cancelled Orders List</h3>
              <FaBox className="text-blue-600" size={20} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price/Unit</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cancelledOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>
                        <div className="font-semibold">{order.customerId?.fname || order.fullName || "Guest"}</div>
                        <div className="text-xs text-gray-500">{order.email}</div>
                        <div className="text-xs text-gray-500">{order.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>
                        <div className="font-semibold">{order.packageId?.name || "Product"}</div>
                        <div className="text-xs text-gray-500">{order.packageId?.description || "No description"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">₹{order.packageId?.price || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">₹{(order.packageId?.price * order.quantity) || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentMethod === "credit-card" || order.paymentMethod === "debit-card"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : order.paymentMethod === "cash_on_delivery"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-100 cursor-pointer transition-colors"
                          onClick={() => handleViewDetails(order)}
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-100 border border-red-300 transition-colors"
                          onClick={() => handleDeleteOrder(order._id)}
                          title="Delete Order"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelledOrders; 
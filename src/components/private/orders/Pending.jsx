import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaClock, FaUser, FaBox, FaCreditCard } from "react-icons/fa";
import axios from "axios";

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/orders");
        const pending = res.data.filter(order => order.status === "pending");
        
        // Check if new orders arrived
        if (pending.length > lastOrderCount && lastOrderCount > 0) {
          const newOrders = pending.length - lastOrderCount;
          console.log(`🎉 ${newOrders} new pending order(s) received!`);
        }
        
        setPendingOrders(pending);
        setLastOrderCount(pending.length);
        setLastUpdate(new Date());
      } catch (err) {
        console.error("Error fetching pending orders:", err);
        setPendingOrders([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchPendingOrders();
    
    // Refresh data every 10 seconds for real-time updates
    const interval = setInterval(fetchPendingOrders, 10000);
    
    // Also refresh when window gains focus
    const handleFocus = () => {
      fetchPendingOrders();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleApprove = async (orderId) => {
    if (confirm("Are you sure you want to approve this order?")) {
      try {
        const response = await axios.put(`http://localhost:3001/api/v1/orders/${orderId}/confirm`);
        
        // Refresh the list immediately
        setLoading(true);
        const res = await axios.get("http://localhost:3001/api/v1/orders");
        const pending = res.data.filter(order => order.status === "pending");
        setPendingOrders(pending);
        setLoading(false);
        
        alert("✅ Order approved successfully! Order moved to Confirmed section.");
      } catch (err) {
        console.error("Error approving order:", err);
        alert(`❌ Failed to approve order: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const handleCancel = async (orderId) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      try {
        const response = await axios.put(`http://localhost:3001/api/v1/orders/${orderId}/cancel`);
        
        // Refresh the list immediately
        setLoading(true);
        const res = await axios.get("http://localhost:3001/api/v1/orders");
        const pending = res.data.filter(order => order.status === "pending");
        setPendingOrders(pending);
        setLoading(false);
        
        alert("❌ Order cancelled successfully! Order moved to Cancelled section.");
      } catch (err) {
        console.error("Error cancelling order:", err);
        alert(`❌ Failed to cancel order: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Real-time Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-blue-800 dairy-heading">Pending Orders</h2>
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
              <h3 className="text-lg font-semibold text-gray-800 dairy-heading">Total Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">{pendingOrders.length}</p>
            </div>
            <div className="p-4 rounded-full bg-yellow-50 text-yellow-600">
              <FaClock size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dairy-heading">Card Payments</h3>
              <p className="text-3xl font-bold text-blue-600">
                {pendingOrders.filter(order => 
                  order.paymentMethod === "credit-card" || order.paymentMethod === "debit-card"
                ).length}
              </p>
            </div>
            <div className="p-4 rounded-full bg-blue-50 text-blue-600">
              <FaCreditCard size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dairy-heading">Cash on Delivery</h3>
              <p className="text-3xl font-bold text-green-600">
                {pendingOrders.filter(order => order.paymentMethod === "cash_on_delivery").length}
              </p>
            </div>
            <div className="p-4 rounded-full bg-green-50 text-green-600">
              <FaUser size={24} />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="dairy-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dairy-text">Loading pending orders...</p>
        </div>
      ) : pendingOrders.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <FaClock className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dairy-text">No pending orders found.</p>
            <p className="text-sm text-gray-500 mt-2">All orders have been processed</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-blue-800 dairy-heading">Pending Orders List</h3>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => (
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
                      <div className="flex space-x-2">
                        <button
                          className="text-green-500 hover:text-green-700 p-2 rounded hover:bg-green-100 transition-colors"
                          onClick={() => handleApprove(order._id)}
                          title="Approve Order"
                        >
                          <FaCheck size={16} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-100 transition-colors"
                          onClick={() => handleCancel(order._id)}
                          title="Cancel Order"
                        >
                          <FaTimes size={16} />
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

export default PendingOrders;

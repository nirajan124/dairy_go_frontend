import React, { useEffect, useState } from "react";
import axios from "axios";

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastOrderCount, setLastOrderCount] = useState(0);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        console.log("Fetching pending orders...");
        console.log("Making request to: http://localhost:3001/api/v1/orders");
        const res = await axios.get("http://localhost:3001/api/v1/orders");
        console.log("All orders received:", res.data);
        const pending = res.data.filter(order => order.status === "pending");
        console.log("Filtered pending orders:", pending);
        
        // Check if new orders arrived
        if (pending.length > lastOrderCount && lastOrderCount > 0) {
          const newOrders = pending.length - lastOrderCount;
          alert(`🎉 ${newOrders} new pending order(s) received!`);
        }
        
        setPendingOrders(pending);
        setLastOrderCount(pending.length);
      } catch (err) {
        console.error("Error fetching pending orders:", err);
        console.error("Error details:", {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          url: err.config?.url
        });
        
        if (err.response?.status === 404) {
          console.error("404 Error - Endpoint not found. Check if backend server is running on port 3001");
        } else if (err.code === "ERR_NETWORK") {
          console.error("Network Error - Backend server might not be running");
        }
        
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
      console.log("Window focused, refreshing pending orders...");
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
        console.log("Approving order:", orderId);
        const response = await axios.put(`http://localhost:3001/api/v1/orders/${orderId}/confirm`);
        console.log("Approval response:", response.data);
        
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
        console.log("Cancelling order:", orderId);
        const response = await axios.put(`http://localhost:3001/api/v1/orders/${orderId}/cancel`);
        console.log("Cancellation response:", response.data);
        
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Pending Orders</h2>
        {loading && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm">Refreshing...</span>
          </div>
        )}
      </div>
      
      {/* Debug Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
        <p className="text-sm text-yellow-700">
          Total orders found: {pendingOrders.length} | 
          Last updated: {new Date().toLocaleTimeString()}
        </p>
        <div className="flex gap-2 mt-2">
          <button 
            onClick={async () => {
              try {
                const res = await axios.get("http://localhost:3001/api/v1/orders");
                console.log("All orders:", res.data);
                alert(`Total orders in system: ${res.data.length}\nStatuses: ${res.data.map(o => o.status).join(', ')}`);
              } catch (err) {
                console.error("Debug error:", err);
              }
            }}
            className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-sm hover:bg-yellow-300"
          >
            Check All Orders
          </button>
          <button 
            onClick={() => {
              setLoading(true);
              const fetchPendingOrders = async () => {
                try {
                  const res = await axios.get("http://localhost:3001/api/v1/orders");
                  const pending = res.data.filter(order => order.status === "pending");
                  setPendingOrders(pending);
                } catch (err) {
                  console.error("Error refreshing:", err);
                } finally {
                  setLoading(false);
                }
              };
              fetchPendingOrders();
            }}
            className="px-3 py-1 bg-green-200 text-green-800 rounded text-sm hover:bg-green-300"
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading pending orders...</p>
        </div>
      ) : pendingOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No pending orders found.</p>
          <p className="text-sm text-gray-500 mt-2">Debug: Check if orders are being created with 'pending' status</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price/Unit</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-100">
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
                  <td className="px-6 py-4 text-sm text-gray-700">₹{order.packageId?.price || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">₹{(order.packageId?.price * order.quantity) || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.paymentMethod === "credit-card" || order.paymentMethod === "debit-card"
                        ? "bg-blue-100 text-blue-800"
                        : order.paymentMethod === "cash_on_delivery"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      className="text-green-500 hover:text-green-700 mr-4"
                      onClick={() => handleApprove(order._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleCancel(order._id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingOrders;

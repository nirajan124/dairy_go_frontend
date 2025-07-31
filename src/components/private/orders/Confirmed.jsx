import React, { useEffect, useState } from "react";
import axios from "axios";

const ConfirmedOrders = () => {
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfirmedOrders = async (retryCount = 0) => {
      try {
        console.log("Fetching confirmed orders... (attempt", retryCount + 1, ")");
        const apiUrl = "http://localhost:3001/api/v1/orders";
        console.log("Making request to:", apiUrl);
        console.log("Axios config:", {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        // Test if the URL is accessible
        console.log("Testing URL accessibility...");
        try {
          const testResponse = await fetch(apiUrl);
          console.log("Fetch test response:", testResponse.status, testResponse.statusText);
        } catch (fetchErr) {
          console.error("Fetch test failed:", fetchErr);
        }
        
        const res = await axios.get(apiUrl, {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log("All orders received:", res.data);
        const confirmed = res.data.filter(order => order.status === "confirmed");
        console.log("Filtered confirmed orders:", confirmed);
        setConfirmedOrders(confirmed);
      } catch (err) {
        console.error("Error fetching confirmed orders:", err);
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
        
        // Retry logic for network errors
        if ((err.code === "ERR_NETWORK" || err.response?.status === 404) && retryCount < 3) {
          console.log("Retrying in 2 seconds...");
          setTimeout(() => fetchConfirmedOrders(retryCount + 1), 2000);
          return;
        }
        
        setConfirmedOrders([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchConfirmedOrders();
    
    // Refresh data every 10 seconds for real-time updates
    const interval = setInterval(() => fetchConfirmedOrders(), 10000);
    
    // Also refresh when window gains focus
    const handleFocus = () => {
      console.log("Window focused, refreshing confirmed orders...");
      fetchConfirmedOrders();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Confirmed Orders</h2>
        {loading && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm">Refreshing...</span>
          </div>
        )}
      </div>
      
      {/* Debug Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Debug Information</h3>
        <p className="text-sm text-green-700">
          Total confirmed orders found: {confirmedOrders.length} | 
          Last updated: {new Date().toLocaleTimeString()}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className={`w-3 h-3 rounded-full ${confirmedOrders.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs">
            {confirmedOrders.length > 0 ? '✅ Backend Connected' : '❌ Backend Disconnected'}
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          <button 
            onClick={async () => {
              try {
                console.log("Testing backend connection...");
                const res = await axios.get("http://localhost:3001/api/v1/orders");
                console.log("All orders:", res.data);
                alert(`✅ Backend connected!\nTotal orders: ${res.data.length}\nStatuses: ${res.data.map(o => o.status).join(', ')}`);
              } catch (err) {
                console.error("Backend connection test failed:", err);
                alert(`❌ Backend connection failed!\nError: ${err.message}\nStatus: ${err.response?.status || 'No response'}`);
              }
            }}
            className="px-3 py-1 bg-green-200 text-green-800 rounded text-sm hover:bg-green-300"
          >
            🔧 Test Backend Connection
          </button>
          <button 
            onClick={async () => {
              try {
                console.log("Testing products endpoint...");
                const res = await axios.get("http://localhost:3001/api/v1/products");
                console.log("Products:", res.data);
                alert(`✅ Products endpoint working!\nTotal products: ${res.data.length}`);
              } catch (err) {
                console.error("Products endpoint test failed:", err);
                alert(`❌ Products endpoint failed!\nError: ${err.message}\nStatus: ${err.response?.status || 'No response'}`);
              }
            }}
            className="px-3 py-1 bg-blue-200 text-blue-800 rounded text-sm hover:bg-blue-300"
          >
            🧪 Test Products Endpoint
          </button>
          <button 
            onClick={() => {
              setLoading(true);
              const fetchConfirmedOrders = async () => {
                try {
                  const res = await axios.get("http://localhost:3001/api/v1/orders");
                  const confirmed = res.data.filter(order => order.status === "confirmed");
                  setConfirmedOrders(confirmed);
                } catch (err) {
                  console.error("Error refreshing:", err);
                } finally {
                  setLoading(false);
                }
              };
              fetchConfirmedOrders();
            }}
            className="px-3 py-1 bg-blue-200 text-blue-800 rounded text-sm hover:bg-blue-300"
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading confirmed orders...</p>
        </div>
      ) : confirmedOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No confirmed orders found.</p>
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {confirmedOrders.map((order) => (
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
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => alert(`Order Details:\n\nOrder ID: ${order._id}\nCustomer: ${order.customerId?.fname || order.fullName}\nEmail: ${order.email}\nPhone: ${order.phone}\nProduct: ${order.packageId?.name}\nDescription: ${order.packageId?.description}\nQuantity: ${order.quantity}\nPrice per unit: ₹${order.packageId?.price}\nTotal Amount: ₹${order.packageId?.price * order.quantity}\nPayment Method: ${order.paymentMethod}\nOrder Date: ${new Date(order.createdAt).toLocaleDateString()}\nStatus: ${order.status}`)}
                    >
                      View Details
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

export default ConfirmedOrders;

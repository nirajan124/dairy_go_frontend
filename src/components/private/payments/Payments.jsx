import React, { useEffect, useState } from "react";
import { FaEye, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";

// Debug: Check if icons are imported correctly
console.log("React Icons imported:", { FaEye, FaTrash, FaCheck, FaTimes });

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastPaymentCount, setLastPaymentCount] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Get orders with payment information
        const res = await axios.get("http://localhost:3001/api/v1/orders");
        console.log("All orders fetched:", res.data);
        const ordersWithPayments = res.data.filter(order => 
          order.paymentMethod && order.paymentMethod !== "cash_on_delivery"
        );
        console.log("Orders with payments:", ordersWithPayments);
        
        // Check if new payments arrived
        if (ordersWithPayments.length > lastPaymentCount && lastPaymentCount > 0) {
          const newPayments = ordersWithPayments.length - lastPaymentCount;
          alert(`💳 ${newPayments} new payment(s) received!`);
        }
        
        setPayments(ordersWithPayments);
        setLastPaymentCount(ordersWithPayments.length);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchPayments();
    
    // Refresh data every 10 seconds for real-time updates
    const interval = setInterval(fetchPayments, 10000);
    
    // Also refresh when window gains focus
    const handleFocus = () => {
      console.log("Window focused, refreshing payments...");
      fetchPayments();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleViewDetails = (payment) => {
    console.log("handleViewDetails called with payment:", payment);
    alert(`Payment Details:\nOrder ID: ${payment._id}\nCustomer: ${payment.customerId?.fname || payment.fullName}\nProduct: ${payment.packageId?.name}\nQuantity: ${payment.quantity}\nAmount: ₹${payment.packageId?.price * payment.quantity}\nMethod: ${payment.paymentMethod}\nStatus: ${payment.status}\nDate: ${new Date(payment.createdAt).toLocaleDateString()}`);
  };



  const handleRefund = async (orderId) => {
    if (confirm("Are you sure you want to refund this payment?")) {
      try {
        // Update order status to cancelled (refund)
        await axios.put(`http://localhost:3001/api/v1/orders/${orderId}/cancel`);
        // Refresh payments
        const res = await axios.get("http://localhost:3001/api/v1/orders");
        const ordersWithPayments = res.data.filter(order => 
          order.paymentMethod && order.paymentMethod !== "cash_on_delivery"
        );
        setPayments(ordersWithPayments);
        alert("Payment refunded successfully!");
      } catch (err) {
        console.error("Error refunding payment:", err);
        alert("Failed to refund payment.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Payments</h2>
        {loading && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm">Refreshing...</span>
          </div>
        )}
      </div>
      
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800">Total Payments</h3>
          <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800">Active Payments</h3>
          <p className="text-2xl font-bold text-green-600">{payments.filter(p => p.status !== "cancelled").length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800">Cancelled</h3>
          <p className="text-2xl font-bold text-red-600">{payments.filter(p => p.status === "cancelled").length}</p>
        </div>
      </div>

      {/* Debug Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <button 
          onClick={() => {
            console.log("Debug button clicked");
            alert("Debug button working! Component is rendering correctly.");
          }}
          className="px-3 py-1 bg-red-200 text-red-800 rounded text-sm hover:bg-red-300 mb-2"
        >
          🐛 Test Component Rendering
        </button>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Payment Debug Information</h3>
        <p className="text-sm text-blue-700">
          Total payments found: {payments.length} | 
          Last updated: {new Date().toLocaleTimeString()}
        </p>
        <div className="flex gap-2 mt-2">

          <button 
            onClick={() => {
              console.log("Testing approval function...");
              const testOrderId = payments.find(p => p.status === "pending")?._id;
              if (testOrderId) {
                console.log("Testing with order ID:", testOrderId);
                handleApprovePayment(testOrderId);
              } else {
                alert("No pending orders to test with");
              }
            }}
            className="px-3 py-1 bg-purple-200 text-purple-800 rounded text-sm hover:bg-purple-300"
          >
            🧪 Test Approval
          </button>
          <button 
            onClick={async () => {
              try {
                console.log("Testing backend connection...");
                const response = await axios.get("http://localhost:3001/api/v1/orders/test/routes");
                console.log("Backend test response:", response.data);
                alert("✅ Backend connection working! Check console for details.");
              } catch (err) {
                console.error("Backend test failed:", err);
                alert("❌ Backend connection failed. Check console for details.");
              }
            }}
            className="px-3 py-1 bg-orange-200 text-orange-800 rounded text-sm hover:bg-orange-300"
          >
            🔧 Test Backend
          </button>
          <button 
            onClick={async () => {
              try {
                const res = await axios.get("http://localhost:3001/api/v1/orders");
                console.log("All orders for payment debug:", res.data);
                const cardPayments = res.data.filter(o => o.paymentMethod && o.paymentMethod !== "cash_on_delivery");
                alert(`Total orders: ${res.data.length}\nCard payments: ${cardPayments.length}\nStatuses: ${res.data.map(o => o.status).join(', ')}`);
              } catch (err) {
                console.error("Payment debug error:", err);
              }
            }}
            className="px-3 py-1 bg-blue-200 text-blue-800 rounded text-sm hover:bg-blue-300"
          >
            Check All Payments
          </button>
          <button 
            onClick={() => {
              setLoading(true);
              const fetchPayments = async () => {
                try {
                  const res = await axios.get("http://localhost:3001/api/v1/orders");
                  const ordersWithPayments = res.data.filter(order => 
                    order.paymentMethod && order.paymentMethod !== "cash_on_delivery"
                  );
                  setPayments(ordersWithPayments);
                } catch (err) {
                  console.error("Error refreshing payments:", err);
                } finally {
                  setLoading(false);
                }
              };
              fetchPayments();
            }}
            className="px-3 py-1 bg-green-200 text-green-800 rounded text-sm hover:bg-green-300"
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No payments found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className={`border-b hover:bg-gray-100 ${
                  payment.status === "pending" ? "bg-yellow-50" : ""
                }`}>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {payment._id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>
                      <div className="font-semibold">{payment.customerId?.fname || payment.fullName || "Guest"}</div>
                      <div className="text-xs text-gray-500">{payment.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>
                      <div className="font-semibold">{payment.packageId?.name || "Product"}</div>
                      <div className="text-xs text-gray-500">{payment.packageId?.description || "No description"}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ₹{payment.packageId?.price * payment.quantity || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      payment.paymentMethod === "credit-card" || payment.paymentMethod === "debit-card"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        payment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.status === "pending" ? "⏳ PENDING APPROVAL" : payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex space-x-2">
                                              <button
                          className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-100 cursor-pointer"
                          onClick={() => {
                            console.log("View button clicked for payment:", payment._id);
                            alert("View button clicked! Testing functionality...");
                            handleViewDetails(payment);
                          }}
                          title="View Details"
                          style={{ pointerEvents: 'auto' }}
                        >
                          {FaEye ? <FaEye size={16} /> : "👁️"}
                        </button>
                      
                      {payment.status === "pending" && (
                        <span className="text-yellow-600 text-sm font-medium">⏳ Processing</span>
                      )}
                      
                      {payment.status === "confirmed" && (
                        <button
                          className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-100 border border-red-300"
                          onClick={() => {
                            console.log("Refund button clicked for order:", payment._id);
                            handleRefund(payment._id);
                          }}
                          title="Refund Payment"
                        >
                          {FaTrash ? <FaTrash size={16} /> : "🗑️"}
                        </button>
                      )}
                    </div>
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

export default Payments;

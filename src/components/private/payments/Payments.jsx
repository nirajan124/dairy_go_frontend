import React, { useEffect, useState } from "react";
import { FaEye, FaTrash, FaCheck, FaTimes, FaCreditCard, FaChartBar } from "react-icons/fa";
import axios from "axios";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastPaymentCount, setLastPaymentCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Get orders with payment information
        const res = await axios.get("http://localhost:3001/api/v1/orders");
        const ordersWithPayments = res.data.filter(order => 
          order.paymentMethod && order.paymentMethod !== "cash_on_delivery"
        );
        
        // Check if new payments arrived
        if (ordersWithPayments.length > lastPaymentCount && lastPaymentCount > 0) {
          const newPayments = ordersWithPayments.length - lastPaymentCount;
          // Show a more subtle notification instead of alert
          console.log(`💳 ${newPayments} new payment(s) received!`);
        }
        
        setPayments(ordersWithPayments);
        setLastPaymentCount(ordersWithPayments.length);
        setLastUpdate(new Date());
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
      fetchPayments();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleViewDetails = (payment) => {
    const details = `Payment Details:
Order ID: ${payment._id}
Customer: ${payment.customerId?.fname || payment.fullName}
Product: ${payment.packageId?.name}
Quantity: ${payment.quantity}
Amount: ₹${payment.packageId?.price * payment.quantity}
Method: ${payment.paymentMethod}
Status: ${payment.status}
Date: ${new Date(payment.createdAt).toLocaleDateString()}`;
    
    alert(details);
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
    <div className="p-6 space-y-6">
      {/* Header with Real-time Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-blue-800 dairy-heading">Payments</h2>
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
              <h3 className="text-lg font-semibold text-gray-800 dairy-heading">Total Payments</h3>
              <p className="text-3xl font-bold text-blue-600">{payments.length}</p>
            </div>
            <div className="p-4 rounded-full bg-blue-50 text-blue-600">
              <FaCreditCard size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dairy-heading">Active Payments</h3>
              <p className="text-3xl font-bold text-green-600">{payments.filter(p => p.status !== "cancelled").length}</p>
            </div>
            <div className="p-4 rounded-full bg-green-50 text-green-600">
              <FaCheck size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dairy-heading">Cancelled</h3>
              <p className="text-3xl font-bold text-red-600">{payments.filter(p => p.status === "cancelled").length}</p>
            </div>
            <div className="p-4 rounded-full bg-red-50 text-red-600">
              <FaTimes size={24} />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="dairy-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dairy-text">Loading payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <FaCreditCard className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dairy-text">No payments found.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-blue-800 dairy-heading">Payment Transactions</h3>
              <FaChartBar className="text-blue-600" size={20} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    payment.status === "pending" ? "bg-yellow-50" : ""
                  }`}>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
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
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                      ₹{payment.packageId?.price * payment.quantity || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.paymentMethod === "credit-card" || payment.paymentMethod === "debit-card"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}>
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === "confirmed"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {payment.status === "pending" ? "⏳ PENDING APPROVAL" : payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-100 cursor-pointer transition-colors"
                          onClick={() => handleViewDetails(payment)}
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        
                        {payment.status === "pending" && (
                          <span className="text-yellow-600 text-sm font-medium">⏳ Processing</span>
                        )}
                        
                        {payment.status === "confirmed" && (
                          <button
                            className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-100 border border-red-300 transition-colors"
                            onClick={() => handleRefund(payment._id)}
                            title="Refund Payment"
                          >
                            <FaTrash size={16} />
                          </button>
                        )}
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

export default Payments;

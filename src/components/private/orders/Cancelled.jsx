import React, { useEffect, useState } from "react";
import axios from "axios";

const CancelledOrders = () => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCancelledOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/orders");
        const cancelled = res.data.filter(order => order.status === "cancelled");
        console.log("Cancelled orders fetched:", cancelled);
        setCancelledOrders(cancelled);
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Cancelled Orders</h2>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading cancelled orders...</p>
        </div>
      ) : cancelledOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No cancelled orders found.</p>
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
              {cancelledOrders.map((order) => (
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
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
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

export default CancelledOrders; 
import React, { useEffect, useState } from "react";
import axios from "axios";

const ConfirmedOrders = () => {
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfirmedOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/bookings");
        const confirmed = res.data.filter(booking => booking.status === "confirmed");
        setConfirmedOrders(confirmed);
      } catch (err) {
        console.error("Error fetching confirmed orders:", err);
        setConfirmedOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Confirmed Orders</h2>

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
                    {order.customerId?.fname || order.fullName || "Guest"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.packageId?.name || "Product"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.tickets}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.paymentMethod}</td>
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
                      onClick={() => alert(`Order ID: ${order._id}\nCustomer: ${order.customerId?.fname || order.fullName}\nProduct: ${order.packageId?.name}\nQuantity: ${order.tickets}\nPayment: ${order.paymentMethod}`)}
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

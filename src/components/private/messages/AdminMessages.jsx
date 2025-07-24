import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/contact", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data || []);
      } catch (err) {
        setError("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Contact Messages</h2>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      ) : messages.length === 0 ? (
        <div className="text-gray-600">No messages found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Message</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-700">{msg.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{msg.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{msg.phone || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{msg.subject || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{msg.message}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{msg.date ? new Date(msg.date).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMessages; 
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-700">{msg.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{msg.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{msg.phone || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{msg.subject || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{msg.date ? new Date(msg.date).toLocaleString() : "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button className="text-blue-600 hover:underline" onClick={() => setSelectedMessage(msg)}>View</button>
                    {!msg.read && (
                      <button
                        className="ml-3 text-green-600 hover:underline"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");
                            await axios.patch(`/api/v1/contact/${msg._id}/read`, {}, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            setMessages(messages => messages.map(m => m._id === msg._id ? { ...m, read: true } : m));
                          } catch (err) {
                            alert("Failed to mark as read.");
                          }
                        }}
                      >
                        Mark as Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for viewing message details */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
            <button onClick={() => setSelectedMessage(null)} className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700 focus:outline-none" aria-label="Close">&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-blue-700">Message Details</h3>
            <div className="space-y-2">
              <div><span className="font-semibold text-gray-700">Name:</span> {selectedMessage.name}</div>
              <div><span className="font-semibold text-gray-700">Email:</span> {selectedMessage.email}</div>
              <div><span className="font-semibold text-gray-700">Phone:</span> {selectedMessage.phone || "-"}</div>
              <div><span className="font-semibold text-gray-700">Subject:</span> {selectedMessage.subject || "-"}</div>
              <div><span className="font-semibold text-gray-700">Date:</span> {selectedMessage.date ? new Date(selectedMessage.date).toLocaleString() : "-"}</div>
              <div><span className="font-semibold text-gray-700">Message:</span> <div className="mt-2 p-3 bg-gray-100 rounded">{selectedMessage.message}</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages; 